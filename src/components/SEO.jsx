import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.anfacounselling.ca' // update once the domain is finalized

export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    name: 'Anfa Counselling & Psychotherapy',
    telephone: '+1-613-791-0284',
    email: 'sahrasaid845@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2487 Kaladar Avenue',
      addressLocality: 'Ottawa',
      addressRegion: 'ON',
      postalCode: 'K1V',
      addressCountry: 'CA',
    },
    openingHours: 'Sa,Su-Fr 11:00-17:30',
    priceRange: '$$',
  }
}

export function SEO({ title, description, path = '/', jsonLd }) {
  const fullTitle = `${title} | Anfa Counselling & Psychotherapy`
  const url = `${SITE_URL}${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${SITE_URL}/img/lotus-icon.png`} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
