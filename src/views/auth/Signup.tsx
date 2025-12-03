import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Spinner } from "../../components/Spinner";

export default function Signup() {
  const nav = useNavigate();
  const { register } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [registering, setRegistering] = useState(false);

  const onRegister = async () => {
    setRegistering(true);
    try {
      const res = await register({ email, password, first_name, last_name });
      toast.success("Registered. Verify OTP sent to email.");
      if (res?.otp) toast.info(`OTP: ${res.otp}`);
      useAuthStore.getState().setVerifyEmail(email);
      nav('/verify-otp');
    } catch {}
    finally { setRegistering(false); }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
        <div className="grid gap-3">
          <input className="h-10 rounded border px-3" placeholder="First Name" value={first_name} onChange={(e)=>setFirstName(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Last Name" value={last_name} onChange={(e)=>setLastName(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="h-10 rounded text-white disabled:opacity-60 flex items-center justify-center gap-2 bg-primary" disabled={registering} onClick={onRegister}>
            {registering ? (<><Spinner size={16} color="#fff" /><span>Signing up...</span></>) : 'Sign up'}
          </button>
          <div className="text-sm"><Link to="/login">Already have an account?</Link></div>
        </div>
      </div>
    </div>
  );
}
