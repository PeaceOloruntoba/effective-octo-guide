import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Spinner } from "../../components/Spinner";
import { toast } from "sonner";

export default function Forgot() {
  const { forgot, loading } = useAuthStore();
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      await forgot({ email });
      toast.success("A reset code has been sent to your email.");
    } catch {}
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Forgot password?</h2>
        <div className="grid gap-3">
          <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button className="h-10 rounded text-white disabled:opacity-60 flex items-center justify-center gap-2 bg-primary" disabled={loading} onClick={onSubmit}>
            {loading ? (<><Spinner size={16} color="#fff" /><span>Sending...</span></>) : 'Send code'}
          </button>
        </div>
      </div>
    </div>
  );
}
