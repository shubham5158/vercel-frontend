import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toastSuccess("Login successful!");
      navigate("/admin");
    } catch (err) {
      toastError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login card */}
      <div className="relative bg-black/60 border border-slate-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-slate-300 mb-6">
          Sign in to manage events and client galleries.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-slate-300">Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-slate-400"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-amber-400 text-black rounded-md font-semibold hover:bg-amber-300 transition"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm mt-4 text-slate-400 text-center">
          Don’t have an account?{" "}
          <span
            className="text-amber-300 underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
