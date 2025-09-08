import React from 'react';
import { motion } from 'framer-motion';

const techs = [
  { name: 'React/Next.js', icon: '⚛️', color: 'text-blue-500' },
  { name: 'MongoDB', icon: '🍃', color: 'text-green-600' },
  { name: 'Node.js/Express', icon: '🟩', color: 'text-green-700' },
  { name: 'Clarity', icon: '🔐', color: 'text-orange-500' },
  { name: 'Stacks.js', icon: '📦', color: 'text-orange-400' },
  { name: 'Hiro API', icon: '🚀', color: 'text-purple-500' },
  { name: 'AI Engine', icon: '🤖', color: 'text-gray-700' },
];

export const TechStackSection = () => (
  <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-white">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        Technology Stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {techs.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-2 border border-orange-100 ${t.color}`}
          >
            <span className="text-4xl mb-2">{t.icon}</span>
            <span className="font-semibold text-lg">{t.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
