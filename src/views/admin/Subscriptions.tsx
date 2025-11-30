import { useEffect, useState } from "react";
import { useAdminSubsStore } from "../../store/useAdminSubsStore";
import { Spinner } from "../../components/Spinner";
import { toast } from "sonner";

export default function AdminSubscriptions() {
  const { loading, settings, overview, fetchSettings, saveSettings, startFounderWindow, stopFounderWindow, fetchOverview } = useAdminSubsStore();
  const [local, setLocal] = useState<any>({});

  useEffect(() => {
    fetchSettings().catch(() => {});
    fetchOverview().catch(() => {});
  }, []);

  useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  const onSave = async () => {
    try {
      await saveSettings(local);
      toast.success("Settings saved");
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Subscription Settings</h2>

      {loading && (
        <div className="flex items-center gap-2"><Spinner size={16} /><span>Loading...</span></div>
      )}

      {settings && (
        <div className="rounded border p-4 mb-6 grid gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!local.is_active} onChange={(e)=>setLocal({ ...local, is_active: e.target.checked })} />
            <span>Enable subscription gating</span>
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Trial days</span>
            <input className="h-10 rounded border px-3" type="number" value={local.trial_days ?? 7} onChange={(e)=>setLocal({ ...local, trial_days: Number(e.target.value) })} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!local.founder_discount_enabled} onChange={(e)=>setLocal({ ...local, founder_discount_enabled: e.target.checked })} />
            <span>Enable founder discount</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Founder window starts at</span>
              <input className="h-10 rounded border px-3" type="datetime-local" value={local.founder_window_starts_at ? local.founder_window_starts_at.slice(0,16) : ''} onChange={(e)=>setLocal({ ...local, founder_window_starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Founder window ends at</span>
              <input className="h-10 rounded border px-3" type="datetime-local" value={local.founder_window_ends_at ? local.founder_window_ends_at.slice(0,16) : ''} onChange={(e)=>setLocal({ ...local, founder_window_ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Founder capacity</span>
              <input className="h-10 rounded border px-3" type="number" value={local.founder_capacity ?? 100} onChange={(e)=>setLocal({ ...local, founder_capacity: Number(e.target.value) })} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Founder discount %</span>
              <input className="h-10 rounded border px-3" type="number" value={local.founder_discount_pct ?? 50} onChange={(e)=>setLocal({ ...local, founder_discount_pct: Number(e.target.value) })} />
            </label>
          </div>

          <h3 className="text-lg font-semibold mt-2">Plan Prices (NGN)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Monthly</span>
              <input className="h-10 rounded border px-3" type="number" min={0}
                value={((local.price_monthly_cents ?? 0) / 100)}
                onChange={(e)=>setLocal({ ...local, price_monthly_cents: Math.round(Number(e.target.value || 0) * 100) })}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Quarterly</span>
              <input className="h-10 rounded border px-3" type="number" min={0}
                value={((local.price_quarterly_cents ?? 0) / 100)}
                onChange={(e)=>setLocal({ ...local, price_quarterly_cents: Math.round(Number(e.target.value || 0) * 100) })}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Biannual</span>
              <input className="h-10 rounded border px-3" type="number" min={0}
                value={((local.price_biannual_cents ?? 0) / 100)}
                onChange={(e)=>setLocal({ ...local, price_biannual_cents: Math.round(Number(e.target.value || 0) * 100) })}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Annual</span>
              <input className="h-10 rounded border px-3" type="number" min={0}
                value={((local.price_annual_cents ?? 0) / 100)}
                onChange={(e)=>setLocal({ ...local, price_annual_cents: Math.round(Number(e.target.value || 0) * 100) })}
              />
            </label>
          </div>

          <div className="flex gap-3 mt-2">
            <button className="h-10 px-4 rounded bg-primary text-white" onClick={onSave}>Save</button>
            <button className="h-10 px-4 rounded bg-green-700 text-white" onClick={async()=>{ await startFounderWindow(); toast.success('Founder window started'); }}>Start founder window</button>
            <button className="h-10 px-4 rounded bg-yellow-700 text-white" onClick={async()=>{ await stopFounderWindow(); toast.success('Founder window stopped'); }}>Stop founder window</button>
          </div>
        </div>
      )}

      {overview && (
        <div className="rounded border p-4">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(overview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
