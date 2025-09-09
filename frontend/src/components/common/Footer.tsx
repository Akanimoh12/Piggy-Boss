import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiTwitter, 
  FiGithub, 
  FiMail, 
  FiExternalLink,
  FiShield,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  type FooterLink = {
    name: string
    href: string
    external?: boolean
  }

  const footerLinks: Record<string, FooterLink[]> = {
    Product: [
      { name: 'Savings Plans', href: '/dashboard/savings' },
      { name: 'Yield Farming', href: '/dashboard/yield' },
      { name: 'NFT Rewards', href: '/dashboard/nft' },
      { name: 'AI Insights', href: '/dashboard/ai' },
    ],
    Resources: [
      { name: 'Documentation', href: '#', external: true },
      { name: 'API Reference', href: '#', external: true },
      { name: 'Help Center', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', icon: FiTwitter, href: '#' },
    { name: 'GitHub', icon: FiGithub, href: '#' },
    { name: 'Email', icon: FiMail, href: 'mailto:hello@piggyboss.finance' },
  ]

  const roadmapItems = [
    {
      quarter: 'Q4 2024',
      title: 'Platform Launch',
      description: 'Core savings features and Somnia Network integration',
      status: 'completed',
      icon: FiShield,
    },
    {
      quarter: 'Q1 2025',
      title: 'Advanced Yield',
      description: 'Enhanced yield optimization and auto-compounding',
      status: 'completed',
      icon: FiTrendingUp,
    },
    {
      quarter: 'Q2 2025',
      title: 'AI Integration',
      description: 'AI-powered insights and personalized recommendations',
      status: 'in-progress',
      icon: FiZap,
    },
    {
      quarter: 'Q3 2025',
      title: 'Cross-Chain',
      description: 'Multi-chain support and bridge integrations',
      status: 'planned',
      icon: FiExternalLink,
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Roadmap Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Roadmap</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Building the future of DeFi savings, one milestone at a time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={`
                    p-6 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105
                    ${item.status === 'completed' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : item.status === 'in-progress'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-gray-800/50 border-gray-700'
                    }
                  `}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${item.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : item.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-700 text-gray-400'
                        }
                      `}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${item.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : item.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-700 text-gray-400'
                        }
                      `}>
                        {item.status === 'completed' ? 'Completed' : 
                         item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">{item.quarter}</p>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Piggy Boss Logo" 
                className="w-10 h-10 drop-shadow-sm"
              />
              <span className="text-2xl font-bold">Piggy Boss</span>
            </div>
            <p className="text-gray-400 text-lg max-w-md">
              The future of DeFi savings. Earn high yields, collect NFTs, and secure your financial future on Somnia Network.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                      >
                        {link.name}
                        <FiExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© {currentYear} Piggy Boss. All rights reserved.</span>
              <span className="hidden md:block">Built on Somnia Network</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
