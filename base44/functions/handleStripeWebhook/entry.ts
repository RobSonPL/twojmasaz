import Stripe from 'npm:stripe@14.8.0';

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    if (!signature) {
      return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      // Handle package purchase
      if (metadata.purchaseType === 'package') {
        const { createClientFromRequest } = await import('npm:@base44/sdk@0.8.31');
        const baseClient = createClientFromRequest(req);
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 12);
        const expiresDateStr = expiresAt.toISOString().split('T')[0];

        await baseClient.asServiceRole.entities.Package.create({
          name: metadata.templateName,
          total_visits: Number(metadata.totalVisits),
          remaining_visits: Number(metadata.totalVisits),
          price: Number(metadata.price),
          service_name: metadata.serviceName || undefined,
          owner_name: metadata.ownerName,
          owner_email: metadata.ownerEmail,
          owner_phone: metadata.ownerPhone || undefined,
          status: 'active',
          payment_status: 'paid',
          expires_at: expiresDateStr,
        });

        await sendEmailViaResend(
          metadata.ownerEmail,
          `Twój karnet Wesoły Masaż — ${metadata.templateName}`,
          `<h2>Cześć ${escapeHTML(metadata.ownerName)}!</h2>
          <p>Twój karnet masażowy został aktywowany.</p>
          <div style="background:#f5f5f5;padding:20px;margin:20px 0;border-left:4px solid #C9A96E;">
            <p><strong>Pakiet:</strong> ${escapeHTML(metadata.templateName)}</p>
            <p><strong>Liczba wizyt:</strong> ${metadata.totalVisits}</p>
            <p><strong>Ważny do:</strong> ${expiresDateStr}</p>
          </div>
          <p>Zarezerwuj pierwszą wizytę na <strong>wesoly-masaz.pl</strong></p>
          <p style="color:#999;font-size:12px;">Wesoły Masaż · wesoly-masaz.pl</p>`
        );

        await sendEmailViaResend(
          Deno.env.get('OWNER_EMAIL'),
          `Nowy karnet sprzedany — ${metadata.templateName}`,
          `<h2>Nowa sprzedaż karnetu</h2>
          <p><strong>Pakiet:</strong> ${escapeHTML(metadata.templateName)}</p>
          <p><strong>Klient:</strong> ${escapeHTML(metadata.ownerName)} (${metadata.ownerEmail})</p>
          <p><strong>Wizyty:</strong> ${metadata.totalVisits}</p>
          <p><strong>Kwota:</strong> ${metadata.price} PLN</p>`
        );

        console.log(`Package ${metadata.templateName} created for ${metadata.ownerEmail}`);
        return Response.json({ received: true });
      }

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
          <h2>Cześć ${escapeHTML(metadata.buyerName)}!</h2>
          <p>Twój voucher został pomyślnie aktywowany.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A96E;">
            <p><strong>Kod vouchera:</strong> ${code}</p>
            <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${escapeHTML(metadata.serviceName)}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
            <p><strong>Dla:</strong> ${escapeHTML(metadata.recipientName)}</p>
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
            <h2>Cześć ${escapeHTML(metadata.recipientName)}!</h2>
            <p>Ktoś pomyślał o Tobie i podarował Ci wyjątkowy prezent — voucher na masaż.</p>
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A96E;">
              <p><strong>Kod vouchera:</strong> ${code}</p>
              <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${escapeHTML(metadata.serviceName)}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
              <p><strong>Ważny do:</strong> ${expiresDateStr}</p>
              ${metadata.dedication ? `<p style="font-style: italic; color: #666;">"${escapeHTML(metadata.dedication)}"</p>` : ''}
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
          <p><strong>Kupujący:</strong> ${escapeHTML(metadata.buyerName)} (${metadata.buyerEmail})</p>
          <p><strong>Odbiorca:</strong> ${escapeHTML(metadata.recipientName)}</p>
          <p><strong>Rodzaj:</strong> ${metadata.voucherType === 'service' ? `Usługa: ${escapeHTML(metadata.serviceName)}` : `Kwota: ${metadata.voucherValue} PLN`}</p>
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