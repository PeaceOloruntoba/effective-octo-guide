import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { handleError } from "../../utils/handleError";
import { useNavigate } from "react-router";
import { useProfileStore } from "../../store/useProfileStore";
import { toast } from "sonner";

// Keys used for draft persistence
function draftKey(userId?: string | null) {
  return userId ? `profile_draft_${userId}` : "profile_draft";
}

// All supported normalized profile fields

const allFields = [
  // user names handled separately
  // health
  "age",
  "gender",
  "height_cm",
  "weight_kg",
  "activity_level",
  "health_goals",
  "food_allergies",
  "medical_dietary_restrictions",
  "preferred_calorie_range",
  "macronutrient_focus",
  // taste
  "favorite_flavors",
  "cuisine_preferences",
  "heat_tolerance",
  "texture_preference",
  "foods_loved",
  "foods_disliked",
  "snack_personality",
  // preferences
  "meal_prep_style",
  "cooking_skill_level",
  "budget_level",
  "meals_per_day",
  "diet_type",
  "household_size",
  "shopping_frequency",
  "kitchen_equipment_available",
  "leftovers_preference",
  // misc
  "bio",
] as const;

export default function SettingsEditProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [values, setValues] = useState<Record<string, any>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarFileRef = useRef<File | null>(null);

  const dk = useMemo(() => draftKey(user?.id), [user?.id]);

  // Load profile and draft
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const draftRaw = localStorage.getItem(dk);
        if (draftRaw) {
          const draft = JSON.parse(draftRaw);
          if (!mounted) return;
          setFirstName(draft.first_name || "");
          setLastName(draft.last_name || "");
          setValues(draft.values || {});
        }
        const data = await useProfileStore.getState().getProfile();
        if (!mounted || !data) return;
        const u = data.user;
        const p = normalizeProfileForEdit(data.profile || {});
        setFirstName(u.first_name || "");
        setLastName(u.last_name || "");
        // Merge: draft overrides server
        const base: Record<string, any> = {};
        for (const k of allFields) base[k] = p?.[k] ?? null;
        const merged = { ...base, ...(values || {}) };
        setValues(merged);
      } catch (e) {
        handleError(e, { fallbackMessage: "Failed to load profile" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dk]);

  // Persist draft on change
  useEffect(() => {
    const draft = { first_name: firstName, last_name: lastName, values };
    try { localStorage.setItem(dk, JSON.stringify(draft)); } catch {}
  }, [dk, firstName, lastName, values]);

  const setField = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  const handleAvatarChange = (file: File | null) => {
    avatarFileRef.current = file;
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const submit = async (finish: boolean) => {
    setSaving(true);
    try {
      const payload = { first_name: firstName, last_name: lastName, values, bio: values.bio ?? null, avatarFile: avatarFileRef.current };
      const data = await useProfileStore.getState().updateProfile(payload);
      const p = (data?.profile || {}) as Record<string, any>;
      const newVals: Record<string, any> = {};
      for (const k of allFields) newVals[k] = p?.[k] ?? null;
      setValues((prev) => ({ ...newVals, ...prev }));
      toast.success(finish ? "Profile updated" : "Draft saved");
      // Clear draft if finishing
      if (finish) {
        try { localStorage.removeItem(dk); } catch {}
        navigate("/app/settings");
      }
    } catch (e) {
      handleError(e, { fallbackMessage: "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const StepControls = (
    <div className="mt-6 flex items-center justify-between">
      <button className="px-4 h-10 rounded bg-gray-100" disabled={step===1 || saving} onClick={()=>setStep((s)=>Math.max(1,s-1))}>Back</button>
      <div className="flex gap-2">
        <button className="px-4 h-10 rounded bg-amber-500 text-white disabled:opacity-60" disabled={saving} onClick={()=>submit(false)}>
          {saving ? "Saving..." : "Save draft"}
        </button>
        {step<5 ? (
          <button className="px-4 h-10 rounded bg-blue-600 text-white disabled:opacity-60" disabled={saving} onClick={()=>setStep((s)=>Math.min(5,s+1))}>Next</button>
        ) : (
          <button className="px-4 h-10 rounded bg-green-600 text-white disabled:opacity-60" disabled={saving} onClick={()=>submit(true)}>Finish</button>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-1">Edit Profile</h2>
      <div className="text-sm text-gray-500 mb-6">Step {step} of 5</div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">First name</label>
              <input className="w-full h-10 border rounded px-3" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last name</label>
              <input className="w-full h-10 border rounded px-3" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bio</label>
            <textarea className="w-full min-h-24 border rounded p-3" value={values.bio || ""} onChange={(e)=>setField("bio", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Avatar</label>
            {avatarPreview && (
              <img src={avatarPreview} alt="preview" className="w-24 h-24 object-cover rounded mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e)=>handleAvatarChange(e.target.files?.[0] || null)} />
          </div>
          {StepControls}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" type="number" value={values.age ?? ""} onChange={(v)=>setField("age", v)} />
            <Select label="Gender" value={values.gender ?? ""} onChange={(v)=>setField("gender", v)} options={["male","female","non_binary","prefer_not_to_say"]} />
            <Input label="Height (cm)" type="number" value={values.height_cm ?? ""} onChange={(v)=>setField("height_cm", v)} />
            <Input label="Weight (kg)" type="number" value={values.weight_kg ?? ""} onChange={(v)=>setField("weight_kg", v)} />
            <Select label="Activity level" value={values.activity_level ?? ""} onChange={(v)=>setField("activity_level", v)} options={["sedentary","lightly_active","moderately_active","very_active","athlete"]} />
            <MultiSelect label="Health goals" value={values.health_goals || []} onChange={(v)=>setField("health_goals", v)} options={["lose_weight","gain_weight","build_muscle","maintain_weight","improve_energy","balance_diet","manage_conditions"]} />
            <MultiSelect label="Food allergies" value={values.food_allergies || []} onChange={(v)=>setField("food_allergies", v)} options={["none","nuts","gluten","lactose","shellfish","soy","eggs","fish"]} />
            <MultiSelect label="Medical dietary restrictions" value={values.medical_dietary_restrictions || []} onChange={(v)=>setField("medical_dietary_restrictions", v)} options={["none","diabetes","hypertension","ulcer","high_cholesterol","kidney_disease","acid_reflux","pregnancy_diet"]} />
            <Select label="Preferred calorie range" value={values.preferred_calorie_range ?? ""} onChange={(v)=>setField("preferred_calorie_range", v)} options={["1200-1500","1500-1800","1800-2200","2200-2500","2500-plus"]} />
            <MultiSelect label="Macronutrient focus" value={values.macronutrient_focus || []} onChange={(v)=>setField("macronutrient_focus", v)} options={["high_protein","low_carb","balanced","high_fiber","low_fat"]} />
          </div>
          {StepControls}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MultiSelect label="Favorite flavors" value={values.favorite_flavors || []} onChange={(v)=>setField("favorite_flavors", v)} options={["sweet","spicy","savory","sour","umami","bitter"]} />
            <MultiSelect label="Cuisine preferences" value={values.cuisine_preferences || []} onChange={(v)=>setField("cuisine_preferences", v)} options={["nigerian","ghanaian","kenyan","american","italian","indian","chinese","mexican","mediterranean"]} />
            <Select label="Heat tolerance" value={values.heat_tolerance ?? ""} onChange={(v)=>setField("heat_tolerance", v)} options={["none","mild","medium","hot","very_hot"]} />
            <MultiSelect label="Texture preference" value={values.texture_preference || []} onChange={(v)=>setField("texture_preference", v)} options={["crispy","soft","creamy","chewy","crunchy","saucy"]} />
            <MultiSelect label="Foods loved" value={values.foods_loved || []} onChange={(v)=>setField("foods_loved", v)} options={["rice","pasta","beans","yam","plantain","chicken","beef","fish","vegetables","fruits"]} />
            <MultiSelect label="Foods disliked" value={values.foods_disliked || []} onChange={(v)=>setField("foods_disliked", v)} options={["none","rice","pasta","beans","yam","plantain","chicken","beef","fish","vegetables","fruits"]} />
            <Select label="Snack personality" value={values.snack_personality ?? ""} onChange={(v)=>setField("snack_personality", v)} options={["sweet_tooth","fitfam","small_chops_addict","healthy_snacker","random_grazer"]} />
          </div>
          {StepControls}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Meal prep style" value={values.meal_prep_style ?? ""} onChange={(v)=>setField("meal_prep_style", v)} options={["quick_10mins","15-30mins","gourmet","batch_cooking","no_cook"]} />
            <Select label="Cooking skill level" value={values.cooking_skill_level ?? ""} onChange={(v)=>setField("cooking_skill_level", v)} options={["beginner","intermediate","advanced","chef_mode"]} />
            <Select label="Budget level" value={values.budget_level ?? ""} onChange={(v)=>setField("budget_level", v)} options={["low","medium","high"]} />
            <Input label="Meals per day" type="number" value={values.meals_per_day ?? ""} onChange={(v)=>setField("meals_per_day", v)} />
            <Select label="Diet type" value={values.diet_type ?? ""} onChange={(v)=>setField("diet_type", v)} options={["none","keto","vegan","vegetarian","pescatarian","low_carb","high_protein","halal","gluten_free"]} />
            <Select label="Household size" value={values.household_size ?? ""} onChange={(v)=>setField("household_size", v)} options={["1","2","3","4","5_plus"]} />
            <Select label="Shopping frequency" value={values.shopping_frequency ?? ""} onChange={(v)=>setField("shopping_frequency", v)} options={["daily","few_times_week","weekly","biweekly","monthly"]} />
            <MultiSelect label="Kitchen equipment available" value={values.kitchen_equipment_available || []} onChange={(v)=>setField("kitchen_equipment_available", v)} options={["microwave","oven","air_fryer","stove","blender","pressure_pot","none"]} />
            <Select label="Leftovers preference" value={values.leftovers_preference ?? ""} onChange={(v)=>setField("leftovers_preference", v)} options={["love_it","sometimes","hate_it"]} />
          </div>
          {StepControls}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-2">
          <div className="text-gray-700">Review your details and click Finish to save.</div>
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-72">{JSON.stringify({ first_name: firstName, last_name: lastName, ...values }, null, 2)}</pre>
          {StepControls}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: any) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input className="w-full h-10 border rounded px-3" value={value} onChange={(e)=>onChange(type==="number" ? (e.target.value===""?"":Number(e.target.value)) : e.target.value)} type={type} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: any; onChange: (v: any) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <select className="w-full h-10 border rounded px-3" value={value} onChange={(e)=>onChange(e.target.value)}>
        <option value="">Select...</option>
        {options.map((o)=> (
          <option key={o} value={o}>{humanize(o)}</option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({ label, value, onChange, options }: { label: string; value: string[]; onChange: (v: string[]) => void; options: string[] }) {
  const [text, setText] = useState("");
  useEffect(()=>{ setText((value||[]).join(", ")); }, []);
  useEffect(()=>{ setText((value||[]).join(", ")); }, [value]);
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{humanize(label)}</label>
      <div className="flex gap-2">
        <select className="flex-1 h-10 border rounded px-3" value="" onChange={(e)=>{ const v=e.target.value; if(!v) return; if(!value?.includes(v)) onChange([...(value||[]), v]); }}>
          <option value="">Add...</option>
          {options.filter((o)=>!value?.includes(o)).map((o)=> (<option key={o} value={o}>{humanize(o)}</option>))}
        </select>
        <button className="h-10 px-3 rounded bg-gray-100" onClick={()=>onChange([])}>Clear</button>
      </div>
      <div className="mt-1 text-xs text-gray-600">Selected: {humanizeArray(value||[])}{!(value&&value.length) && "None"}</div>
      <div className="mt-1">
        <input className="w-full h-9 border rounded px-2 text-xs" placeholder="Or type comma-separated values" value={text} onChange={(e)=>setText(e.target.value)} onBlur={()=>{ const parts = text.split(',').map(s=>s.trim()).filter(Boolean); onChange(parts); }} />
      </div>
    </div>
  );
}

// --- Helpers to normalize profile for editing ---
const EDIT_ARRAY_FIELDS = new Set([
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

function editTryParseJson<T = any>(s: string): T | null { try { return JSON.parse(s); } catch { return null; } }

function editNormalizeArray(v: any): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') {
    const t = v.trim();
    const parsed = (t.startsWith('[') && t.endsWith(']')) ? editTryParseJson<string[]>(t) : null;
    if (parsed) return parsed.map(String);
    return t ? t.split(',').map(s=>s.trim()).filter(Boolean) : [];
  }
  return [];
}

function formatBioForEdit(raw: any): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const parsed = editTryParseJson<any>(raw);
    if (parsed != null) {
      if (typeof parsed === 'string') return parsed;
      if (Array.isArray(parsed)) return parsed.join(', ');
      if (typeof parsed === 'object') return Object.values(parsed).map(String).join(', ');
    }
    const cleaned = raw.replace(/^\s*[\[{"']+|[\]}"']+\s*$/g, '').replace(/"/g,'');
    return cleaned;
  }
  if (Array.isArray(raw)) return raw.map(String).join(', ');
  if (typeof raw === 'object') return Object.values(raw).map(String).join(', ');
  return String(raw);
}

function normalizeProfileForEdit(p: Record<string, any>) {
  const out: Record<string, any> = { ...p };
  for (const k of EDIT_ARRAY_FIELDS) {
    if (k in out) out[k] = editNormalizeArray(out[k]);
  }
  out.bio = formatBioForEdit(out.bio);
  return out;
}

// Humanize helpers
function humanize(v: any): string {
  const s = String(v ?? "");
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function humanizeArray(arr: any[]): string {
  if (!Array.isArray(arr) || arr.length === 0) return "None";
  return arr.map(humanize).join(', ');
}
