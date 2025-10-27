"use client";

import { motion } from "framer-motion";
import { FiBook } from "react-icons/fi";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiBook className="w-20 h-20 mx-auto mb-6 text-military-green" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Career Resources
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            This feature is coming soon! We're curating the best learning resources,
            guides, and tools to help you succeed in your tech career transition.
          </p>
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              What to Expect:
            </h3>
            <ul className="text-left text-text-secondary space-y-2">
              <li>✓ Free coding bootcamp recommendations</li>
              <li>✓ Interview preparation guides</li>
              <li>✓ Tech career transition roadmaps</li>
              <li>✓ Networking tips for veterans</li>
              <li>✓ GI Bill and education benefits information</li>
              <li>✓ Success stories from fellow veterans</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
