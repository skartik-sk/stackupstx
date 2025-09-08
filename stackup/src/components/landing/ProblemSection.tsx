import React from 'react';
import { motion } from 'framer-motion';

const problems = [
  {
    title: 'Scattered Opportunities',
    desc: 'Builders search across Discord, Twitter, and Notion instead of building.',
    icon: '🔍',
  },
  {
    title: 'Trust Issues',
    desc: 'No transparent, on-chain execution for payments and agreements.',
    icon: '🤝',
  },
  {
    title: 'No Reputation System',
    desc: 'Builders cannot showcase their verified skills and track record.',
    icon: '📊',
  },
];

export const ProblemSection = () => (
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
          The Current Challenge
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The Stacks ecosystem lacks a unified platform for collaboration
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center p-6"
          >
            <span className="text-4xl mb-4 block">{p.icon}</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h3>
            <p className="text-gray-600">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
