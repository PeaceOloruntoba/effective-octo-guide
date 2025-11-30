import { useEffect, useState } from "react";
import { useAdminSubsStore } from "../../store/useAdminSubsStore";
import { Spinner } from "../../components/Spinner";
import { toast } from "sonner";

export default function AdminSubscriptions() {
  const {
    loading,
    settings,
    overview,
    fetchSettings,
    saveSettings,
    startFounderWindow,
    stopFounderWindow,
    fetchOverview,
  } = useAdminSubsStore();
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
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Subscription Settings</h2>

      {loading && (
        <div className="flex items-center gap-2">
          <Spinner size={16} />
          <span>Loading...</span>
        </div>
      )}

      {settings && (
        <div className="rounded-lg border p-6 shadow-sm space-y-4 bg-white">
          {/* Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!local.is_active}
                onChange={(e) =>
                  setLocal({ ...local, is_active: e.target.checked })
                }
              />
              <span>Enable subscription gating</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!local.founder_discount_enabled}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    founder_discount_enabled: e.target.checked,
                  })
                }
              />
              <span>Enable founder discount</span>
            </label>
          </div>

          {/* Trial & Founder settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Trial days</span>
              <input
                className="h-10 rounded border px-3"
                type="number"
                value={local.trial_days ?? 7}
                onChange={(e) =>
                  setLocal({ ...local, trial_days: Number(e.target.value) })
                }
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Founder capacity</span>
              <input
                className="h-10 rounded border px-3"
                type="number"
                value={local.founder_capacity ?? 100}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    founder_capacity: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Founder discount %</span>
              <input
                className="h-10 rounded border px-3"
                type="number"
                value={local.founder_discount_pct ?? 50}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    founder_discount_pct: Number(e.target.value),
                  })
                }
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  Founder window starts at
                </span>
                <input
                  className="h-10 rounded border px-3"
                  type="date"
                  value={
                    local.founder_window_starts_at
                      ? local.founder_window_starts_at.slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      founder_window_starts_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  Founder window ends at
                </span>
                <input
                  className="h-10 rounded border px-3"
                  type="date"
                  value={
                    local.founder_window_ends_at
                      ? local.founder_window_ends_at.slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      founder_window_ends_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </label>
            </div>
          </div>

          {/* Plan Prices */}
          <h3 className="text-lg font-semibold mt-4">Plan Prices (NGN)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Monthly", "Quarterly", "Biannual", "Annual"].map((plan) => {
              const key =
                `price_${plan.toLowerCase()}_cents` as keyof typeof local;
              return (
                <label key={plan} className="grid gap-1">
                  <span className="text-sm font-medium">{plan}</span>
                  <input
                    className="h-10 rounded border px-3"
                    type="number"
                    min={0}
                    value={(local[key] ?? 0) / 100}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        [key]: Math.round(Number(e.target.value || 0) * 100),
                      })
                    }
                  />
                </label>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className="h-10 px-4 rounded bg-primary text-white hover:bg-primary/90 transition"
              onClick={onSave}
            >
              Save
            </button>
            <button
              className="h-10 px-4 rounded bg-green-700 text-white hover:bg-green-800 transition"
              onClick={async () => {
                await startFounderWindow();
                toast.success("Founder window started");
              }}
            >
              Start founder window
            </button>
            <button
              className="h-10 px-4 rounded bg-yellow-700 text-white hover:bg-yellow-800 transition"
              onClick={async () => {
                await stopFounderWindow();
                toast.success("Founder window stopped");
              }}
            >
              Stop founder window
            </button>
          </div>
        </div>
      )}

      {overview && (
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
            {JSON.stringify(overview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
