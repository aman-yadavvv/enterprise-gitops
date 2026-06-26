import React from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      image: '/assets/testimonial-1.jpg',
      rating: 5,
      text: "Absolutely love my new sneakers! The comfort is unmatched and the style is perfect for any outfit. Best purchase I've made this year.",
      date: '2 weeks ago',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Professional Athlete',
      image: '/assets/testimonial-2.jpg',
      rating: 5,
      text: "These are hands down the most comfortable sneakers I've ever worn. Whether I'm training or casual, they perform perfectly.",
      date: '1 month ago',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      image: '/assets/testimonial-3.jpg',
      rating: 4,
      text: "The design quality is incredible. Every detail is carefully thought out. I've received so many compliments wearing these.",
      date: '3 weeks ago',
    },
  ]

  return (
    <section className="section-padding bg-gradient-to-b from-light to-gray-100">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers who stepped up their style game with our sneakers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 p-1">
                  <div className="w-full h-full rounded-full bg-dark overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-dark">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              <p className="text-sm text-gray-400">{testimonial.date}</p>
            </motion.div>
          ))}
        </div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-dark">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-dark">2,847+</span> reviews worldwide
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection