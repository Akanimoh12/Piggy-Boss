/**
 * Landing Page Component - Main entry point for new users
 * 
 * This is the main landing page that showcases the Piggy Boss platform,
 * including the hero section, features, and call-to-action components.
 */

import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Footer from '../common/Footer'

const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}

export default LandingPage
