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
    label: 'Site logo',
    defaultUrl: '/img/lotus-icon.png',
    where: 'Header and footer of every page',
  },
  {
    key: 'home.hero.slide1',
    label: 'Home — Background photo 1 (main banner)',
    defaultUrl: '/img/hero-mountain-sea.webp',
    where: 'Home page, at the very top',
  },
  {
    key: 'home.hero.slide2',
    label: 'Home — Background photo 2 (main banner)',
    defaultUrl: '/img/hero-mountain-stream.webp',
    where: 'Home page, at the very top',
  },
  {
    key: 'home.hero.slide3',
    label: 'Home — Background photo 3 (main banner)',
    defaultUrl: '/img/hero-forest-path.webp',
    where: 'Home page, at the very top',
  },
  {
    key: 'home.intro.portrait',
    label: 'Photo of Sahra',
    defaultUrl: '/img/sahra-portrait.webp',
    where: 'Home page, "Meet Sahra" section',
  },
  {
    key: 'services.individual.image',
    label: 'Service — Individual psychotherapy',
    defaultUrl: '/img/service-individual.webp',
    where: 'Services page and preview on the home page',
  },
  {
    key: 'services.couple.image',
    label: 'Service — Couples therapy',
    defaultUrl: '/img/service-couple.webp',
    where: 'Services page and preview on the home page',
  },
  {
    key: 'services.group.image',
    label: 'Service — Group therapy',
    defaultUrl: '/img/service-group.webp',
    where: 'Services page and preview on the home page',
  },
  {
    key: 'services.spiritual.image',
    label: 'Service — Spiritual therapy',
    defaultUrl: '/img/service-spiritual.webp',
    where: 'Services page and preview on the home page',
  },
  {
    key: 'approach.methods.cbt.image',
    label: 'Approach — Cognitive behavioral therapy (CBT)',
    defaultUrl: 'https://images.unsplash.com/photo-1644412448740-40e5b6ded2dc?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.narrative.image',
    label: 'Approach — Narrative therapy',
    defaultUrl: 'https://images.unsplash.com/photo-1506513083865-434a8a207e11?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.act.image',
    label: 'Approach — ACT',
    defaultUrl: 'https://images.unsplash.com/photo-1527286914894-00a0b9572425?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.mindfulness.image',
    label: 'Approach — Mindfulness',
    defaultUrl: 'https://images.unsplash.com/photo-1513097847644-f00cfe868607?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.artTherapy.image',
    label: 'Approach — Art therapy',
    defaultUrl: 'https://images.unsplash.com/photo-1752649935255-c10e9a3e2ad3?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.playTherapy.image',
    label: 'Approach — Play therapy',
    defaultUrl: 'https://images.unsplash.com/photo-1575364289437-fb1479d52732?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.motivational.image',
    label: 'Approach — Motivational interviewing',
    defaultUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'approach.methods.culturallySensitive.image',
    label: 'Approach — Cultural sensitivity',
    defaultUrl: 'https://images.unsplash.com/photo-1636986905406-758b0e280f49?q=80&w=600&auto=format&fit=crop',
    where: 'Approach page',
  },
  {
    key: 'blog.managing-anxiety.coverImage',
    label: 'Blog — Cover photo: grounding techniques for anxiety',
    defaultUrl: '/img/blog-anxiety.webp',
    where: 'Blog page',
  },
  {
    key: 'blog.couple-therapy.coverImage',
    label: 'Blog — Cover photo: couples therapy',
    defaultUrl: '/img/blog-couple.webp',
    where: 'Blog page',
  },
  {
    key: 'blog.navigating-grief.coverImage',
    label: 'Blog — Cover photo: navigating grief',
    defaultUrl: '/img/blog-grief.webp',
    where: 'Blog page',
  },
]
