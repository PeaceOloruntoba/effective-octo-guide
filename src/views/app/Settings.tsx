import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useProfileStore } from "../../store/useProfileStore";

export default function Settings() {
  const { user, logout, logoutAll } = useAuthStore();
  const [busy, setBusy] = useState<'logout'|'logoutAll'|null>(null);
  const { user: pUser, profile, loading, getProfile } = useProfileStore();

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
              <Row label="Bio" value={profile?.bio ?? '—'} />
            </Section>
            <Section title="Health">
              <Grid>
                <Row label="Age" value={profile?.age ?? '—'} />
                <Row label="Gender" value={profile?.gender ?? '—'} />
                <Row label="Height (cm)" value={profile?.height_cm ?? '—'} />
                <Row label="Weight (kg)" value={profile?.weight_kg ?? '—'} />
                <Row label="Activity level" value={profile?.activity_level ?? '—'} />
                <Row label="Health goals" value={(profile?.health_goals || []).join(', ') || '—'} />
                <Row label="Food allergies" value={(profile?.food_allergies || []).join(', ') || '—'} />
                <Row label="Medical restrictions" value={(profile?.medical_dietary_restrictions || []).join(', ') || '—'} />
                <Row label="Preferred calories" value={profile?.preferred_calorie_range ?? '—'} />
                <Row label="Macronutrient focus" value={(profile?.macronutrient_focus || []).join(', ') || '—'} />
              </Grid>
            </Section>
            <Section title="Taste">
              <Grid>
                <Row label="Favorite flavors" value={(profile?.favorite_flavors || []).join(', ') || '—'} />
                <Row label="Cuisine preferences" value={(profile?.cuisine_preferences || []).join(', ') || '—'} />
                <Row label="Heat tolerance" value={profile?.heat_tolerance ?? '—'} />
                <Row label="Texture preference" value={(profile?.texture_preference || []).join(', ') || '—'} />
                <Row label="Foods loved" value={(profile?.foods_loved || []).join(', ') || '—'} />
                <Row label="Foods disliked" value={(profile?.foods_disliked || []).join(', ') || '—'} />
                <Row label="Snack personality" value={profile?.snack_personality ?? '—'} />
              </Grid>
            </Section>
            <Section title="Preferences">
              <Grid>
                <Row label="Meal prep style" value={profile?.meal_prep_style ?? '—'} />
                <Row label="Cooking skill level" value={profile?.cooking_skill_level ?? '—'} />
                <Row label="Budget level" value={profile?.budget_level ?? '—'} />
                <Row label="Meals per day" value={profile?.meals_per_day ?? '—'} />
                <Row label="Diet type" value={profile?.diet_type ?? '—'} />
                <Row label="Household size" value={profile?.household_size ?? '—'} />
                <Row label="Shopping frequency" value={profile?.shopping_frequency ?? '—'} />
                <Row label="Equipment" value={(profile?.kitchen_equipment_available || []).join(', ') || '—'} />
                <Row label="Leftovers preference" value={profile?.leftovers_preference ?? '—'} />
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
