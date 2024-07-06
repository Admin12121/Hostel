export const metadata = {
  title: 'Home - Open PRO',
  description: 'Page description',
}

import Hero from '@/components/template/hero'
import Features from '@/components/template/features'
import Newsletter from '@/components/template/newsletter'
import Zigzag from '@/components/template/zigzag'
import Testimonials from '@/components/template/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </>
  )
}
