import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiHeart, FiAward, FiShield } from 'react-icons/fi'

const AboutPage = () => {
  const stats = [
    { label: 'Founded', value: '2023' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Premium Styles', value: '500+' },
    { label: 'Store Locations', value: '12' }
  ]

  const values = [
    {
      icon: FiHeart,
      title: 'Customer Obsession',
      description: 'We place our customers at the center of everything we do, delivering comfort and style tailored for you.'
    },
    {
      icon: FiAward,
      title: 'Premium Quality',
      description: 'Every sneaker is curated from elite materials to guarantee outstanding craftsmanship and durability.'
    },
    {
      icon: FiShield,
      title: '100% Authenticity',
      description: 'We guarantee 100% authentic products. Shop with confidence knowing your shoes are completely genuine.'
    }
  ]

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-3 mb-6">
            Redefining <span className="gradient-text">Sneaker Culture</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            At SoleStyle, we believe sneakers are more than just footwear—they are an extension of your identity, a canvas for self-expression, and a step toward the future.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-white p-8 rounded-3xl shadow-md text-center border border-gray-100"
            >
              <p className="text-4xl font-display font-extrabold text-primary-500 mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Brand Mission & Values */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Driven by our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Our culture shapes how we design, source, and deliver elite sneakers to your door.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">
                  {val.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark text-white p-12 md:p-16 rounded-[40px] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Ready to Upgrade your Style?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Browse through our fresh new arrivals and find the perfect match for your daily look.
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage
