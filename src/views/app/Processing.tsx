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
    // Kick off first fetch
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
      // redirect back to billing after a short pause
      setTimeout(() => nav('/app/billing', { replace: true }), 1200);
    }
    if (tries > 45 && !done) {
      // ~3 minutes timeout
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
    }
  }, [status, tries]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Processing payment</h1>
      {refFromQuery ? (
        <div className="text-sm text-gray-600 mb-4">Reference: {refFromQuery}</div>
      ) : null}
      {!done ? (
        <div className="flex items-center gap-2"><Spinner size={16} /><span>Waiting for confirmation...</span></div>
      ) : (
        status?.status === 'active' ? (
          <div className="text-green-700 font-semibold">Payment confirmed. Redirecting…</div>
        ) : (
          <div className="text-amber-700">
            We couldn't confirm the payment yet. You can refresh this page or check your Billing page.
          </div>
        )
      )}
      <div className="mt-6 flex gap-3">
        <button className="h-10 px-4 rounded bg-primary text-white" onClick={() => nav('/app/billing', { replace: true })}>Go to Billing</button>
      </div>
    </div>
  );
}
