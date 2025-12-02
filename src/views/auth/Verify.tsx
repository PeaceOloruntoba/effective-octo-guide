import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Spinner } from "../../components/Spinner";

export default function Verify() {
  const nav = useNavigate();
  const { verifyEmail, verifyOtp, resendOtp, loading } = useAuthStore();
  const [email, setEmail] = useState(verifyEmail || "");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (verifyEmail && !email) setEmail(verifyEmail);
  }, [verifyEmail]);

  const onVerify = async () => {
    if (!email || !code) return toast.error("Enter email and code");
    try {
      await verifyOtp({ email, code });
      toast.success("Account verified. You can sign in now.");
      nav("/login");
    } catch {}
  };

  const onResend = async () => {
    if (!email) return toast.error("Enter your email");
    try {
      await resendOtp({ email, purpose: 'verify' });
      useAuthStore.getState().setVerifyEmail(email);
      toast.success("Verification code sent");
    } catch {}
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Verify email</h2>
        <div className="grid gap-3">
          <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Code" value={code} onChange={(e)=>setCode(e.target.value)} />
          <button className="h-10 rounded text-white disabled:opacity-60 flex items-center justify-center gap-2 bg-primary" disabled={loading} onClick={onVerify}>
            {loading ? (<><Spinner size={16} color="#fff" /><span>Verifying...</span></>) : 'Verify'}
          </button>
          <button className="h-10 rounded border flex items-center justify-center" disabled={loading} onClick={onResend}>Resend code</button>
          <div className="text-sm text-center">Wrong email? <Link to="/signup" className="underline">Create account</Link> or <Link to="/login" className="underline">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}
