# Wesoły Masaż — Konfiguracja bezpieczeństwa (DNS / Cloudflare)

Dwa problemy naprawione w kodzie aplikacji (CSP + SRI na Stripe).
Poniższe 7 wymaga konfiguracji w panelach zewnętrznych.

---

## 1. DMARC (TXT rekord DNS)

**Panel:** DNS domeny (Cloudflare / OVH / home.pl)

- **Typ:** TXT
- **Nazwa/Host:** `_dmarc`
- **Wartość:** `v=DMARC1; p=none; rua=mailto:irena@wesolymasaz.pl`

Po 2–4 tygodniach zmień `p=none` → `p=quarantine` (spam) → `p=reject` (blokada).

---

## 2. Rate limiting na endpoincie logowania

**Uwaga:** Endpoint `/api/auth/login` należy do platformy Base44 — nie jest modyfikowalny z poziomu kodu aplikacji. Base44 zarządza autoryzacją po swojej stronie.

**Opcja:** Skonfiguruj rate limiting w Cloudflare:
1. Dashboard Cloudflare → **Security → WAF → Rate limiting rules**
2. Utwórz regułę:
   - **If incoming requests match:** URI Path equals `/api/auth/login`
   - **Then take action:** Block
   - **Characteristics:** IP address
   - **Rate:** 5 requests per 15 minutes

---

## 3. HSTS z includeSubDomains

**Panel:** Cloudflare

1. Dashboard → **SSL/TLS → Edge Certificates**
2. **HTTP Strict Transport Security (HSTS):** Enable
3. **Include Subdomains:** On
4. **Max Age:** 12 months (31536000)
5. **Preload:** On (opcjonalnie, po testach)

---

## 4. DKIM (TXT rekord DNS)

**Panel:** DNS domeny + panel dostawcy e-mail (Resend)

### Jeśli używasz Resend (już skonfigurowany w aplikacji):
1. Zaloguj się do **Resend** → **Domains** → `wesolymasaz.pl`
2. Skopiuj rekord DKIM (selector `resend` — rekord TXT)
3. Dodaj w panelu DNS:
   - **Typ:** TXT
   - **Nazwa/Host:** `resend._domainkey`
   - **Wartość:** (skopiuj z Resend — długi klucz publiczny)

### Weryfikacja:
- https://mxtoolbox.com/dkim
- https://dmarcian.com/dkim-inspector

---

## 5. CAA (rekord DNS)

**Panel:** DNS domeny (Cloudflare)

Dodaj rekord CAA:

- **Typ:** CAA
- **Nazwa/Host:** `@` (lub puste — domena główna)
- **Flaga:** 0
- **Tag:** `issue`
- **Wartość:** `letsencrypt.org`

Jeśli używasz Cloudflare dla certyfikatów SSL, dodaj drugi rekord:
- **Typ:** CAA
- **Nazwa/Host:** `@`
- **Flaga:** 0
- **Tag:** `issue`
- **Wartość:** `sectigo.com` (Cloudflare używa Sectigo/Google Trust Services)

---

## 6. DNSSEC

**Panel:** Rejestrator domeny + Cloudflare

### Cloudflare (najprościej):
1. Dashboard Cloudflare → **DNS → DNSSEC**
2. Kliknij **Enable DNSSEC**
3. Skopiuj wygenerowany **DS record** (klucz + algorytm + digest)
4. Wklej DS record w panelu rejestratora domeny (NASK dla .pl)

### Weryfikacja:
- https://dnssec-analyzer.verisignlabs.com/wesolymasaz.pl

---

## 7. Cross-Origin-Opener-Policy (COOP)

**Uwaga:** COOP nie może być ustawione przez meta tag — wymaga nagłówka HTTP.

**Panel:** Cloudflare

### Opcja A — Cloudflare Workers (zalecane):
1. Dashboard → **Workers & Pages → Create application**
2. Utwórz Worker z kodem:
```js
export default {
  async fetch(request) {
    const response = await fetch(request);
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    return response;
  }
}
```
3. Przypisz do routingu `wesolymasaz.pl/*`

### Opcja B — Cloudflare Transform Rules:
1. Dashboard → **Rules → Transform Rules → Modify Response Header**
2. Utwórz regułę:
   - **When:** URI Path starts with `/`
   - **Set static header:** `Cross-Origin-Opener-Policy` = `same-origin`
   - **Set static header:** `Cross-Origin-Embedder-Policy` = `require-corp` (opcjonalnie)

---

## Podsumowanie — co już naprawione w kodzie

| # | Problem | Status |
|---|---------|--------|
| 4 | Brak CSP | ✅ Dodany `<meta http-equiv="Content-Security-Policy">` w index.html |
| 9 | Brak SRI na Stripe | ✅ Dodany `integrity` + `crossorigin` na `<script src="js.stripe.com">` |
| 1 | DMARC | ⏳ Wymaga rekordu TXT w DNS |
| 2 | Rate limiting login | ⏳ Wymaga reguły w Cloudflare WAF |
| 3 | HSTS includeSubDomains | ⏳ Wymaga włączenia w Cloudflare SSL/TLS |
| 5 | COOP | ⏳ Wymaga nagłówka w Cloudflare Workers/Transform Rules |
| 6 | DKIM | ⏳ Wymaga rekordu TXT z Resend w DNS |
| 7 | CAA | ⏳ Wymaga rekordu CAA w DNS |
| 8 | DNSSEC | ⏳ Wymaga włączenia w Cloudflare + rejestratorze |