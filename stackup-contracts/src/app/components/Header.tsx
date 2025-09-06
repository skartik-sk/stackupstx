'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SU</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Stack Up</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/bounties" className="text-gray-600 hover:text-gray-900 transition-colors">
              Bounties
            </Link>
            <Link href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
              Projects
            </Link>
            <Link href="/grants" className="text-gray-600 hover:text-gray-900 transition-colors">
              Grants
            </Link>
            <Link href="/ideas" className="text-gray-600 hover:text-gray-900 transition-colors">
              Ideas
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Connect Wallet
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="/bounties" className="text-gray-600 hover:text-gray-900 transition-colors">
                Bounties
              </Link>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/grants" className="text-gray-600 hover:text-gray-900 transition-colors">
                Grants
              </Link>
              <Link href="/ideas" className="text-gray-600 hover:text-gray-900 transition-colors">
                Ideas
              </Link>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button className="w-full text-left text-gray-600 hover:text-gray-900 transition-colors">
                  Connect Wallet
                </button>
                <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
