// Every image on the site an admin is allowed to replace, as a named
// "slot". Consumed by src/admin/pages/MediaManager.jsx to render one
// upload/replace card per slot, and by each slot's component via
// useMedia(key, defaultUrl) (see src/media/MediaOverridesProvider.jsx) to
// read the current override (or fall back to defaultUrl).
//
// Deliberately excludes: third-party product images in
// src/content/products.js (sourced from the Opulence Global affiliate shop,
// not site branding) and inline SVG icons in src/components/icons.jsx (UI
// glyphs, not "pictures").
export const MEDIA_SLOTS = [
  {
    key: 'site.logo',
    label: 'Logo du site',
    defaultUrl: '/img/lotus-icon.png',
    where: 'En-tête de chaque page et pied de page',
  },
  {
    key: 'home.hero.slide1',
    label: 'Accueil — Photo de fond 1 (bandeau principal)',
    defaultUrl: '/img/hero-mountain-sea.webp',
    where: 'Page d’accueil, tout en haut',
  },
  {
    key: 'home.hero.slide2',
    label: 'Accueil — Photo de fond 2 (bandeau principal)',
    defaultUrl: '/img/hero-mountain-stream.webp',
    where: 'Page d’accueil, tout en haut',
  },
  {
    key: 'home.hero.slide3',
    label: 'Accueil — Photo de fond 3 (bandeau principal)',
    defaultUrl: '/img/hero-forest-path.webp',
    where: 'Page d’accueil, tout en haut',
  },
  {
    key: 'home.intro.portrait',
    label: 'Photo de Sahra',
    defaultUrl: '/img/sahra-portrait.webp',
    where: 'Page d’accueil, section « Rencontrez Sahra »',
  },
  {
    key: 'services.individual.image',
    label: 'Service — Psychothérapie individuelle',
    defaultUrl: '/img/service-individual.webp',
    where: 'Page Services et aperçu sur la page d’accueil',
  },
  {
    key: 'services.couple.image',
    label: 'Service — Thérapie de couple',
    defaultUrl: '/img/service-couple.webp',
    where: 'Page Services et aperçu sur la page d’accueil',
  },
  {
    key: 'services.group.image',
    label: 'Service — Thérapie de groupe',
    defaultUrl: '/img/service-group.webp',
    where: 'Page Services et aperçu sur la page d’accueil',
  },
  {
    key: 'services.spiritual.image',
    label: 'Service — Thérapie spirituelle',
    defaultUrl: '/img/service-spiritual.webp',
    where: 'Page Services et aperçu sur la page d’accueil',
  },
  {
    key: 'approach.methods.cbt.image',
    label: 'Approche — Thérapie cognitivo-comportementale (TCC)',
    defaultUrl: 'https://images.unsplash.com/photo-1644412448740-40e5b6ded2dc?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.narrative.image',
    label: 'Approche — Thérapie narrative',
    defaultUrl: 'https://images.unsplash.com/photo-1506513083865-434a8a207e11?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.act.image',
    label: 'Approche — ACT',
    defaultUrl: 'https://images.unsplash.com/photo-1527286914894-00a0b9572425?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.mindfulness.image',
    label: 'Approche — Pleine conscience',
    defaultUrl: 'https://images.unsplash.com/photo-1513097847644-f00cfe868607?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.artTherapy.image',
    label: 'Approche — Art-thérapie',
    defaultUrl: 'https://images.unsplash.com/photo-1752649935255-c10e9a3e2ad3?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.playTherapy.image',
    label: 'Approche — Jeu thérapeutique',
    defaultUrl: 'https://images.unsplash.com/photo-1575364289437-fb1479d52732?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.motivational.image',
    label: 'Approche — Entretien motivationnel',
    defaultUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'approach.methods.culturallySensitive.image',
    label: 'Approche — Sensibilité culturelle',
    defaultUrl: 'https://images.unsplash.com/photo-1636986905406-758b0e280f49?q=80&w=600&auto=format&fit=crop',
    where: 'Page Approche',
  },
  {
    key: 'blog.managing-anxiety.coverImage',
    label: 'Blogue — Photo de couverture : techniques d’ancrage pour l’anxiété',
    defaultUrl: '/img/blog-anxiety.webp',
    where: 'Page Blogue',
  },
  {
    key: 'blog.couple-therapy.coverImage',
    label: 'Blogue — Photo de couverture : thérapie de couple',
    defaultUrl: '/img/blog-couple.webp',
    where: 'Page Blogue',
  },
  {
    key: 'blog.navigating-grief.coverImage',
    label: 'Blogue — Photo de couverture : traverser le deuil',
    defaultUrl: '/img/blog-grief.webp',
    where: 'Page Blogue',
  },
]
