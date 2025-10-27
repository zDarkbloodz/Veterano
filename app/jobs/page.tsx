"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiFilter, FiBriefcase, FiClock } from "react-icons/fi";
import type { Job, SearchFilters } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    veteranFriendly: false,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append("q", filters.query);
      if (filters.location) params.append("location", filters.location);
      if (filters.veteranFriendly) params.append("veteran_friendly", "true");

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-text-secondary">
            Discover tech jobs from veteran-friendly companies
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Title/Keywords */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Job title or keywords"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="input-field pl-10"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="input-field pl-10"
              />
            </div>

            {/* Search Button */}
            <button type="submit" className="btn-primary">
              Search Jobs
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.veteranFriendly}
                onChange={(e) => setFilters({ ...filters, veteranFriendly: e.target.checked })}
                className="w-4 h-4 rounded border-slate-light focus:ring-tech-blue"
              />
              <span className="text-text-secondary">Veteran-friendly only</span>
            </label>
          </div>
        </form>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-tech-blue border-t-transparent" />
            <p className="mt-4 text-text-secondary">Loading jobs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:border-tech-blue cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-text-primary">
                        {job.title}
                      </h3>
                      {job.veteranFriendly && (
                        <span className="badge badge-success text-xs">
                          Veteran Friendly
                        </span>
                      )}
                      {job.veteranPreference && (
                        <span className="badge badge-info text-xs">
                          Veteran Preference
                        </span>
                      )}
                    </div>

                    <p className="text-text-secondary mb-3">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                      <div className="flex items-center space-x-1">
                        <FiMapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiBriefcase className="w-4 h-4" />
                        <span className="capitalize">{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                      </div>
                      {job.securityClearance && job.securityClearance !== 'none' && (
                        <span className="badge badge-warning text-xs">
                          {job.securityClearance.toUpperCase()} Clearance
                        </span>
                      )}
                    </div>

                    <p className="text-text-secondary line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-tech-blue/20 text-tech-blue text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  No jobs found. Try adjusting your search filters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
