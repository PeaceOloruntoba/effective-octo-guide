import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { logo } from "../assets";

const MEAL_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
];

export default function LandingPage() {
  const [idx, setIdx] = useState(0);
  const images = useMemo(() => MEAL_IMAGES, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col bg-primary text-white">
      {/* HEADER */}
      <header className="px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Bunzi logo" className="h-10 w-10 rounded-full shadow-md" />
            <span className="font-extrabold text-xl md:text-2xl tracking-tight">BunziTech Meal Planner</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/login" className="hover:text-accent transition-colors">Sign in</Link>
            <Link to="/signup" className="px-3 py-1 rounded-md bg-accent text-neutral-900 shadow hover:shadow-md transition">Get started</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="flex-1 px-4 py-20 md:py-28 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* TEXT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Plan meals you love.<br />Eat better every week.
          </h1>
          <p className="text-base md:text-lg opacity-90 mb-6">
            BunziTech Meal Planner is Nigeria’s smartest meal planner. Track nutrition, sync your pantry, and plan smarter without stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link to="/signup" className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition">
              Start Free
            </Link>
            <Link to="/login" className="px-6 py-3 rounded-md border border-accent text-white hover:bg-white/10 transition">
              Sign in
            </Link>
          </div>
        </div>

        {/* IMAGE SLIDER */}
        <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {images.map((src, i) => (
            <img
              key={i}
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
      </section>

      {/* FOUNDING 100 PROMO */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-white/20 backdrop-blur-sm border border-accent/30 shadow-lg"
             style={{ boxShadow: '0 0 25px rgba(255, 200, 80, 0.35), inset 0 0 20px rgba(255, 200, 80, 0.25)' }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-neutral-900 text-xs font-semibold shadow">
            🚀 Launch Special
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Founding 100 Offer</h2>
          <p className="text-center opacity-90 mb-6">Exclusive benefits for the first 100 users.</p>

          <ul className="grid gap-3 md:grid-cols-2">
            <li className="flex items-start gap-2">✨ ₦1,750/month for first 3 months</li>
            <li className="flex items-start gap-2">✨ FREE 7-day trial</li>
            <li className="flex items-start gap-2">✨ Personalized meal plan</li>
            <li className="flex items-start gap-2">✨ 1-on-1 onboarding</li>
            <li className="flex items-start gap-2">✨ Founding Member badge</li>
            <li className="flex items-start gap-2">✨ Only 100 spots available</li>
          </ul>

          <div className="mt-8 text-center">
            <Link to="/signup" className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition">
              Claim Your Spot
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Why BunziTech Meal Planner?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon="🥗" title="Smart Meal Planning" desc="Automated weekly plans tailored to your goals." />
          <FeatureCard icon="💸" title="Budget Friendly" desc="Eat well without overspending." />
          <FeatureCard icon="⏳" title="Save Time" desc="No more guessing what to cook." />
        </div>
      </section>

      {/* TRUST */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Loved by early users</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <TrustCard text="Removed my food decision stress. I just follow the plan now." />
          <TrustCard text="Dropped 3kg in one month without starving." />
          <TrustCard text="Finally a Nigerian planner that adapts to my taste." />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Eat Smarter?</h2>
        <Link to="/signup" className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition">
          Start Free Today
        </Link>
      </section>

      <footer className="px-4 py-6 text-center text-white/70 text-sm">
        © 2025 BunziTech. Eat well, every day.
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  desc: string;
  icon?: string;
};
function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white shadow hover:shadow-md transition text-gray-900">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm">{desc}</div>
    </div>
  );
}

type TrustCardProps = { text: string };
function TrustCard({ text }: TrustCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm text-gray-900 text-sm leading-relaxed">
      {text}
    </div>
  );
}
