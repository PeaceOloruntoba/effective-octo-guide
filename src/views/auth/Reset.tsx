import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Spinner } from "../../components/Spinner";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Reset() {
  const { reset, loading, resetEmail } = useAuthStore();
  const [email, setEmail] = useState(resetEmail || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      await reset({ email, code, password });
      toast.success("Password updated. You can sign in now.");
      navigate("/login")
    } catch {}
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Reset password</h2>
        <div className="grid gap-3">
          <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Code" value={code} onChange={(e)=>setCode(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="New password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="h-10 rounded text-white disabled:opacity-60 flex items-center justify-center gap-2 bg-primary" disabled={loading} onClick={onSubmit}>
            {loading ? (<><Spinner size={16} color="#fff" /><span>Resetting...</span></>) : 'Reset password'}
          </button>
        </div>
      </div>
    </div>
  );
}
