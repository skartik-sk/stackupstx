import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const ExecutiveSummary = () => (
  <section className="py-20 px-4 md:px-0 bg-gradient-to-br from-orange-50 via-white to-orange-50">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
        The Future of 
        <span className="text-[#fc6431]"> Decentralized Work</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
        A unified marketplace for bounties, grants, and projects on Stacks. 
        Connect builders with opportunities through secure, transparent, on-chain collaboration.
      </p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Link href="/bounties">
          <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Explore Bounties
          </Button>
        </Link>
        <Link href="/create/bounty">
          <Button variant="outline" className="border-[#fc6431] text-[#fc6431] hover:bg-[#fc6431] hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300">
            Post Project
          </Button>
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-500"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Secure Escrow
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          AI-Powered
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#fc6431] rounded-full"></span>
          Stacks Native
        </span>
      </motion.div>
    </motion.div>
  </section>
);
