import Stripe from 'npm:stripe@14.8.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { templateId, ownerName, ownerEmail, ownerPhone } = body;

    // Fetch the template server-side to get the verified price — never trust client-supplied price
    const template = await base44.asServiceRole.entities.PackageTemplate.get(templateId);
    if (!template) {
      return Response.json({ error: 'Nie znaleziono pakietu' }, { status: 404 });
    }

    const verifiedPrice = template.price;
    const verifiedVisitsCount = template.visits_count;
    const verifiedBonusVisits = template.bonus_visits || 0;
    const verifiedTemplateName = template.name;
    const verifiedServiceName = template.service_name || '';

    const totalVisits = verifiedVisitsCount + verifiedBonusVisits;
    const label = verifiedBonusVisits > 0 ? `${verifiedVisitsCount} wizyt + ${verifiedBonusVisits} gratis` : `${verifiedVisitsCount} wizyt`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: verifiedTemplateName,
              description: `${label}${verifiedServiceName ? ` — ${verifiedServiceName}` : ''}`,
            },
            unit_amount: Math.round(verifiedPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/konto?package_success=true`,
      cancel_url: `${new URL(req.url).origin}/pakiety`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        purchaseType: 'package',
        templateName: verifiedTemplateName,
        visitsCount: verifiedVisitsCount.toString(),
        bonusVisits: verifiedBonusVisits.toString(),
        totalVisits: totalVisits.toString(),
        price: verifiedPrice.toString(),
        serviceName: verifiedServiceName,
        ownerName,
        ownerEmail,
        ownerPhone: ownerPhone || '',
      },
    });

    return Response.json({ sessionId: session.id, publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY') });
  } catch (error) {
    console.error('Package checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});