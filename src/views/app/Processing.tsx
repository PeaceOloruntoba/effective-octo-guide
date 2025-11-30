import { useEffect, useRef, useState } from "react";
import { useBillingStore } from "../../store/useBillingStore";
import { Spinner } from "../../components/Spinner";
import { useNavigate, useSearchParams } from "react-router";

export default function Processing() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const refFromQuery = params.get("reference") || undefined;
  const { fetchStatus, status } = useBillingStore();
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fetchStatus().catch(() => {});
    timerRef.current = window.setInterval(async () => {
      setTries((t) => t + 1);
      try { await fetchStatus(); } catch {}
    }, 4000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!status) return;
    if (status.status === 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
      setTimeout(() => nav('/app/billing', { replace: true }), 1200);
    }
    if (tries > 45 && !done) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
    }
  }, [status, tries]);

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 border border-gray-100 text-center">
        <h1 className="text-2xl font-bold mb-3">Processing Payment</h1>
        
        {refFromQuery && (
          <div className="text-sm text-gray-500 mb-4 break-all">
            Reference: <span className="font-medium">{refFromQuery}</span>
          </div>
        )}

        {!done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Spinner size={24} />
            <span className="text-gray-600">Waiting for confirmation...</span>
          </div>
        ) : (
          <div className="py-6">
            {status?.status === 'active' ? (
              <div className="text-green-700 font-semibold text-lg">Payment confirmed. Redirecting…</div>
            ) : (
              <div className="text-amber-700 font-medium">
                We couldn't confirm the payment yet. <br />
                You can refresh this page or check your Billing page.
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            className="h-10 px-5 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            onClick={() => nav('/app/billing', { replace: true })}
          >
            Go to Billing
          </button>
        </div>
      </div>
    </div>
  );
}
