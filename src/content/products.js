const REF = 'lachance1'
const IMG = (item, v) => `https://myopulence.com/galleries/productImages/small_${item}-1.jpg?v=${v}`
const URL = (item, category) =>
  `https://myopulence.com/shop/display_item.php?referral=${REF}&category=${category}&item=${item}&page=1`

export const products = [
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

export const BRAND_ORDER = ['Arctic Vita', 'Divine', 'Fountain of Life']
