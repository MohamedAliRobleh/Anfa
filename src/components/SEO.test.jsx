import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { SEO, businessJsonLd } from './SEO'

test('renders title and description via helmet', async () => {
  render(
    <HelmetProvider>
      <SEO title="About" description="About Anfa" path="/about" />
    </HelmetProvider>
  )
  await waitFor(() => expect(document.title).toContain('About'))
  const metaDesc = document.querySelector('meta[name="description"]')
  expect(metaDesc.getAttribute('content')).toBe('About Anfa')
})

test('businessJsonLd includes correct name, phone and address', () => {
  const data = businessJsonLd()
  expect(data['@type']).toContain('MedicalBusiness')
  expect(data.name).toBe('Anfa Counselling & Psychotherapy')
  expect(data.telephone).toBe('+1-613-791-0284')
  expect(data.address.streetAddress).toBe('2487 Kaladar Avenue')
})
