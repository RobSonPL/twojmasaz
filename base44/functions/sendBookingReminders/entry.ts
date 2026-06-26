import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by a scheduled automation (no user auth needed)
    // Use service role for all operations
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Find all confirmed bookings for tomorrow that haven't had a reminder sent
    const bookings = await base44.asServiceRole.entities.Booking.filter({
      booking_date: tomorrowStr,
      status: 'confirmed',
      reminder_sent: false,
    });

    let sent = 0;
    const errors = [];

    for (const booking of bookings) {
      try {
        const typeLabel = booking.booking_type === 'home'
          ? `dojazd do Ciebie (${booking.address})`
          : 'salon stacjonarny';

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.client_email,
          subject: `Przypomnienie o wizycie jutro — ${booking.service_name}`,
          body:
            `Cześć ${booking.client_name}!\n\n` +
            `Przypominamy o jutrzejszej wizycie:\n\n` +
            `📋 Usługa: ${booking.service_name}\n` +
            `📅 Data: ${booking.booking_date}\n` +
            `🕐 Godzina: ${booking.booking_time}\n` +
            `📍 Tryb: ${typeLabel}\n` +
            `💰 Kwota: ${booking.service_price} PLN\n\n` +
            `Jeśli potrzebujesz odwołać lub zmienić termin, skontaktuj się jak najszybciej:\n` +
            `📞 WhatsApp: +48 787 907 141\n\n` +
            `Do zobaczenia jutro!\n` +
            `Wesoły Masaż`,
        });

        // Mark reminder as sent
        await base44.asServiceRole.entities.Booking.update(booking.id, {
          reminder_sent: true,
        });

        sent++;
      } catch (err) {
        errors.push({ booking_id: booking.id, error: err.message });
      }
    }

    return Response.json({
      success: true,
      date_checked: tomorrowStr,
      bookings_found: bookings.length,
      reminders_sent: sent,
      errors,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});