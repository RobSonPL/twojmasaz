import Stripe from 'npm:stripe@14.8.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { voucherType, voucherValue, serviceId, serviceName, recipientName, buyerEmail, recipientEmail, buyerName, dedication } = body;

    let verifiedValue;
    let verifiedServiceName = serviceName || '';

    if (voucherType === 'service') {
      // Fetch the service server-side to get the verified price — never trust client-supplied value
      const service = await base44.asServiceRole.entities.Service.get(serviceId);
      if (!service) {
        return Response.json({ error: 'Nie znaleziono usługi' }, { status: 404 });
      }
      verifiedValue = service.price;
      verifiedServiceName = service.name;
    } else {
      // Value voucher — user-chosen amount, validate it's positive
      verifiedValue = Number(voucherValue);
      if (!verifiedValue || verifiedValue <= 0) {
        return Response.json({ error: 'Nieprawidłowa wartość vouchera' }, { status: 400 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: `Voucher - ${voucherType === 'service' ? verifiedServiceName : `${verifiedValue} zł`}`,
              description: `Voucher dla ${recipientName}`,
            },
            unit_amount: Math.round(verifiedValue * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/?checkout_success=true`,
      cancel_url: `${new URL(req.url).origin}/vouchery`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        voucherType,
        voucherValue: verifiedValue.toString(),
        serviceName: verifiedServiceName,
        recipientName,
        recipientEmail: recipientEmail || '',
        buyerName,
        buyerEmail,
        dedication: dedication || '',
      },
    });

    return Response.json({ sessionId: session.id, publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY') });
  } catch (error) {
    console.error('Stripe error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});