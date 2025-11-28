import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

export default function Signup() {
  const nav = useNavigate();
  const { register, verifyOtp } = useAuthStore();
  const [step, setStep] = useState<"form"|"verify">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const onRegister = async () => {
    try {
      const res = await register({ email, password, name });
      toast.success("Registered. Verify OTP sent to email.");
      setStep("verify");
      if (res?.otp) toast.info(`OTP: ${res.otp}`);
    } catch {}
  };

  const onVerify = async () => {
    try {
      await verifyOtp({ email, code });
      toast.success("Account verified. You can sign in now.");
      nav("/login");
    } catch {}
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        {step==="form" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Create account</h2>
            <div className="grid gap-3">
              <input className="h-10 rounded border px-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input className="h-10 rounded border px-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <button className="h-10 rounded text-white" style={{background:'#1f444c'}} onClick={onRegister}>Sign up</button>
              <div className="text-sm"><Link to="/login">Already have an account?</Link></div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Verify email</h2>
            <div className="grid gap-3">
              <input className="h-10 rounded border px-3" placeholder="Code" value={code} onChange={(e)=>setCode(e.target.value)} />
              <button className="h-10 rounded text-white" style={{background:'#1f444c'}} onClick={onVerify}>Verify</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
