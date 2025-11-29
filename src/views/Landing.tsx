import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Colors } from "../utils/api";

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
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: Colors.primary }}>
      <header className="px-4">
        <div className="mx-auto max-w-6xl h-14 flex items-center justify-between text-white">
          <div className="font-bold text-lg">Bunzi</div>
          <nav className="hidden sm:flex items-center gap-4 text-sm opacity-95">
            <Link to="/login">Sign in</Link>
            <Link to="/signup" className="px-3 py-1 rounded-md" style={{ backgroundColor: Colors.accent, color: "#1a1a1a" }}>Get started</Link>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2 items-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Plan meals you love. Eat better every week.</h1>
            <p className="text-lg opacity-95 mb-6">Build your weekly plan in minutes, track nutrition effortlessly, and keep your pantry and shopping lists in sync.</p>
            <div className="flex gap-3">
              <Link to="/signup" className="px-5 py-3 rounded-md text-base font-semibold" style={{ backgroundColor: Colors.accent, color: "#1a1a1a" }}>Start for free</Link>
              <Link to="/login" className="px-5 py-3 rounded-md border text-base font-semibold" style={{ borderColor: Colors.accent, color: "#fff" }}>Sign in</Link>
            </div>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>• Smart weekly planner</li>
              <li>• Accurate nutrition overview</li>
              <li>• Pantry and shopping, always up-to-date</li>
            </ul>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-xl overflow-hidden shadow-2xl">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Delicious meal"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === idx ? 1 : 0 }}
              />
            ))}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ background: i === idx ? Colors.accent : "#ffffff66" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-3">
          <FeatureCard title="Meal Planning" desc="Drag-and-drop weekly plan that fits your life." />
          <FeatureCard title="Nutrition" desc="Daily calories, protein, carbs and fat at a glance." />
          <FeatureCard title="Pantry & Shopping" desc="Know what you have; buy only what you need." />
        </div>
      </section>

      <footer className="px-4 py-6 text-center text-white/70 text-sm">
        <div className="mx-auto max-w-6xl">© {new Date().getFullYear()} Bunzi. Eat well, every day.</div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </div>
  );
}
