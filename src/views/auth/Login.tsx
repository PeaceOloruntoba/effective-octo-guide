import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Spinner } from "../../components/Spinner";

export default function Login() {
  const nav = useNavigate();
  const { login, error, clearError, token, hydrated, bootstrap, loading, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { if (!hydrated) bootstrap(); }, [hydrated]);
  useEffect(() => {
    if (token && hydrated) {
      console.log(user)
      if (user?.role === 'admin') nav('/admin/dashboard', { replace: true });
      else nav("/app/dashboard", { replace: true });
    }
  }, [token, hydrated, user?.role]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <div className="grid gap-3">
          <input className="h-10 rounded border px-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="h-10 rounded border px-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="h-10 rounded text-white disabled:opacity-60 flex items-center justify-center gap-2 bg-primary" disabled={loading} onClick={async()=>{ clearError(); await login({email,password}).catch(()=>{}); }}>
            {loading ? (<><Spinner size={16} color="#fff" /><span>Signing in...</span></>) : 'Sign in'}
          </button>
          <div className="flex justify-between text-sm">
            <Link to="/signup">Create account</Link>
            <Link to="/forgot">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
