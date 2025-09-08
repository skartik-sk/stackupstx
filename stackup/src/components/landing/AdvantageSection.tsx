import React from 'react';
import { motion } from 'framer-motion';

const advantages = [
  {
    title: 'Specificity',
    desc: 'Laser-focused on Stacks, tailored for Clarity and PoX.',
    icon: '🎯',
  },
  {
    title: 'Transparency & Security',
    desc: 'On-chain escrow and smart contracts for trust and transparency.',
    icon: '🔐',
  },
  {
    title: 'Curated Experience',
    desc: 'AI analyzer and application limits ensure high quality and no spam.',
    icon: '🌟',
  },
  {
    title: 'Community-First',
    desc: 'Reputation-based social layer and roadmap for long-term value.',
    icon: '🤝',
  },
];

export const AdvantageSection = () => (
  <section className="py-16 px-4 bg-gradient-to-br from-white to-orange-50">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        Competitive Advantage
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {advantages.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start gap-3 border border-orange-100"
          >
            <span className="text-3xl mb-2">{a.icon}</span>
            <h3 className="text-xl font-semibold text-[#fc6431] mb-1">{a.title}</h3>
            <p className="text-gray-700 text-base">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
