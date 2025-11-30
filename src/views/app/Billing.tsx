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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>

      {loading && (
        <div className="flex items-center gap-2"><Spinner size={16} /><span>Loading...</span></div>
      )}

      {status && (
        <div className="mb-6 border rounded p-4">
          <div className="font-semibold">Status: <span className="uppercase">{status.status}</span></div>
          {status.plan ? (<div>Plan: {status.plan}</div>) : null}
          {status.trial_end ? (<div>Trial ends: {new Date(status.trial_end).toLocaleString()}</div>) : null}
          {status.current_period_end ? (<div>Renews until: {new Date(status.current_period_end).toLocaleString()}</div>) : null}
          {(status.status === 'active' || status.status === 'trialing') && (
            <button className="mt-3 h-10 px-3 rounded bg-red-600 text-white" onClick={() => cancel().then(()=>toast.success("Auto-renew cancelled"))}>Cancel auto-renew</button>
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Plans</h2>
      <div className="grid gap-3">
        {plans?.map((p) => (
          <div key={p.plan} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold capitalize">{p.display || p.plan}</div>
              <div className="text-sm">
                {p.discounted && p.discounted_price_cents !== undefined ? (
                  <>
                    <span className="line-through mr-2">₦{(p.price_cents/100).toLocaleString()}</span>
                    <span className="font-bold">₦{((p.discounted_price_cents||0)/100).toLocaleString()}</span>
                  </>
                ) : (
                  <span className="font-bold">₦{(p.price_cents/100).toLocaleString()}</span>
                )}
              </div>
            </div>
            <button className="h-10 px-4 rounded bg-primary text-white" onClick={() => checkout(p.plan)}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
}
