import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-ink-800 p-8 sm:p-10 rounded-xl shadow-sm border border-ink-100 dark:border-ink-700">
        <h1 className="font-display text-3xl text-center mb-8 text-ink-800 dark:text-ink-100">About ShutterRent</h1>
        <p className="text-ink-600 dark:text-ink-300 mb-4 leading-relaxed">
          At <strong className="text-ink-800 dark:text-ink-100">ShutterRent</strong>, we are passionate about making premium photography accessible to everyone.
          Whether you're a professional photographer, a traveler, or a content creator, our platform helps you rent
          top-quality cameras easily and affordably.
        </p>
        <p className="text-ink-600 dark:text-ink-300 mb-4 leading-relaxed">
          Founded in 2025, ShutterRent bridges the gap between equipment owners and creatives in need of gear—saving
          money, reducing waste, and encouraging collaboration. We offer a simple, secure, and efficient camera rental
          experience with a growing selection of DSLRs, mirrorless cameras, and more.
        </p>
        <p className="text-ink-600 dark:text-ink-300 mb-4 leading-relaxed">
          We're here to empower visual storytellers to focus on what they do best—<em>capturing beautiful moments</em>.
        </p>

        <div className="mt-10 pt-8 border-t border-ink-200 dark:border-ink-700 text-center">
          <h2 className="font-display text-xl mb-3 text-ink-800 dark:text-ink-100">Contact Us</h2>
          <p className="text-ink-500 dark:text-ink-400">aamirptk95@gmail.com</p>
          <p className="text-ink-500 dark:text-ink-400">Yangon, Myanmar</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;