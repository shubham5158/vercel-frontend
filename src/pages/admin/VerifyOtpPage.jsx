import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../../api/Auth.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState("");

 const handleVerify = async () => {
  try {
    if (!otp || otp.length !== 6) {
      toastError("Enter 6 digit OTP");
      return;
    }

    await verifyOtpApi(email, String(otp).trim());

    toastSuccess("Email verified successfully!");
    navigate("/admin/login");
  } catch (err) {
    toastError(
      err?.response?.data?.message || "Invalid or expired OTP"
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-black/70 p-6 rounded-xl w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-3">Verify OTP</h1>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full px-3 py-2 mb-3 bg-slate-900 border border-slate-700 rounded"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-amber-400 text-black py-2 rounded font-semibold"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
