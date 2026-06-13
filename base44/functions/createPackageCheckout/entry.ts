import Stripe from 'npm:stripe@14.8.0';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const body = await req.json();

    const { templateId, templateName, visitsCount, bonusVisits, price, serviceName, ownerName, ownerEmail, ownerPhone } = body;

    const totalVisits = visitsCount + (bonusVisits || 0);
    const label = bonusVisits > 0 ? `${visitsCount} wizyt + ${bonusVisits} gratis` : `${visitsCount} wizyt`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: templateName,
              description: `${label}${serviceName ? ` — ${serviceName}` : ''}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/konto?package_success=true`,
      cancel_url: `${new URL(req.url).origin}/pakiety`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        purchaseType: 'package',
        templateName,
        visitsCount: visitsCount.toString(),
        bonusVisits: (bonusVisits || 0).toString(),
        totalVisits: totalVisits.toString(),
        price: price.toString(),
        serviceName: serviceName || '',
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