import Stripe from 'npm:stripe@14.8.0';

function generateVoucherCode() {
  return 'WM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function sendEmailViaResend(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Wesoły Masaż <noreply@wesoly-masaz.pl>',
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    console.error(`Failed to send email to ${to}:`, await response.text());
  }
}

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      const code = generateVoucherCode();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 12);
      const expiresDateStr = expiresAt.toISOString().split('T')[0];

      // Zapisz voucher w bazie
      const { createClientFromRequest } = await import('npm:@base44/sdk@0.8.31');
      const baseClient = createClientFromRequest(req);

      const voucherData = {
        voucher_code: code,
        type: metadata.voucherType,
        value: Number(metadata.voucherValue),
        service_id: metadata.voucherType === 'service' ? 'placeholder' : undefined,
        service_name: metadata.serviceName || undefined,
        buyer_name: metadata.buyerName,
        buyer_email: metadata.buyerEmail,
        recipient_name: metadata.recipientName,
        dedication: metadata.dedication || undefined,
        expires_at: expiresDateStr,
        payment_status: 'paid',
        status: 'active',
      };

      await baseClient.asServiceRole.entities.Voucher.create(voucherData);

      // Email do kupującego
      await sendEmailViaResend(
        metadata.buyerEmail,
        `Voucher prezentowy Wesoły Masaż — ${code}`,
        `
          <h2>Cześć ${metadata.buyerName}!</h2>
          <p>Twój voucher został pomyślnie aktywowany.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A96E;">
            <p><strong>Kod vouchera:</strong> ${code}</p>
            <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${metadata.serviceName}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
            <p><strong>Dla:</strong> ${metadata.recipientName}</p>
            <p><strong>Ważny do:</strong> ${expiresDateStr}</p>
          </div>
          <p>Voucher można wykorzystać przy rezerwacji na stronie lub telefonicznie.</p>
          <p style="color: #999; font-size: 12px;">Wesoły Masaż · wesoly-masaz.pl</p>
        `
      );

      // Email do obdarowanego (jeśli podany i różny od kupującego)
      if (metadata.recipientEmail && metadata.recipientEmail !== metadata.buyerEmail) {
        await sendEmailViaResend(
          metadata.recipientEmail,
          'Masz voucher prezentowy Wesoły Masaż! 🎁',
          `
            <h2>Cześć ${metadata.recipientName}!</h2>
            <p>Ktoś pomyślał o Tobie i podarował Ci wyjątkowy prezent — voucher na masaż.</p>
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A96E;">
              <p><strong>Kod vouchera:</strong> ${code}</p>
              <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${metadata.serviceName}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
              <p><strong>Ważny do:</strong> ${expiresDateStr}</p>
              ${metadata.dedication ? `<p style="font-style: italic; color: #666;">"${metadata.dedication}"</p>` : ''}
            </div>
            <p>Zarezerwuj swoją wizytę na stronie <strong>wesoly-masaz.pl</strong> lub zadzwoń.</p>
            <p style="color: #999; font-size: 12px;">Wesoły Masaż · wesoly-masaz.pl</p>
          `
        );
      }

      // Email do właściciela
      await sendEmailViaResend(
        Deno.env.get('OWNER_EMAIL'),
        `Nowy voucher sprzedany — ${code}`,
        `
          <h2>Nowa sprzedaż vouchera</h2>
          <p><strong>Kod:</strong> ${code}</p>
          <p><strong>Kupujący:</strong> ${metadata.buyerName} (${metadata.buyerEmail})</p>
          <p><strong>Odbiorca:</strong> ${metadata.recipientName}</p>
          <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${metadata.serviceName}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
          <p><strong>Kwota:</strong> ${metadata.voucherValue} PLN</p>
          <p><strong>Ważny do:</strong> ${expiresDateStr}</p>
        `
      );

      console.log(`Voucher ${code} created and emails sent`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});