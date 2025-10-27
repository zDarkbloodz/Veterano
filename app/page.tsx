"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiAward, FiBriefcase, FiUsers } from "react-icons/fi";

export default function Home() {
  const stats = [
    { label: "Jobs Posted", value: "500+", icon: FiBriefcase },
    { label: "Veterans Helped", value: "1,000+", icon: FiUsers },
    { label: "Companies", value: "50+", icon: FiAward },
  ];

  const features = [
    {
      title: "AI-Powered Resume Builder",
      description: "Get instant feedback and suggestions to improve your resume for tech roles.",
      icon: "🤖",
    },
    {
      title: "Military-to-Civilian Translation",
      description: "Automatically translate your military experience into civilian job terms.",
      icon: "🎖️",
    },
    {
      title: "Veteran-Friendly Companies",
      description: "Find companies that value your military experience and offer veteran programs.",
      icon: "🏢",
    },
    {
      title: "Bilingual Support",
      description: "Full platform available in English and Spanish for Latino veterans.",
      icon: "🌎",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-military-green/10 to-tech-blue/10" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gold-accent/5 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-military-green/20 border border-military-green/30 rounded-full px-4 py-2 mb-6">
              <FiAward className="w-5 h-5 text-gold-accent" />
              <span className="text-sm font-medium">For Veterans, By Veterans</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-text-primary">Your Next</span>
              <br />
              <span className="bg-gradient-to-r from-tech-blue to-military-green bg-clip-text text-transparent">
                Tech Career
              </span>
              <br />
              <span className="text-text-primary">Starts Here</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Helping military veterans transition to tech careers with AI-powered tools,
              job listings, and resources tailored for your unique experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs" className="btn-primary flex items-center space-x-2">
                <span>Browse Jobs</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/resume" className="btn-secondary">
                Upload Resume
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="card text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-tech-blue" />
                <div className="text-4xl font-bold text-text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-bg/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Built for Veterans
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We understand the unique challenges veterans face when transitioning to civilian careers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-military-green/20 to-tech-blue/20 border border-military-green/30 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Upload your resume and get personalized feedback in minutes.
            </p>
            <Link href="/resume" className="btn-primary inline-flex items-center space-x-2">
              <span>Get Started Free</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
