import React from 'react'
import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import FeaturedSection from '../components/home/FeaturedSection'
import CategoriesSection from '../components/home/CategoriesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import NewsletterSection from '../components/home/NewsletterSection'

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </motion.div>
  )
}

export default HomePage