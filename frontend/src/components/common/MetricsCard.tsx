/**
 * MetricsCard Component - Glassmorphism Effect Cards
 * 
 * Displays key platform metrics with glassmorphism effect,
 * smooth animations, and interactive hover states.
 */

import React from 'react'
import { motion } from 'framer-motion'

interface MetricsCardProps {
  title: string
  value: string
  subtitle: string
  icon: string
  gradient: string
  delay?: number
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl" />
      
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative p-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          className="text-4xl mb-3 inline-block"
        >
          {icon}
        </motion.div>
        
        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="text-3xl font-bold text-white mb-1 group-hover:text-accent transition-colors duration-300"
        >
          {value}
        </motion.div>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="text-sm font-medium text-white/90 mb-1"
        >
          {title}
        </motion.div>
        
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="text-xs text-white/70"
        >
          {subtitle}
        </motion.div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/50 transition-colors duration-300" />
        
        {/* Sparkle effect on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-accent text-sm"
          >
            ✨
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default MetricsCard
