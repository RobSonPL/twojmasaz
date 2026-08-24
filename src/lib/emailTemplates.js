// HTML email templates for booking confirmations
// Inline-styled for email client compatibility

const GOLD = '#C9A96E';
const OBSIDIAN = '#0A0A0A';
const MUTED = '#6A6A6A';
const BORDER = '#E5E5E5';
const BG_SOFT = '#FAFAFA';

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDatePL(dateStr) {
  if (!dateStr) return '';
  const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  const days = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  const d = new Date(dateStr + 'T00:00:00');
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Build a Google Calendar "add event" link
function googleCalendarLink(booking) {
  // booking_date = "2026-08-26", booking_time = "10:00"
  const startStr = `${booking.booking_date}T${booking.booking_time}:00`;
  const start = new Date(startStr);
  const durationMin = booking.service_duration || 60;
  const end = new Date(start.getTime() + durationMin * 60000);

  // Format to UTC: YYYYMMDDTHHMMSSZ
  const toICS = (d) =>
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0') + 'T' +
    String(d.getUTCHours()).padStart(2, '0') +
    String(d.getUTCMinutes()).padStart(2, '0') +
    String(d.getUTCSeconds()).padStart(2, '0') + 'Z';

  const text = encodeURIComponent(`Masaż — ${booking.service_name} | Wesoły Masaż`);
  const dates = encodeURIComponent(`${toICS(start)}/${toICS(end)}`);
  const details = encodeURIComponent(
    `Rezerwacja: ${booking.service_name}\nKlient: ${booking.client_name}\nTelefon: ${booking.client_phone}` +
    (booking.notes ? `\nUwagi: ${booking.notes}` : '')
  );
  const location = encodeURIComponent(
    booking.booking_type === 'home' && booking.address
      ? booking.address
      : 'Wesoły Masaż — Salon stacjonarny'
  );

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

// Calendar button used in both emails
function calendarButton(gcalUrl) {
  return `
    <a href="${gcalUrl}" target="_blank" rel="noopener" style="display:inline-block;border:1px solid ${GOLD};color:${GOLD};text-decoration:none;padding:12px 28px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;border-radius:2px;margin-top:8px;">
      📅 Dodaj do kalendarza Google
    </a>`;
}

// Shared email shell — header + footer wrapper
function emailShell(content, title) {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid ${BORDER};">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid ${BORDER};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:600;color:${OBSIDIAN};letter-spacing:-0.02em;">Wesoły Masaż</div>
                    <div style="font-size:11px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;margin-top:4px;">Salon masażu</div>
                  </td>
                  <td align="right" valign="top">
                    <div style="width:40px;height:40px;border:1px solid ${GOLD};border-radius:50%;display:inline-block;text-align:center;line-height:38px;font-family:'Playfair Display',Georgia,serif;color:${GOLD};font-size:18px;">W</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid ${BORDER};background-color:${BG_SOFT};">
              <div style="font-family:'Playfair Display',Georgia,serif;font-size:16px;color:${OBSIDIAN};margin-bottom:8px;">Wesoły Masaż</div>
              <div style="font-size:12px;color:${MUTED};line-height:1.7;">
                📞 +48 787 907 141 &nbsp;·&nbsp; ✉️ irena@wesolymasaz.pl<br/>
                Dojazd do 50 km od Jaczkowic &nbsp;·&nbsp; Salon stacjonarny<br/><br/>
                <span style="color:#BBBBBB;">Ten e-mail został wysłany automatycznie. Prosimy na niego nie odpowiadać.</span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Booking detail row
function detailRow(label, value, isHighlight = false) {
  const valueStyle = isHighlight
    ? `font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;color:${GOLD};`
    : `font-size:15px;color:${OBSIDIAN};font-weight:500;`;
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${BORDER};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;padding-bottom:4px;">${escapeHTML(label)}</td>
          </tr>
          <tr>
            <td style="${valueStyle}">${escapeHTML(value)}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

// Client confirmation email — full booking details
export function clientConfirmationEmail(booking) {
  const typeLabel = booking.booking_type === 'home' ? 'Dojazd do klienta' : 'Salon stacjonarny';
  const typeIcon = booking.booking_type === 'home' ? '🏠' : '🏢';

  const content = `
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:${OBSIDIAN};margin:0 0 8px;letter-spacing:-0.02em;">Dziękujemy, ${escapeHTML(booking.client_name)}!</h1>
    <p style="font-size:15px;color:${MUTED};margin:0 0 32px;line-height:1.6;">Twoja rezerwacja została przyjęta i potwierdzona. Czekamy na Ciebie z niecierpliwością.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};margin-bottom:32px;">
      <tr>
        <td style="padding:20px 24px;background-color:${BG_SOFT};border-bottom:1px solid ${BORDER};">
          <div style="font-size:11px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:4px;">Potwierdzenie rezerwacji</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:${OBSIDIAN};">${escapeHTML(booking.service_name)}</div>
        </td>
      </tr>
      <tr><td style="padding:0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow('Data', formatDatePL(booking.booking_date))}
          ${detailRow('Godzina', booking.booking_time)}
          ${detailRow('Tryb wizyty', `${typeIcon} ${typeLabel}`)}
          ${booking.address ? detailRow('Adres dojazdu', booking.address) : ''}
          ${booking.notes ? detailRow('Twoje uwagi', booking.notes) : ''}
        </table>
      </td></tr>
      <tr>
        <td style="padding:20px 24px;border-top:2px solid ${GOLD};background-color:${BG_SOFT};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;">Do zapłaty</td>
              <td align="right" style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600;color:${OBSIDIAN};">${booking.service_price === 0 ? 'Do ustalenia' : `${booking.service_price} PLN`}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size:14px;color:${MUTED};line-height:1.7;margin:0 0 24px;">
      <strong style="color:${OBSIDIAN};">Co dalej?</strong><br/>
      Dzień przed wizytą otrzymasz przypomnienie. W przypadku zmiany terminu prosimy o kontakt telefoniczny lub przez WhatsApp.
    </p>

    <a href="https://wa.me/48787907141" style="display:inline-block;background-color:#25D366;color:#FFFFFF;text-decoration:none;padding:14px 32px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;border-radius:2px;">Napisz przez WhatsApp</a>

    <div style="margin-top:24px;padding-top:24px;border-top:1px solid ${BORDER};">
      <div style="font-size:12px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">Dodaj wizytę do kalendarza</div>
      ${calendarButton(googleCalendarLink(booking))}
    </div>
  `;

  return {
    subject: `Potwierdzenie rezerwacji — ${booking.service_name}`,
    body: emailShell(content, `Potwierdzenie rezerwacji — ${booking.service_name}`)
  };
}

// Owner notification email — new booking alert
export function ownerNotificationEmail(booking) {
  const typeLabel = booking.booking_type === 'home' ? 'Dojazd do klienta' : 'Salon stacjonarny';

  const content = `
    <div style="display:inline-block;background-color:#FEF3C7;color:#92400E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;padding:6px 14px;margin-bottom:24px;border-radius:2px;">Nowa rezerwacja</div>

    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;color:${OBSIDIAN};margin:0 0 8px;letter-spacing:-0.02em;">${escapeHTML(booking.service_name)}</h1>
    <p style="font-size:15px;color:${MUTED};margin:0 0 32px;line-height:1.6;">Klient <strong style="color:${OBSIDIAN};">${escapeHTML(booking.client_name)}</strong> właśnie zarezerwował wizytę.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};margin-bottom:24px;">
      <tr><td style="padding:0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow('Klient', booking.client_name)}
          ${detailRow('E-mail', booking.client_email)}
          ${detailRow('Telefon', booking.client_phone)}
          ${detailRow('Usługa', booking.service_name)}
          ${detailRow('Data', formatDatePL(booking.booking_date))}
          ${detailRow('Godzina', booking.booking_time)}
          ${detailRow('Tryb', typeLabel)}
          ${booking.address ? detailRow('Adres dojazdu', booking.address) : ''}
          ${booking.notes ? detailRow('Uwagi klienta', booking.notes) : ''}
        </table>
      </td></tr>
      <tr>
        <td style="padding:20px 24px;border-top:2px solid ${GOLD};background-color:${BG_SOFT};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;">Kwota</td>
              <td align="right" style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600;color:${OBSIDIAN};">${booking.service_price === 0 ? 'Do ustalenia' : `${booking.service_price} PLN`}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <a href="tel:${escapeHTML(booking.client_phone || '')}" style="display:inline-block;background-color:${OBSIDIAN};color:#FAFAFA;text-decoration:none;padding:14px 32px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;border-radius:2px;margin-right:12px;">Zadzwoń do klienta</a>
    <a href="mailto:${escapeHTML(booking.client_email || '')}" style="display:inline-block;border:1px solid ${GOLD};color:${GOLD};text-decoration:none;padding:14px 32px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;border-radius:2px;">Napisz e-mail</a>

    <div style="margin-top:24px;padding-top:24px;border-top:1px solid ${BORDER};">
      <div style="font-size:12px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">Dodaj do kalendarza</div>
      ${calendarButton(googleCalendarLink(booking))}
    </div>
  `;

  return {
    subject: `🔔 Nowa rezerwacja: ${booking.service_name} — ${booking.client_name} (${booking.booking_date} ${booking.booking_time})`,
    body: emailShell(content, `Nowa rezerwacja — ${booking.service_name}`)
  };
}