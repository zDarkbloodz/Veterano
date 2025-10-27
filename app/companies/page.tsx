"use client";

import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";

export default function CompaniesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiUsers className="w-20 h-20 mx-auto mb-6 text-tech-blue" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Veteran-Friendly Companies
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            This feature is coming soon! We're building a comprehensive directory of
            companies that actively support and hire military veterans.
          </p>
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              What to Expect:
            </h3>
            <ul className="text-left text-text-secondary space-y-2">
              <li>✓ Company profiles with veteran programs</li>
              <li>✓ Veteran hiring statistics</li>
              <li>✓ Employee reviews from veterans</li>
              <li>✓ Benefits and perks information</li>
              <li>✓ Direct links to careers pages</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
