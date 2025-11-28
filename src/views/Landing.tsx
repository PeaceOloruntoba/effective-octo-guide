import { Link } from "react-router";
import { Colors } from "../utils/api";

export default function Landing() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: Colors.primary }}>
      <div className="mx-auto max-w-6xl px-4 py-16 text-white">
        <h1 className="text-4xl font-bold mb-3">Bunzi Meal Planner</h1>
        <p className="text-lg opacity-90 mb-6">Plan meals, track nutrition, and keep your pantry and shopping organized.</p>
        <div className="flex gap-3">
          <Link to="/signup" className="px-4 py-2 rounded-md" style={{ backgroundColor: Colors.accent, color: "#1a1a1a" }}>Get started</Link>
          <Link to="/login" className="px-4 py-2 rounded-md border" style={{ borderColor: Colors.accent, color: "#fff" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
