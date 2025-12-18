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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">

          {/* HEADER */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>
                We have sent a code to{" "}
                <span className="font-semibold">
                  {email || "your email"}
                </span>
              </p>
            </div>
          </div>

          {/* OTP INPUTS */}
          <div>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-14 h-14">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) return;
                        const arr = otp.split("");
                        arr[i] = val;
                        setOtp(arr.join("").slice(0, 6));
                      }}
                      className="w-full h-full text-center text-lg outline-none rounded-xl border border-gray-200 bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    />
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col space-y-5">
                <button
                  onClick={handleVerify}
                  className="flex flex-row items-center justify-center text-center w-full rounded-xl outline-none py-5 bg-blue-700 text-white text-sm shadow-sm"
                >
                  Verify Account
                </button>

                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                  <p>Didn't receive code?</p>
                  <span className="text-blue-600 cursor-pointer">
                    Resend
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
