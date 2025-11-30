import { useEffect, useRef } from "react";
import { useBillingStore } from "../../store/useBillingStore";
import { Spinner } from "../../components/Spinner";
import { toast } from "sonner";

export default function Billing() {
  const { loading, status, plans, fetchStatus, fetchPlans, checkout, cancel } = useBillingStore();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchStatus().catch(() => {});
    fetchPlans().catch(() => {});
    const reason = localStorage.getItem("paywall_reason");
    if (reason) {
      toast.info(reason);
      localStorage.removeItem("paywall_reason");
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Subscription Plans</h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <Spinner size={16} /> Loading...
        </div>
      )}

      {/* Current Status */}
      {status && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 shadow-md shadow-green-300 hover:shadow-green-400 transition duration-300">
          <div className="font-semibold text-gray-700 mb-1">
            Status: <span className="uppercase text-primary">{status.status}</span>
          </div>
          {status.plan && <div className="text-gray-600">Plan: {status.plan}</div>}
          {status.trial_end && (
            <div className="text-gray-600">Trial ends: {new Date(status.trial_end).toLocaleString()}</div>
          )}
          {status.current_period_end && (
            <div className="text-gray-600">
              Renews until: {new Date(status.current_period_end).toLocaleString()}
            </div>
          )}
          {(status.status === "active" || status.status === "trialing") && (
            <button
              className="mt-3 h-10 px-4 rounded bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => cancel().then(() => toast.success("Auto-renew cancelled"))}
            >
              Cancel auto-renew
            </button>
          )}
        </div>
      )}

      {/* Available Plans */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">Available Plans</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {plans?.map((p) => (
          <div
            key={p.plan}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800 capitalize mb-1">{p.display || p.plan}</div>
              <div className="text-gray-600 text-sm">
                {p.discounted && p.discounted_price_cents !== undefined ? (
                  <>
                    <span className="line-through mr-2">₦{(p.price_cents / 100).toLocaleString()}</span>
                    <span className="font-bold text-primary">
                      ₦{(p.discounted_price_cents / 100).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-gray-800">₦{(p.price_cents / 100).toLocaleString()}</span>
                )}
              </div>
            </div>
            <button
              className="h-10 w-full sm:w-auto px-4 rounded-md bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
              onClick={() => checkout(p.plan)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
