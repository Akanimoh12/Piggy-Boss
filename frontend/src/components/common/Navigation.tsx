import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import WalletConnection from '@components/wallet/WalletConnectionRK'

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected } = useAccount()
  const location = useLocation()

  // Don't show navigation on dashboard pages (they have their own sidebar)
  if (location.pathname.startsWith('/dashboard')) {
    return null
  }

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Docs', href: '#', external: true },
    { name: 'Support', href: '#' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Piggy Boss</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {link.name}
                {link.external && <FiExternalLink className="w-3 h-3 ml-1" />}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletConnection />
            {isConnected && (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <FiX className="w-6 h-6 text-gray-900" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex text-gray-700 hover:text-pink-600 transition-colors font-medium items-center"
                  {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {link.external && <FiExternalLink className="w-3 h-3 ml-1" />}
                </a>
              ))}
              
              <div className="pt-4 space-y-3">
                <WalletConnection />
                {isConnected && (
                  <Link
                    to="/dashboard"
                    className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation
