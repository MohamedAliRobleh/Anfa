import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { I18nProvider } from './i18n/I18nProvider'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CookieConsent } from './components/CookieConsent'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Approach = lazy(() => import('./pages/Approach'))
const FeesInsurance = lazy(() => import('./pages/FeesInsurance'))
const Booking = lazy(() => import('./pages/Booking'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Resources = lazy(() => import('./pages/Resources'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/fees" element={<FeesInsurance />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default function App({ initialEntries }) {
  const [analyticsOn, setAnalyticsOn] = useState(false)
  const Router = initialEntries ? MemoryRouter : BrowserRouter
  const routerProps = initialEntries ? { initialEntries } : {}

  return (
    <HelmetProvider>
      <I18nProvider>
        <Router {...routerProps}>
          <ScrollToTop />
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </Router>
        <CookieConsent onAccept={() => setAnalyticsOn(true)} />
        {analyticsOn && <Analytics />}
      </I18nProvider>
    </HelmetProvider>
  )
}
