import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import WalletConnection from '@components/wallet/WalletConnectionRK'


export const Hero: React.FC = () => {
  const { isConnected } = useAccount()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-blue-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-black text-white mb-6"
          >
            Save Like a{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Boss
            </span>
            <br />
            Earn Like a{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              King
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock up to <span className="font-bold text-yellow-400 text-3xl">15% APY</span> + 
            <span className="font-bold text-pink-400"> NFT rewards</span> on 
            <span className="font-bold text-blue-400"> Somnia Network</span>
          </motion.p>

          {/* Metrics Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
          >
            {[
              { title: "Max APY", value: "15%", subtitle: "Compound Interest", icon: "💰" },
              { title: "NFT Rewards", value: "4", subtitle: "Unique Collections", icon: "🎨" },
              { title: "Security", value: "100%", subtitle: "Decentralized", icon: "🔒" },
              { title: "Network", value: "⚡", subtitle: "Somnia Fast", icon: "🚀" }
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-white/70">{metric.subtitle}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            {/* Wallet Connection Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WalletConnection variant="default" />
            </motion.div>
            
            {/* Show Dashboard button when connected, Demo button when not */}
            {isConnected ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm hover:border-white/50 transition-all duration-300 inline-block"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">📊</span>
                    Go to Dashboard
                  </span>
                </Link>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm hover:border-white/50 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🎬</span>
                  Watch Demo
                </span>
              </motion.button>
            )}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-6 text-white/70"
          >
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full border-2 border-white/20"
                  />
                ))}
              </div>
              <span className="text-sm">1,000+ early adopters</span>
            </div>
            <div className="text-sm">
              <span className="text-yellow-400">★★★★★</span> 4.9/5 rating
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
          >
            {[
              {
                icon: "🛡️",
                title: "Secure & Audited",
                description: "Smart contracts audited by leading security firms"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Built on Somnia Network for instant transactions"
              },
              {
                icon: "🎁",
                title: "NFT Rewards",
                description: "Earn unique NFTs as you reach savings milestones"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
    </section>
  )
}

export default Hero
