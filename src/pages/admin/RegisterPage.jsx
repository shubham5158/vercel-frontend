import React, { useState } from "react";
import { useAuth } from "../../context/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      toastSuccess("Account created successfully!");
      navigate("/admin/login"); // or login page
    } catch (err) {
      toastError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://assets.nflxext.com/ffe/siteui/vlv3/cf5da46c-50dd-49c3-ae9d-70b4a1c2b74e/0f6ec698-c92a-49a5-b88d-0a87b2455569/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_small.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative bg-black/60 border border-slate-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2">Create Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full mt-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              className="w-full mt-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-slate-400"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-amber-400 text-black font-semibold rounded-md hover:bg-amber-300 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-slate-400">
          Already have an account?{" "}
          <span
            className="text-amber-300 underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
