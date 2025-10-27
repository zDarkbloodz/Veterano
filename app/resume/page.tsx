"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiFileText } from "react-icons/fi";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      // Read file content
      const text = await file.text();

      // Call API
      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      const data = await response.json();
      setAnalysis(data.data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          AI Resume Analyzer
        </h1>
        <p className="text-text-secondary mb-8">
          Upload your resume and get instant feedback powered by AI
        </p>

        {/* Upload Section */}
        {!analysis && (
          <div className="card">
            <div className="border-2 border-dashed border-slate-light rounded-lg p-12 text-center">
              <FiUpload className="w-16 h-16 mx-auto mb-4 text-tech-blue" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Upload Your Resume
              </h3>
              <p className="text-text-secondary mb-6">
                Supported formats: PDF, DOCX, TXT
              </p>

              <label className="btn-primary cursor-pointer inline-flex items-center space-x-2">
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2 text-success-green mb-4">
                    <FiCheckCircle className="w-5 h-5" />
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="btn-primary"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  Overall Score
                </h2>
                <div className="text-4xl font-bold text-tech-blue">
                  {analysis.overallScore}/100
                </div>
              </div>
              <div className="w-full bg-slate-light rounded-full h-4">
                <div
                  className="bg-tech-blue h-4 rounded-full transition-all"
                  style={{ width: `${analysis.overallScore}%` }}
                />
              </div>
            </div>

            {/* ATS Score */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    ATS Compatibility Score
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    How well your resume will pass Applicant Tracking Systems
                  </p>
                </div>
                <div className="text-3xl font-bold text-military-green">
                  {analysis.atsScore}/100
                </div>
              </div>
              <div className="w-full bg-slate-light rounded-full h-3">
                <div
                  className="bg-military-green h-3 rounded-full transition-all"
                  style={{ width: `${analysis.atsScore}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            <div className="card">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center space-x-2">
                <FiCheckCircle className="text-success-green" />
                <span>Strengths</span>
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-success-green mt-1">✓</span>
                    <span className="text-text-secondary">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center space-x-2">
                <FiAlertCircle className="text-warning-amber" />
                <span>Areas for Improvement</span>
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-warning-amber mt-1">!</span>
                    <span className="text-text-secondary">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="card">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Detailed Suggestions
              </h3>
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-navy-dark rounded-lg border border-slate-light"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-text-primary">
                        {suggestion.title}
                      </h4>
                      <span
                        className={`badge ${
                          suggestion.severity === "critical"
                            ? "badge-warning"
                            : suggestion.severity === "important"
                            ? "badge-info"
                            : "badge-success"
                        }`}
                      >
                        {suggestion.severity}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">
                      {suggestion.description}
                    </p>
                    {suggestion.example && (
                      <div className="mt-2 p-3 bg-slate-bg rounded text-sm">
                        <div className="text-xs text-text-secondary uppercase mb-1">
                          Example:
                        </div>
                        <div className="text-text-primary">
                          {suggestion.example}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps */}
            {analysis.skillGaps && analysis.skillGaps.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Recommended Skills to Learn
                </h3>
                <div className="space-y-4">
                  {analysis.skillGaps.map((gap: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-navy-dark rounded-lg border border-slate-light"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-text-primary">
                          {gap.skill}
                        </h4>
                        <span
                          className={`badge ${
                            gap.importance === "high"
                              ? "badge-warning"
                              : gap.importance === "medium"
                              ? "badge-info"
                              : "badge-success"
                          }`}
                        >
                          {gap.importance} priority
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm mb-3">
                        Common in: {gap.commonIn.join(", ")}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs text-text-secondary uppercase mb-2">
                          Learning Resources:
                        </div>
                        {gap.learningResources.map((resource: string, idx: number) => (
                          <div key={idx} className="text-sm text-tech-blue">
                            • {resource}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Military Translation */}
            {analysis.civilianTranslation?.militaryTerms?.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Military-to-Civilian Translations
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Use these civilian equivalents to make your experience more accessible to hiring managers
                </p>
                <div className="space-y-3">
                  {analysis.civilianTranslation.militaryTerms.map(
                    (term: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-navy-dark rounded-lg border border-slate-light"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-text-secondary uppercase block mb-1">
                              Military Term
                            </span>
                            <p className="text-text-primary font-semibold">
                              {term.military}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-text-secondary uppercase block mb-1">
                              Civilian Equivalent
                            </span>
                            <p className="text-tech-blue font-semibold">
                              {term.civilian}
                            </p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-light">
                          <span className="text-xs text-text-secondary uppercase block mb-1">
                            Context
                          </span>
                          <p className="text-text-secondary text-sm">
                            {term.context}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                Analyze Another Resume
              </button>
              <button className="btn-primary w-full sm:w-auto">
                Download Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
