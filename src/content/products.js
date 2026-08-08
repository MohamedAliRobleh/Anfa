const REF = 'lachance1'
const IMG = (item, v) => `https://myopulence.com/galleries/productImages/small_${item}-1.jpg?v=${v}`
const URL = (item, category) =>
  `https://myopulence.com/shop/display_item.php?referral=${REF}&category=${category}&item=${item}&page=1`

export const products = [
  // Opulence
  { name: 'Best Sellers Trio', brand: 'Opulence', price: 'SC $225.77', image: IMG(8364, 1), url: URL(8364, 155) },
  { name: 'Trio of Health with Unflavoured Collagen', brand: 'Opulence', price: 'SC $364.00', image: IMG(8271, 1), url: URL(8271, 155) },
  { name: 'Trio of Health with Chocolate Collagen', brand: 'Opulence', price: 'SC $364.00', image: IMG(8270, 1), url: URL(8270, 155) },
  { name: 'Trio of Health with Vanilla Collagen', brand: 'Opulence', price: 'SC $364.00', image: IMG(8269, 1), url: URL(8269, 155) },
  { name: 'Trio of Health with Multi-Berry Collagen', brand: 'Opulence', price: 'SC $364.00', image: IMG(8268, 1), url: URL(8268, 155) },
  { name: 'The Safe Home Revolution Bundle with Unflavoured Collagen', brand: 'Opulence', price: 'SC $1,090.00', image: IMG(8265, 3), url: URL(8265, 155) },
  { name: 'The Safe Home Revolution Bundle with Chocolate Collagen', brand: 'Opulence', price: 'SC $1,090.00', image: IMG(8264, 2), url: URL(8264, 155) },
  { name: 'The Safe Home Revolution Bundle with Multi-Berry Collagen', brand: 'Opulence', price: 'SC $1,090.00', image: IMG(8263, 2), url: URL(8263, 155) },
  { name: 'The Safe Home Revolution Bundle with Vanilla Collagen', brand: 'Opulence', price: 'SC $1,090.00', image: IMG(8262, 2), url: URL(8262, 155) },
  { name: 'Power Duo Pack', brand: 'Opulence', price: 'SC $594.99', image: IMG(8144, 5), url: URL(8144, 155) },
  { name: 'Microsilver & Health Bundle', brand: 'Opulence', price: 'SC $506.09', image: IMG(7740, 3), url: URL(7740, 155) },
  { name: 'Beauty & Health Bundle', brand: 'Opulence', price: 'SC $501.79', image: IMG(7739, 3), url: URL(7739, 155) },
  { name: 'Wellness Bundle', brand: 'Opulence', price: 'SC $489.90', image: IMG(7738, 3), url: URL(7738, 155) },
  { name: 'The Safe Home Revolution Bundle for PH / TH', brand: 'Opulence', price: 'SC $850.00', image: IMG(7649, 2), url: URL(7649, 155) },
  { name: 'The Safe Home Revolution Bundle', brand: 'Opulence', price: 'SC $925.00', image: IMG(7648, 101), url: URL(7648, 155) },

  // Arctic Vita
  { name: 'Arctic Vita Collagen - Quad Set (4 Pouches)', brand: 'Arctic Vita', price: 'SC $650.00', image: IMG(8260, 6), url: URL(8260, 150) },
  { name: 'Arctic Vita Collagen Unflavoured - Single Pouch', brand: 'Arctic Vita', price: 'SC $165.00', image: IMG(8148, 4), url: URL(8148, 150) },
  { name: 'Arctic Vita Collagen Chocolate - Single Pouch', brand: 'Arctic Vita', price: 'SC $165.00', image: IMG(8147, 4), url: URL(8147, 150) },
  { name: 'Arctic Vita Collagen Vanilla - Single Pouch', brand: 'Arctic Vita', price: 'SC $165.00', image: IMG(8146, 3), url: URL(8146, 150) },
  { name: 'Arctic Vita Collagen Multi-Berry - Single Pouch', brand: 'Arctic Vita', price: 'SC $165.00', image: IMG(8145, 4), url: URL(8145, 150) },

  // Divine
  { name: 'Divine Supplement - Family Pack (9+1 Bottles)', brand: 'Divine', price: 'SC $1,028.57', image: IMG(7655, 4), url: URL(7655, 149) },
  { name: 'Divine Supplement - 6 Bottles', brand: 'Divine', price: 'SC $685.71', image: IMG(7610, 14), url: URL(7610, 149) },
  { name: 'Divine Supplement - 3 Bottles', brand: 'Divine', price: 'SC $342.86', image: IMG(7349, 13), url: URL(7349, 149) },
  { name: 'Divine Supplement - Single Bottle', brand: 'Divine', price: 'SC $114.29', image: IMG(7348, 4), url: URL(7348, 149) },

  // Fountain of Life
  { name: 'FOL - Family Pack (14+2 Bottles)', brand: 'Fountain of Life', price: 'SC $1,189.59', image: IMG(7608, 115), url: URL(7608, 97) },
  { name: 'FOL - 6 Bottles', brand: 'Fountain of Life', price: 'SC $509.79', image: IMG(6718, 7), url: URL(6718, 97) },
  { name: 'FOL - 2 Bottles', brand: 'Fountain of Life', price: 'SC $169.93', image: IMG(6717, 6), url: URL(6717, 97) },
  { name: 'FOL - Single Bottle', brand: 'Fountain of Life', price: 'SC $84.97', image: IMG(6787, 12), url: URL(6787, 97) },
]

export const BRAND_ORDER = ['Opulence', 'Arctic Vita', 'Divine', 'Fountain of Life']
