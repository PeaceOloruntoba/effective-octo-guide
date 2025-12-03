import { Outlet, Link } from "react-router";
import { logo } from "../assets";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-primary text-white items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold">
            <img src={logo} alt="Bunzi" className="h-8 w-8" />
            <span>Bunzi</span>
          </Link>
          <p className="text-white/90">Smarter meal planning for busy people. Curated Nigerian recipes, nutrition, and shopping—personalized to your taste.</p>
          <ul className="text-left space-y-2 text-white/90">
            <li>• Plan meals fast with smart suggestions</li>
            <li>• Track macros automatically</li>
            <li>• Generate shopping lists in one click</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <img src={logo} alt="Bunzi" className="h-6 w-6" />
            <span className="font-bold text-xl">Bunzi</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
