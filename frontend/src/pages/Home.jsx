import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

function Home() {
  return (
    <div className="bg-ink-50 dark:bg-ink-900 min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[480px]">
        <img src={heroImage} alt="Photographer at work" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-ink-900/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-amber-300 text-xs sm:text-sm mb-4">
            Professional gear, by the day
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">Capture Moments</h1>
          <p className="text-base sm:text-lg mt-4 text-ink-100 max-w-xl">
            Rent cameras, lenses and lighting from a platform built for photographers, by a photographer.
          </p>
          <Link
            to="/listings"
            className="mt-8 inline-block rounded-full bg-amber-400 text-ink-900 font-semibold px-8 py-3 hover:bg-amber-300 transition-colors duration-200"
          >
            Browse Gear
          </Link>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto px-4">
        {/* How It Works */}
        <section className="py-20">
          <h3 className="font-display text-2xl sm:text-3xl text-center mb-12 text-ink-800 dark:text-ink-100">How It Works</h3>
          <div className="grid gap-8 text-left sm:grid-cols-3">
            {[
              { step: '01', title: 'Browse Listings', body: 'Explore camera bodies, lenses and lighting with real specs and photos.' },
              { step: '02', title: 'Pick Your Dates', body: 'Choose your rental window and confirm availability instantly.' },
              { step: '03', title: 'Pick Up or Deliver', body: 'Pay in cash on delivery or pickup — no card required.' },
            ].map((item) => (
              <div key={item.step} className="border-t-2 border-amber-400 pt-4">
                <span className="font-display text-amber-500 text-3xl">{item.step}</span>
                <h4 className="text-lg font-semibold mt-2 mb-1 text-ink-800 dark:text-ink-100">{item.title}</h4>
                <p className="text-ink-500 dark:text-ink-400 text-sm sm:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 border-t border-ink-200 dark:border-ink-700">
          <h3 className="font-display text-2xl sm:text-3xl text-center mb-10 text-ink-800 dark:text-ink-100">Why Choose Us</h3>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto text-ink-600 dark:text-ink-300 text-sm sm:text-base">
            <li className="flex gap-3"><span className="text-amber-500">—</span>Affordable daily rental rates for all camera types</li>
            <li className="flex gap-3"><span className="text-amber-500">—</span>Verified listings, no surprises at pickup</li>
            <li className="flex gap-3"><span className="text-amber-500">—</span>Convenient pickup & delivery options</li>
            <li className="flex gap-3"><span className="text-amber-500">—</span>Simple cash-on-delivery payment</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t border-ink-200 dark:border-ink-700 max-w-2xl mx-auto">
          <h3 className="font-display text-2xl sm:text-3xl text-center mb-10 text-ink-800 dark:text-ink-100">FAQ</h3>
          <div className="space-y-6 text-sm sm:text-base">
            <div>
              <h4 className="font-semibold text-ink-800 dark:text-ink-100">How do I rent a camera?</h4>
              <p className="text-ink-500 dark:text-ink-400 mt-1">Sign in, browse listings, select your dates, and confirm your booking.</p>
            </div>
            <div>
              <h4 className="font-semibold text-ink-800 dark:text-ink-100">Can I cancel my booking?</h4>
              <p className="text-ink-500 dark:text-ink-400 mt-1">Yes, bookings can be canceled anytime from your profile page.</p>
            </div>
            <div>
              <h4 className="font-semibold text-ink-800 dark:text-ink-100">Do I need to pay in advance?</h4>
              <p className="text-ink-500 dark:text-ink-400 mt-1">No — payment is cash on delivery when you receive the gear.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-8 text-center text-ink-400 dark:text-ink-500 text-xs sm:text-sm border-t border-ink-200 dark:border-ink-700">
        © {new Date().getFullYear()} ShutterRent. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;