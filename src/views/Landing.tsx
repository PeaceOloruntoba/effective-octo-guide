import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { logo } from "../assets";

const MEAL_IMAGES = [
  // Royalty-free food photos (Unsplash)
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
];

export default function Landing() {
  const [idx, setIdx] = useState(0);
  const images = useMemo(() => MEAL_IMAGES, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-dvh flex flex-col bg-primary">
      <header className="px-4">
        <div className="mx-auto max-w-6xl h-16 md:h-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Bunzi logo" className="h-8 w-8 rounded-full shadow-md md:h-10 md:w-10" />
            <div className="font-extrabold text-lg md:text-2xl tracking-tight">Bunzi</div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm opacity-95">
            <Link to="/login" className="hover:text-accent transition-colors">Sign in</Link>
            <Link to="/signup" className="px-3 py-1 rounded-md bg-accent text-neutral-900 shadow hover:shadow-md transition">Get started</Link>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-10 md:gap-12 md:grid-cols-2 items-center text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-xs mb-3">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span>Plan smarter. Eat better.</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Plan meals you love. Eat better every week.</h1>
            <p className="text-base md:text-lg opacity-95 mb-6 md:mb-8">Build your weekly plan in minutes, track nutrition effortlessly, and keep your pantry and shopping lists in sync.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="px-5 py-3 rounded-md text-base font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition">Start for free</Link>
              <Link to="/login" className="px-5 py-3 rounded-md border text-base font-semibold border-accent text-white hover:bg-white/5 transition">Sign in</Link>
            </div>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>• Smart weekly planner</li>
              <li>• Accurate nutrition overview</li>
              <li>• Pantry and shopping, always up-to-date</li>
            </ul>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Delicious meal"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-accent shadow' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Everything you need to plan, track and shop</h2>
            <p className="text-gray-600 mt-2">Designed for busy people who still care about great food and great health.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Meal Planning" desc="Simple, fast weekly planning that fits your schedule." icon="🍽️" />
            <FeatureCard title="Nutrition" desc="Daily calories, protein, carbs and fat at a glance." icon="📊" />
            <FeatureCard title="Pantry & Shopping" desc="Know what you have; buy only what you need." icon="🛒" />
            <FeatureCard title="Recipes" desc="Save favorites and discover new ones." icon="📚" />
            <FeatureCard title="Sync across devices" desc="Your plan where you are." icon="📱" />
            <FeatureCard title="Privacy First" desc="Your data stays yours." icon="🔒" />
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid gap-8 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Built by Bunzi Tech</h3>
            <p className="text-gray-600 mb-4">Bunzi Tech crafts delightful, pragmatic software for everyday life. Learn more about the team and our values.</p>
            <a href="https://bunzitech-ten.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-primary text-white shadow hover:shadow-md">
              Visit Bunzi Tech
              <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="order-1 md:order-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Thoughtful UX, mobile-first</li>
              <li>• Modern tech stack</li>
              <li>• Fast, secure, reliable</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Eat well, every day</h3>
          <p className="text-gray-600 mb-6">Join others planning better meals and saving time each week.</p>
          <Link to="/signup" className="inline-flex items-center justify-center px-5 h-12 rounded-md bg-accent text-neutral-900 font-semibold shadow hover:shadow-lg">Get started</Link>
        </div>
      </section>

      <footer className="px-4 py-6 text-center text-white/70 text-sm">
        <div className="mx-auto max-w-6xl"> 2023 Bunzi. Eat well, every day.</div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </div>
  );
}
