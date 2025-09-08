import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Kartik Singupalli',
    role: 'Founder & Lead Developer',
    bio: 'Award-winning full-stack/blockchain dev, MERN/Flutter/Clarity expert, hackathon winner, team leader.',
    avatar: '/next.svg',
  },
  // Add more team members here
];

export const TeamSection = () => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        Meet the Team
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {team.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-xl shadow-md p-6 flex flex-col items-center gap-3 border border-orange-100 w-64"
          >
            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-2 border-2 border-[#fc6431]" />
            <h3 className="text-xl font-semibold text-[#fc6431] mb-1">{t.name}</h3>
            <span className="text-gray-700 font-medium mb-1">{t.role}</span>
            <p className="text-gray-600 text-sm text-center">{t.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
