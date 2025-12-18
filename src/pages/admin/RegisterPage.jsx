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
      const res = await register(form.name, form.email, form.password);
      toastSuccess(res.message || "OTP Sent Successfully!");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toastError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen md:flex">
      {/* LEFT SIDE DESIGN */}
      <div className="relative overflow-hidden md:flex w-1/2 bg-linear-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Hemant Gogawale Photostudio
          </h1>
          <p className="text-white mt-1">
            Secure registration with OTP verification
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white w-80" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            Create Account
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7">
            Register & verify via OTP
          </p>

          {/* FULL NAME */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <input
              className="pl-2 outline-none border-none w-full"
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 relative">
            <input
              className="pl-2 outline-none border-none w-full"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold"
          >
            Register
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm mt-4 text-gray-600 text-center">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
