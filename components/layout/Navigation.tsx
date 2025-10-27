"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiBriefcase, FiFileText, FiUsers, FiBook } from "react-icons/fi";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  const navItems = [
    { name: { en: "Jobs", es: "Empleos" }, href: "/jobs", icon: FiBriefcase },
    { name: { en: "Resume", es: "Currículum" }, href: "/resume", icon: FiFileText },
    { name: { en: "Companies", es: "Empresas" }, href: "/companies", icon: FiUsers },
    { name: { en: "Resources", es: "Recursos" }, href: "/resources", icon: FiBook },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-lg border-b border-slate-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-military-green to-tech-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              VETERANO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name[locale]}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="px-3 py-1 text-sm border border-slate-light rounded hover:border-military-green transition-colors"
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </button>

            {/* CTA Button */}
            <Link href="/resume" className="btn-primary">
              {locale === 'en' ? 'Upload Resume' : 'Subir Currículum'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text-primary"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-slate-bg border-t border-slate-light"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-dark transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name[locale]}</span>
              </Link>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-text-secondary">Language:</span>
              <button
                onClick={toggleLocale}
                className="px-3 py-1 text-sm border border-slate-light rounded"
              >
                {locale === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
            <Link
              href="/resume"
              className="block btn-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              {locale === 'en' ? 'Upload Resume' : 'Subir Currículum'}
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
