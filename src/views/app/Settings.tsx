import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useProfileStore } from "../../store/useProfileStore";

export default function Settings() {
  const { user, logout, logoutAll } = useAuthStore();
  const [busy, setBusy] = useState<'logout'|'logoutAll'|null>(null);
  const { user: pUser, profile, loading, getProfile } = useProfileStore();

  const pf = useMemo(() => formatProfile(profile || {} as any), [profile]);

  useEffect(() => { getProfile().catch(()=>{}); }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="rounded border p-4 mb-4">
        <div className="text-xs text-gray-500 mb-1">Signed in as</div>
        <div className="text-lg font-semibold">{user?.first_name}{" "}{user?.last_name}</div>
        <div className="text-gray-700">{user?.email}</div>
      </div>
      <div className="flex gap-3">
        <Link to="/app/settings/edit-profile" className="h-10 px-4 rounded bg-blue-600 text-white inline-flex items-center">Edit profile</Link>
        <button className="h-10 px-4 rounded text-white bg-red-600 disabled:opacity-60" disabled={busy!==null}
          onClick={async()=>{ setBusy('logout'); try { await logout(); } finally { setBusy(null); } }}>
          {busy==='logout' ? 'Logging out...' : 'Logout'}
        </button>
        <button className="h-10 px-4 rounded text-white bg-red-700 disabled:opacity-60" disabled={busy!==null}
          onClick={async()=>{ setBusy('logoutAll'); try { await logoutAll(); } finally { setBusy(null); } }}>
          {busy==='logoutAll' ? 'Logging out all...' : 'Logout all devices'}
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Profile</h3>
        {loading && <div className="text-gray-500">Loading profile...</div>}
        {!loading && (
          <div className="space-y-4">
            <Section title="Basic">
              <Row label="Name" value={`${pUser?.first_name ?? ''} ${pUser?.last_name ?? ''}`.trim() || '—'} />
              <Row label="Email" value={pUser?.email || '—'} />
              <Row label="Bio" value={pf.bio ?? '—'} />
            </Section>
            <Section title="Health">
              <Grid>
                <Row label="Age" value={pf.age ?? '—'} />
                <Row label="Gender" value={pf.gender ?? '—'} />
                <Row label="Height (cm)" value={pf.height_cm ?? '—'} />
                <Row label="Weight (kg)" value={pf.weight_kg ?? '—'} />
                <Row label="Activity level" value={pf.activity_level ?? '—'} />
                <Row label="Health goals" value={(pf.health_goals || []).join(', ') || '—'} />
                <Row label="Food allergies" value={(pf.food_allergies || []).join(', ') || '—'} />
                <Row label="Medical restrictions" value={(pf.medical_dietary_restrictions || []).join(', ') || '—'} />
                <Row label="Preferred calories" value={pf.preferred_calorie_range ?? '—'} />
                <Row label="Macronutrient focus" value={(pf.macronutrient_focus || []).join(', ') || '—'} />
              </Grid>
            </Section>
            <Section title="Taste">
              <Grid>
                <Row label="Favorite flavors" value={(pf.favorite_flavors || []).join(', ') || '—'} />
                <Row label="Cuisine preferences" value={(pf.cuisine_preferences || []).join(', ') || '—'} />
                <Row label="Heat tolerance" value={pf.heat_tolerance ?? '—'} />
                <Row label="Texture preference" value={(pf.texture_preference || []).join(', ') || '—'} />
                <Row label="Foods loved" value={(pf.foods_loved || []).join(', ') || '—'} />
                <Row label="Foods disliked" value={(pf.foods_disliked || []).join(', ') || '—'} />
                <Row label="Snack personality" value={pf.snack_personality ?? '—'} />
              </Grid>
            </Section>
            <Section title="Preferences">
              <Grid>
                <Row label="Meal prep style" value={pf.meal_prep_style ?? '—'} />
                <Row label="Cooking skill level" value={pf.cooking_skill_level ?? '—'} />
                <Row label="Budget level" value={pf.budget_level ?? '—'} />
                <Row label="Meals per day" value={pf.meals_per_day ?? '—'} />
                <Row label="Diet type" value={pf.diet_type ?? '—'} />
                <Row label="Household size" value={pf.household_size ?? '—'} />
                <Row label="Shopping frequency" value={pf.shopping_frequency ?? '—'} />
                <Row label="Equipment" value={(pf.kitchen_equipment_available || []).join(', ') || '—'} />
                <Row label="Leftovers preference" value={pf.leftovers_preference ?? '—'} />
              </Grid>
            </Section>
          </div>
        )}
      </div>
      <div className="mt-6 text-gray-400">v1.0.0</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>
      <div className="rounded border p-4">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-800 break-words">{String(value)}</div>
    </div>
  );
}

// Helpers
const ARRAY_FIELDS = new Set([
  "health_goals",
  "food_allergies",
  "medical_dietary_restrictions",
  "macronutrient_focus",
  "favorite_flavors",
  "cuisine_preferences",
  "texture_preference",
  "foods_loved",
  "foods_disliked",
  "kitchen_equipment_available",
]);

function tryParseJson<T = any>(s: string): T | null {
  try { return JSON.parse(s); } catch { return null; }
}

function normalizeArray(v: any): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') {
    const trimmed = v.trim();
    const asJson = (trimmed.startsWith('[') && trimmed.endsWith(']')) ? tryParseJson<string[]>(trimmed) : null;
    if (asJson) return asJson.map(String);
    // Fallback: split comma-separated
    return trimmed ? trimmed.split(',').map(s=>s.trim()).filter(Boolean) : [];
  }
  return [];
}

function formatBio(raw: any): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const parsed = tryParseJson<any>(raw);
    if (parsed != null) {
      if (typeof parsed === 'string') return parsed;
      if (Array.isArray(parsed)) return parsed.join(', ');
      if (typeof parsed === 'object') return Object.values(parsed).map(String).join(', ');
    }
    // Fallback: strip braces/quotes artifacts like {"text","text"}
    const cleaned = raw.replace(/^\s*[\[{"']+|[\]}"']+\s*$/g, '').replace(/"/g,'');
    return cleaned.split(',').map(s=>s.trim()).filter(Boolean).join(', ');
  }
  if (Array.isArray(raw)) return raw.map(String).join(', ');
  if (typeof raw === 'object') return Object.values(raw).map(String).join(', ');
  return String(raw);
}

function formatProfile(p: Record<string, any>) {
  const out: Record<string, any> = { ...p };
  // Normalize arrays
  for (const k of ARRAY_FIELDS) {
    if (k in out) out[k] = normalizeArray(out[k]);
  }
  // Bio
  out.bio = formatBio(out.bio);
  return out;
}
