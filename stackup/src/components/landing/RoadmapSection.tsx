import React from 'react';
import { motion } from 'framer-motion';

const roadmap = [
  {
    phase: 'Phase 1',
    title: 'The Foundation - Q4 2025',
    desc: 'Launch core platform, deploy escrow contracts, user profiles, wallet connection, and AI-powered ideas page.',
  },
  {
    phase: 'Phase 2',
    title: 'The Social Layer - Q1 2026',
    desc: 'Public Stacker Scores, user reviews, forums, and decentralized grant-voting.',
  },
  {
    phase: 'Phase 3',
    title: 'The AI Supercharge - Q2 2026',
    desc: 'AI-powered recommendations and project description assistance.',
  },
  {
    phase: 'Phase 4',
    title: 'The Network Effect - H2 2026',
    desc: 'Public Impact Report, API release, and ecosystem integrations.',
  },
];

export const RoadmapSection = () => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        Roadmap: From Vision to Impact
      </h2>
      <div className="flex flex-col gap-8">
        {roadmap.map((r, i) => (
          <motion.div
            key={r.phase}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-xl shadow-md p-6 border border-orange-100"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xl font-bold text-[#fc6431]">{r.phase}</span>
              <span className="text-gray-700 font-semibold">{r.title}</span>
            </div>
            <p className="text-gray-700 text-base ml-2">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
