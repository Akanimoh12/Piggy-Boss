import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Footer from '../common/Footer'

const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}

export default LandingPage
