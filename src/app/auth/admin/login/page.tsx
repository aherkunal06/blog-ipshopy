"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"credentials" | "otp">("credentials");
  
  // Credentials login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP login state
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Check if input is email or username
    const isEmail = username.includes("@");
    
    // Prepare credentials object
    const credentials: any = {
      password,
      redirect: false,
      callbackUrl: "/admin",
    };
    
    // Add either username or email based on input
    if (isEmail) {
      credentials.email = username;
    } else {
      credentials.username = username;
    }

    const res = await signIn("credentials", credentials);

    setLoading(false);
    if (res?.ok) router.push("/admin");
    else alert("Invalid credentials or not approved yet");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const response = await fetch("/api/auth/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        alert("OTP sent successfully to your mobile number");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure mobile is in correct format (10 digits)
      const cleanMobile = mobile.replace(/\D/g, '').slice(0, 10);
      
      if (cleanMobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number");
        setLoading(false);
        return;
      }

      if (otp.length !== 6) {
        alert("Please enter a valid 6-digit OTP");
        setLoading(false);
        return;
      }

      console.log('Attempting OTP login:', { mobile: cleanMobile, otp });

      // First verify OTP
      const verifyResponse = await fetch('/api/auth/admin/otp-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: cleanMobile, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success || !verifyData.admin) {
        console.error('OTP verification failed:', verifyData);
        alert(verifyData.message || "Invalid OTP or OTP expired. Please try again.");
        return;
      }

      // OTP verified successfully, now login with NextAuth
      // Call the admin NextAuth callback endpoint directly
      const formData = new URLSearchParams();
      formData.append('username', verifyData.admin.username);
      formData.append('otpToken', JSON.stringify({ mobile: cleanMobile, otp, verified: true }));
      formData.append('redirect', 'false');
      formData.append('json', 'true');
      formData.append('callbackUrl', '/admin');

      const authResponse = await fetch('/api/auth/admin/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include',
      });

      console.log('NextAuth callback response status:', authResponse.status);
      console.log('NextAuth callback response headers:', Object.fromEntries(authResponse.headers.entries()));

      if (authResponse.ok) {
        // Check response type
        const contentType = authResponse.headers.get('content-type');
        console.log('Response content-type:', contentType);
        
        if (contentType?.includes('application/json')) {
          const authData = await authResponse.json();
          console.log('NextAuth JSON response:', authData);
          // NextAuth returns { url: '/admin' } on success
          if (authData.url) {
            window.location.href = authData.url;
          } else if (!authData.error) {
            // No error means success, redirect manually
            window.location.href = '/admin';
          } else {
            console.error('NextAuth error:', authData.error);
            alert("Session creation failed: " + (authData.error || "Unknown error"));
          }
        } else {
          // HTML response or redirect - just redirect
          console.log('Non-JSON response, redirecting...');
          window.location.href = '/admin';
        }
      } else {
        const errorText = await authResponse.text();
        console.error('NextAuth callback failed:', errorText);
        alert("OTP verified but session creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border-2 border-black rounded-xl max-w-md w-full p-6 flex flex-col gap-4 text-gray-900">
        <h1 className="text-2xl font-bold text-center text-gray-900">Admin Log In</h1>

        {/* Login Method Tabs */}
        <div className="flex gap-2 border-b border-gray-300">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("credentials");
              setOtpSent(false);
              setOtp("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              loginMethod === "credentials"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Credentials
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("otp");
              setOtpSent(false);
              setOtp("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              loginMethod === "otp"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mobile OTP
          </button>
        </div>

        {/* Credentials Login Form */}
        {loginMethod === "credentials" && (
          <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500"
            />

            <div className="flex justify-between items-center text-gray-900">
              <label className="flex items-center gap-1">
                <input type="checkbox" defaultChecked className="w-4 h-4" /> Remember me
              </label>
              <span
                className="text-purple-600 cursor-pointer hover:underline text-sm"
                onClick={() => router.push("/auth/admin/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* OTP Login Form */}
        {loginMethod === "otp" && (
          <form onSubmit={otpSent ? handleOTPLogin : handleSendOTP} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                disabled={otpSent}
                className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Enter your registered mobile number</p>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  OTP sent to +91{mobile}. Didn't receive?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-purple-600 hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={otpLoading || loading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading
                ? "Sending OTP..."
                : loading
                ? "Verifying..."
                : otpSent
                ? "Verify & Login"
                : "Send OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
