// Curated theme data for the "Couleurs & polices" admin page
// (src/admin/pages/ThemeEditor.jsx).
//
// Every palette and font pairing below is hand-picked to stay inside the
// site's existing premium spa/therapy aesthetic (calm teals, soft
// lavenders, warm neutrals), so whichever one the admin picks is
// guaranteed to look intentional and stay legible. Nothing here should be
// edited casually — each preset is a complete, considered set of all 10
// color roles (or both font roles), not a swatch to mix-and-match.
//
// Colors are stored as "R G B" integer-triplet strings — the exact format
// src/theme/ThemeProvider.jsx and the site_theme table expect (see that
// file's COLOR_VARS map for which CSS variable each role controls).

// Matches the :root defaults in src/index.css exactly. Shown as "current"
// before anything has ever been saved, and restored by "Reset".
export const DEFAULT_COLORS = {
  sea: '14 122 133',
  seaDeep: '8 95 104',
  sunlit: '95 94 130',
  lavender: '133 132 170',
  lavenderInk: '95 94 130',
  lavenderSoft: '233 232 240',
  lavenderWash: '242 241 246',
  mist: '225 239 236',
  sand: '247 244 237',
  ink: '28 41 38',
}

export const DEFAULT_FONTS = {
  displayCss: "'Fraunces', Georgia, serif",
  bodyCss: "'Hanken Grotesk', Arial, sans-serif",
  googleFontsHref:
    'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap',
}

// Describes each of the 10 named color roles in plain, visual language
// (never raw CSS variable names) for the "Advanced" individual pickers.
// `key` matches the keys used in DEFAULT_COLORS / site_theme.colors.
export const COLOR_ROLES = [
  {
    key: 'sea',
    label: 'Main color — buttons and links',
    helper: 'The color of buttons, links, and clickable elements.',
  },
  {
    key: 'seaDeep',
    label: 'Dark main color — headings',
    helper: 'A darker version of the main color, used for headings.',
  },
  {
    key: 'sunlit',
    label: 'Accent color — highlights',
    helper: 'A touch used to draw attention to a detail.',
  },
  {
    key: 'lavender',
    label: 'Secondary color',
    helper: 'A supporting color, used more subtly than the main one.',
  },
  {
    key: 'lavenderInk',
    label: 'Text on secondary background',
    helper: 'The color of text when it appears on a secondary background.',
  },
  {
    key: 'lavenderSoft',
    label: 'Light secondary background',
    helper: 'A light, soft background used for certain cards or boxes.',
  },
  {
    key: 'lavenderWash',
    label: 'Very light secondary background',
    helper: 'An even lighter background, almost white, for large areas.',
  },
  {
    key: 'mist',
    label: 'Soft background (sections)',
    helper: 'The background used for certain page sections, alternating with the general background.',
  },
  {
    key: 'sand',
    label: 'Overall site background',
    helper: 'The main background, behind all the site content.',
  },
  {
    key: 'ink',
    label: 'Text color',
    helper: 'The color of regular text, everywhere on the site.',
  },
]

// Six complete, named palettes. Each stays within the site's calm,
// premium spa/therapy family, but gives a genuinely different mood.
export const COLOR_PRESETS = [
  {
    id: 'teal-apaisant',
    name: 'Calming teal',
    description: "The site's original palette: a deep teal lifted by a touch of lavender.",
    colors: { ...DEFAULT_COLORS },
  },
  {
    id: 'lavande-sereine',
    name: 'Serene lavender',
    description: 'A soft purple with a touch of terracotta, for an introspective mood.',
    colors: {
      sea: '108 97 160',
      seaDeep: '74 64 122',
      sunlit: '181 140 106',
      lavender: '157 150 196',
      lavenderInk: '90 82 130',
      lavenderSoft: '235 232 245',
      lavenderWash: '244 242 250',
      mist: '232 236 245',
      sand: '248 245 240',
      ink: '35 32 48',
    },
  },
  {
    id: 'argile-chaleureuse',
    name: 'Warm clay',
    description: 'Terracotta and sage tones, warm and enveloping.',
    colors: {
      sea: '168 108 74',
      seaDeep: '128 78 52',
      sunlit: '94 122 110',
      lavender: '180 150 130',
      lavenderInk: '110 85 68',
      lavenderSoft: '238 227 217',
      lavenderWash: '247 240 233',
      mist: '236 231 219',
      sand: '250 245 236',
      ink: '46 36 30',
    },
  },
  {
    id: 'sauge-apaisante',
    name: 'Calming sage',
    description: 'A restful sage green, lifted by a warm ochre accent.',
    colors: {
      sea: '90 128 104',
      seaDeep: '61 94 76',
      sunlit: '176 136 95',
      lavender: '142 160 148',
      lavenderInk: '74 94 84',
      lavenderSoft: '230 236 231',
      lavenderWash: '241 245 242',
      mist: '224 236 229',
      sand: '246 244 237',
      ink: '30 38 33',
    },
  },
  {
    id: 'bleu-horizon',
    name: 'Horizon blue',
    description: 'A deep, restful blue, for a feeling of clarity and calm.',
    colors: {
      sea: '42 101 140',
      seaDeep: '27 72 102',
      sunlit: '173 129 97',
      lavender: '125 142 168',
      lavenderInk: '68 85 110',
      lavenderSoft: '228 234 241',
      lavenderWash: '240 243 248',
      mist: '221 235 240',
      sand: '246 245 240',
      ink: '26 34 42',
    },
  },
  {
    id: 'rose-poudre',
    name: 'Powder pink',
    description: 'A powder pink and soft mauve, for a delicate atmosphere.',
    colors: {
      sea: '158 98 110',
      seaDeep: '118 68 78',
      sunlit: '150 130 95',
      lavender: '173 140 150',
      lavenderInk: '104 78 86',
      lavenderSoft: '240 229 231',
      lavenderWash: '247 240 241',
      mist: '238 229 227',
      sand: '249 244 240',
      ink: '42 30 32',
    },
  },
]

// Five curated font pairings: a premium display/serif heading font paired
// with a clean, highly legible body font. Each googleFontsHref requests
// both families in one Google Fonts stylesheet, exactly what
// src/theme/ThemeProvider.jsx's applyFonts() expects.
export const FONT_PRESETS = [
  {
    id: 'fraunces-hanken',
    name: 'Fraunces & Hanken Grotesk',
    description: "The site's original pairing: warm and contemporary.",
    fonts: { ...DEFAULT_FONTS },
  },
  {
    id: 'playfair-inter',
    name: 'Playfair Display & Inter',
    description: 'Editorial elegance, crisp and timeless.',
    fonts: {
      displayCss: "'Playfair Display', Georgia, serif",
      bodyCss: "'Inter', Arial, sans-serif",
      googleFontsHref:
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
    },
  },
  {
    id: 'lora-nunito',
    name: 'Lora & Nunito Sans',
    description: 'Rounded softness, welcoming and very easy to read.',
    fonts: {
      displayCss: "'Lora', Georgia, serif",
      bodyCss: "'Nunito Sans', Arial, sans-serif",
      googleFontsHref:
        'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Nunito+Sans:wght@400;500;600;700&display=swap',
    },
  },
  {
    id: 'cormorant-jost',
    name: 'Cormorant & Jost',
    description: 'Refined minimalism, delicate and airy.',
    fonts: {
      displayCss: "'Cormorant', Georgia, serif",
      bodyCss: "'Jost', Arial, sans-serif",
      googleFontsHref:
        'https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Jost:wght@400;500;600;700&display=swap',
    },
  },
  {
    id: 'source-serif-work',
    name: 'Source Serif 4 & Work Sans',
    description: 'Contemporary sobriety, clear and professional.',
    fonts: {
      displayCss: "'Source Serif 4', Georgia, serif",
      bodyCss: "'Work Sans', Arial, sans-serif",
      googleFontsHref:
        'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Work+Sans:wght@400;500;600;700&display=swap',
    },
  },
]

// A single combined Google Fonts stylesheet covering every family used by
// every FONT_PRESETS entry above. This is only ever used to preload all the
// pairings at once so each font card in the picker can render its own
// sample in its real typeface for comparison ("choose by what you see").
// It is purely a preview convenience: the font pairing that actually gets
// applied to the live site still goes through applyFonts() and its own
// per-pairing googleFontsHref, exactly like the public-facing site does.
export const ALL_FONT_PREVIEW_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Nunito+Sans:wght@400;500;600;700&family=Cormorant:wght@400;500;600;700&family=Jost:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Work+Sans:wght@400;500;600;700&display=swap'

// --- Color format conversion -----------------------------------------
// <input type="color"> speaks #rrggbb; site_theme.colors speaks "R G B"
// integer triplets. Convert at the UI boundary only.

export function hexToRgbTriplet(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

export function rgbTripletToHex(triplet) {
  return (
    '#' +
    triplet
      .split(' ')
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
  )
}
