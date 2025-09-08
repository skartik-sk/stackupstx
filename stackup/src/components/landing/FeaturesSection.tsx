import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'For Creators',
    desc: 'Post bounties and projects with secure milestone payments.',
    icon: '🎯',
  },
  {
    title: 'For Builders',
    desc: 'Discover opportunities and build your reputation score.',
    icon: '�️',
  },
  {
    title: 'AI-Powered',
    desc: 'Smart idea analysis and personalized recommendations.',
    icon: '🤖',
  },
];

export const FeaturesSection = () => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Built for Everyone
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you are creating projects or building solutions, StackUp has you covered
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center p-6 rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors duration-300"
          >
            <span className="text-4xl mb-4 block">{f.icon}</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
