import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTwitter, FiInstagram, FiYoutube, FiGithub, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Shop': ['All Sneakers', 'New Arrivals', 'Best Sellers', 'Sale'],
    'Support': ['Help Center', 'Returns', 'Shipping', 'Size Guide'],
    'Company': ['About Us', 'Careers', 'Blog', 'Contact'],
    'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
  }

  const socialLinks = [
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
    { icon: FiGithub, href: '#', label: 'GitHub' },
  ]

  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-display font-extrabold">
                SOLE<span className="text-primary-500">STYLE</span>
              </span>
              <span className="text-sm text-gray-500">
                © {currentYear} All rights reserved.
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/5 rounded-full hover:bg-primary-500/20 hover:text-primary-400 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <FiMail className="w-4 h-4" />
                <span>support@solestyle.com</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer