import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { logo } from "../assets";
import { useAuthStore } from "../store/useAuthStore";

const MEAL_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
];

export default function LandingPage() {
  const [idx, setIdx] = useState(0);
  const images = useMemo(() => MEAL_IMAGES, []);
  const { fetchPublicPlans, plans } = useAuthStore();

  useEffect(() => {
    fetchPublicPlans();
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col bg-primary text-white">
      {/* HEADER */}
      <header className="px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Bunzi logo"
              className="h-10 w-10 rounded-full shadow-md"
            />
            <span className="font-extrabold text-xl md:text-2xl tracking-tight">
              BunziTech Meal Planner
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/login" className="hover:text-accent transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 rounded-md bg-accent text-neutral-900 shadow hover:shadow-md transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="flex-1 px-4 py-20 md:py-28 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Plan meals you love.
            <br />
            Eat better every week.
          </h1>
          <p className="text-base md:text-lg opacity-90 mb-6">
            BunziTech Meal Planner is Nigeria&apos;s smartest meal planner. Track
            nutrition, sync your pantry, and plan smarter without stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md border border-accent text-white hover:bg-white/10 transition"
            >
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
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === idx ? "bg-accent shadow" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDING 100 */}
      <section className="px-4 py-16">
        <div
          className="max-w-5xl mx-auto p-8 rounded-2xl bg-white/20 backdrop-blur-sm border border-accent/30 shadow-lg relative"
          style={{
            boxShadow:
              "0 0 25px rgba(255, 200, 80, 0.35), inset 0 0 20px rgba(255, 200, 80, 0.25)",
          }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-neutral-900 text-xs font-semibold shadow">
            🚀 Launch Special
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Founding 100 Offer
          </h2>
          <p className="text-center opacity-90 mb-6">
            Exclusive benefits for the first 100 users.
          </p>

          <ul className="grid gap-3 md:grid-cols-2">
            <li className="flex items-start gap-2">
              ✨ ₦1,750/month for first 3 months
            </li>
            <li className="flex items-start gap-2">✨ FREE 7-day trial</li>
            <li className="flex items-start gap-2">
              ✨ Personalized meal plan
            </li>
            <li className="flex items-start gap-2">✨ 1-on-1 onboarding</li>
            <li className="flex items-start gap-2">✨ Founding Member badge</li>
            <li className="flex items-start gap-2">
              ✨ Only 100 spots available
            </li>
          </ul>

          <div className="mt-8 text-center">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition"
            >
              Claim Your Spot
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why BunziTech Meal Planner?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon="🥗"
            title="Smart Meal Planning"
            desc="Automated weekly plans tailored to your goals."
          />
          <FeatureCard
            icon="💸"
            title="Budget Friendly"
            desc="Eat well without overspending."
          />
          <FeatureCard
            icon="⏳"
            title="Save Time"
            desc="No more guessing what to cook."
          />
        </div>
      </section>

      {/* AI RECOMMENDATION SYSTEM – COMING SOON */}
      <section className="px-4 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">AI Recommendation System</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            A smarter way to plan your meals. Soon, you'll get personalized
            recipe suggestions, ingredient optimization, and dynamic diet
            guidance powered by advanced nutrition AI.
          </p>

          <span className="inline-block mt-5 px-4 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/40">
            Coming Soon
          </span>
        </div>

        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 shadow-lg">
          <p className="text-white/90 text-center text-lg leading-relaxed">
            Imagine opening your fridge, telling the app what you have, and
            instantly getting smart, budget-friendly, health-conscious meal
            plans tailored to your goals. That&apos;s the future we&apos;re
            building.
          </p>
        </div>
      </section>

      {/* PLANS SECTION */}
      {plans && plans.length > 0 && (
        <section className="px-4 py-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Basic Plans</h2>
          <p className="text-center text-white/80 mb-10 max-w-lg mx-auto">
            Choose a plan that fits your lifestyle. These are our core plans —
            Pro plans will drop soon when the AI features go live.
          </p>

          <div className="space-y-6">
            {plans.map((p) => {
              const price = (p.price_cents / 100).toLocaleString();

              const description = (() => {
                switch (p.plan) {
                  case "monthly":
                    return "Perfect for trying out the planner and staying flexible month-to-month.";
                  case "quarterly":
                    return "Great if you're committing to healthier eating and want to save a little along the way.";
                  case "biannual":
                    return "A solid mid-term plan with better savings for consistent meal planning.";
                  case "annual":
                    return "Best value for dedicated users. Pay once, enjoy stress-free planning all year.";
                  default:
                    return "";
                }
              })();

              return (
                <div
                  key={p.plan}
                  className="rounded-xl bg-white/10 border border-white/20 p-6 backdrop-blur-sm shadow-md"
                >
                  <div className="flex gap-4 items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold capitalize">
                        {p.plan}
                      </div>
                      <p className="text-white/80 text-sm mt-1">
                        {description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold">₦{price}</div>
                      {/* <div className="text-xs text-white/70 uppercase tracking-wide">
                        {p.currency}
                      </div> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Loved by early users
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <TrustCard text="Removed my food decision stress. I just follow the plan now." />
          <TrustCard text="Dropped 3kg in one month without starving." />
          <TrustCard text="Finally a Nigerian planner that adapts to my taste." />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Eat Smarter?</h2>
        <Link
          to="/signup"
          className="px-6 py-3 rounded-md font-semibold bg-accent text-neutral-900 shadow hover:shadow-lg transition"
        >
          Start Free Today
        </Link>
      </section>

      {/* MOBILE APP – COMING SOON */}
      <section className="px-4 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Our Mobile App</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Meal planning is about to get even easier. Track your recipes, view
            your plans on the go, and receive AI-powered recommendations right
            from your pocket.
          </p>

          <span className="inline-block mt-5 px-4 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/40">
            Coming Soon
          </span>
        </div>

        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 shadow-lg">
          <p className="text-center text-white/90 text-lg leading-relaxed">
            Available soon on both Android and iOS. The full Munchly experience
            — rebuilt mobile-first.
          </p>

          <div className="flex justify-center mt-8 gap-4 opacity-50">
            <div className="h-12 w-36 bg-white/20 rounded-lg"></div>
            <div className="h-12 w-36 bg-white/20 rounded-lg"></div>
          </div>
        </div>
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
