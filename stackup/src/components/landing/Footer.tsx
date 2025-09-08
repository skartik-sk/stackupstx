import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Footer = () => (
  <footer className="bg-gray-900 text-white py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2"
        >
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#fc6431] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">StackUp</span>
          </div>
          <p className="text-gray-400 mb-4 max-w-md">
            The future of decentralized work on Stacks. Connect, build, and earn with transparency and trust.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#fc6431] transition-colors">
              <span className="sr-only">Twitter</span>
              🐦
            </a>
            <a href="#" className="text-gray-400 hover:text-[#fc6431] transition-colors">
              <span className="sr-only">Discord</span>
              💬
            </a>
            <a href="#" className="text-gray-400 hover:text-[#fc6431] transition-colors">
              <span className="sr-only">GitHub</span>
              💻
            </a>
          </div>
        </motion.div>

        {/* Platform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold text-lg mb-4">Platform</h3>
          <ul className="space-y-2">
            <li><Link href="/bounties" className="text-gray-400 hover:text-white transition-colors">Bounties</Link></li>
            <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
            <li><Link href="/grants" className="text-gray-400 hover:text-white transition-colors">Grants</Link></li>
            <li><Link href="/ideas" className="text-gray-400 hover:text-white transition-colors">Ideas</Link></li>
          </ul>
        </motion.div>

        {/* Get Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold text-lg mb-4">Get Started</h3>
          <ul className="space-y-2">
            <li><Link href="/create/bounty" className="text-gray-400 hover:text-white transition-colors">Post Bounty</Link></li>
            <li><Link href="/create/project" className="text-gray-400 hover:text-white transition-colors">Create Project</Link></li>
            <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
            <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <p className="text-gray-400 text-sm">
          © 2025 StackUp. Built on Stacks blockchain.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
          <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
          <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</Link>
        </div>
      </motion.div>
    </div>
  </footer>
);
