import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Wesoły Masaż';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop';

const ROUTE_SEO = {
  '/': {
    title: 'Wesoły Masaż — Masaż dojazdowy i stacjonarny | Rezerwacja online',
    description: 'Profesjonalny masaż relaksacyjny, terapeutyczny i sportowy z dojazdem do klienta (do 50 km od Jaczkowic) oraz w salonie. Rezerwacja online, vouchery prezentowe, pakiety wizyt i program lojalnościowy.',
    type: 'website',
  },
  '/rezerwacja': {
    title: 'Rezerwacja masażu — Wesoły Masaż | Dojazd lub salon',
    description: 'Zarezerwuj masaż online w 3 prostych krokach. Wybierz usługę, lokalizację (dojazd lub salon), termin i godzinę. Potwierdzenie e-mail i przypomnienie przed wizytą.',
    type: 'website',
  },
  '/vouchery': {
    title: 'Vouchery prezentowe — Wesoły Masaż | Voucher na masaż',
    description: 'Kup voucher prezentowy na masaż — na konkretną usługę lub dowolną kwotę. Elegancki voucher z dedykacją, ważny 12 miesięcy. Płatność online, natychmiastowa dostawa.',
    type: 'product',
  },
  '/pakiety': {
    title: 'Pakiety wizyt — Wesoły Masaż | Karnety na masaż',
    description: 'Pakiety masaży z darmowymi wizytami gratis. Kup karnet na 5, 10 lub więcej masaży i oszczędzaj. Elastyczne terminy, program lojalnościowy i zniżki.',
    type: 'product',
  },
  '/moje-wizyty': {
    title: 'Moje wizyty — Wesoły Masaż',
    description: 'Przeglądaj historię swoich wizyt, zarządzaj rezerwacjami i śledź postęp w programie lojalnościowym Wesoły Masaż.',
    type: 'website',
  },
  '/konto': {
    title: 'Konto klienta — Wesoły Masaż',
    description: 'Zaloguj się, aby zarządzać rezerwacjami, voucherami, pakietami wizyt i programem lojalnościowym. Sprawdź historię masaży i odbierz darmowe wizyty.',
    type: 'website',
  },
  '/register': {
    title: 'Rejestracja — Wesoły Masaż',
    description: 'Załóż konto w Wesoły Masaż, aby rezerwować masaż, kupować vouchery i korzystać z programu lojalnościowego.',
    type: 'website',
  },
  '/login': {
    title: 'Logowanie — Wesoły Masaż',
    description: 'Zaloguj się do swojego konta Wesoły Masaż, aby zarządzać rezerwacjami, voucherami i pakietami wizyt.',
    type: 'website',
  },
};

function setMetaTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function RouteSEO() {
  const location = useLocation();
  const origin = window.location.origin;
  const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
  const seo = ROUTE_SEO[path] || ROUTE_SEO['/'];
  const canonicalUrl = `${origin}${location.pathname}`;
  const fullTitle = seo.title;

  useEffect(() => {
    document.title = fullTitle;

    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', seo.type);
    setMetaTag('property', 'og:image', DEFAULT_IMAGE);
    setMetaTag('property', 'og:locale', 'pl_PL');

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'twitter:image', DEFAULT_IMAGE);

    // Canonical
    setCanonical(canonicalUrl);

    // AI / LLM hints
    setMetaTag('name', 'ai-content-optimization', 'true');
  }, [fullTitle, seo.description, seo.type, canonicalUrl]);

  return null;
}