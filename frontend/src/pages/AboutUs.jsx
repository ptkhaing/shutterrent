import React from 'react';
import heroImage from '../assets/hero.jpg';

const VALUES = [
  {
    title: 'Affordable',
    body: 'Daily rental rates that beat buying gear outright, especially for one-off shoots.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Trusted & Secure',
    body: 'JWT-authenticated accounts and a verified listing flow keep bookings straightforward and safe.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
  },
  {
    title: 'Sustainable',
    body: 'Renting instead of buying means less unused gear sitting in a drawer, and less waste overall.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8c0-3-2-6-6-6S5 5 5 8s2 5 2 5m10-5c0 3-2 5-2 5m0 0c-2 2-5 2-5 2m5-2c1.5 1 2 3 2 5 0 3-2 6-6 6s-6-3-6-6c0-2 .5-4 2-5" />
      </svg>
    ),
  },
  {
    title: 'Community-Driven',
    body: 'Built for creatives, by a creative — every feature comes from an actual photographer\'s workflow.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <circle cx="9" cy="8" r="3" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
        <circle cx="17" cy="8" r="2.5" /><path strokeLinecap="round" d="M16 15h2a4 4 0 0 1 4 4v1" />
      </svg>
    ),
  },
];

const STATS = [
  { label: 'Founded', value: '2025' },
  { label: 'Built by', value: 'Solo Developer' },
  { label: 'Stack', value: 'MERN' },
  { label: 'Based in', value: 'Yangon, MM' },
];

function AboutUs() {
  return (
    <div className="bg-white dark:bg-ink-950 min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[340px] sm:h-[400px]">
        <img src={heroImage} alt="Photography gear" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/50 to-ink-900/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-amber-300 text-xs sm:text-sm mb-4">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl">About ShutterRent</h1>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-xl sm:text-2xl text-ink-800 dark:text-ink-100">{s.value}</p>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Founder / story split */}
      <div className="max-w-5xl mx-auto px-4 py-20 grid sm:grid-cols-5 gap-12 items-center">
        <div className="sm:col-span-2 flex justify-center">
          <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-5xl font-display text-amber-700 dark:text-amber-300 shadow-sm">
            PK
          </div>
        </div>
        <div className="sm:col-span-3">
          <p className="uppercase tracking-[0.2em] text-amber-500 text-xs mb-3">From the Founder</p>
          <h2 className="font-display text-2xl sm:text-3xl mb-5 text-ink-800 dark:text-ink-100">
            Built by a photographer, for photographers
          </h2>
          <p className="text-ink-600 dark:text-ink-300 mb-4 leading-relaxed">
            At <strong className="text-ink-800 dark:text-ink-100">ShutterRent</strong>, we're passionate about making
            premium photography accessible to everyone — whether you're a professional, a traveler, or just getting
            started, our platform helps you rent top-quality cameras easily and affordably.
          </p>
          <p className="text-ink-600 dark:text-ink-300 leading-relaxed">
            Founded in 2025, ShutterRent bridges the gap between equipment owners and creatives in need of gear,
            saving money, reducing waste, and encouraging collaboration — so you can focus on what you do best:{' '}
            <em>capturing beautiful moments</em>.
          </p>
        </div>
      </div>

      {/* Values grid */}
      <div className="bg-ink-50 dark:bg-ink-900 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h3 className="font-display text-2xl sm:text-3xl text-center mb-12 text-ink-800 dark:text-ink-100">
            What We Stand For
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-lg p-6">
                <div className="h-11 w-11 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-300 mb-4">
                  {v.icon}
                </div>
                <h4 className="font-semibold text-ink-800 dark:text-ink-100 mb-2">{v.title}</h4>
                <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl mb-4 text-ink-800 dark:text-ink-100">Get in Touch</h2>
        <p className="text-ink-500 dark:text-ink-400 mb-1">aamirptk95@gmail.com</p>
        <p className="text-ink-500 dark:text-ink-400">Yangon, Myanmar</p>
      </div>
    </div>
  );
}

export default AboutUs;
