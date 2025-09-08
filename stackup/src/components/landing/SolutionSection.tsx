import React from 'react';
import { motion } from 'framer-motion';

const solutions = [
  {
    title: 'Unified Marketplace',
    desc: 'All bounties, grants, and projects in one secure platform.',
    icon: '🌐',
  },
  {
    title: 'Smart Contracts',
    desc: 'Escrow payments with milestone-based releases on Stacks.',
    icon: '�',
  },
  {
    title: 'Reputation System',
    desc: 'Build your verified on-chain Stacker Score.',
    icon: '⭐',
  },
];

export const SolutionSection = () => (
  <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-white">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Solution
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive platform built specifically for the Stacks ecosystem
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {solutions.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 text-center border border-orange-100 hover:shadow-xl transition-shadow duration-300"
          >
            <span className="text-4xl mb-4 block">{s.icon}</span>
            <h3 className="text-xl font-semibold text-[#fc6431] mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
