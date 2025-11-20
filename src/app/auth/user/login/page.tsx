"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      type: "user",
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.ok) router.push("/");
    else {
      console.log(res);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow-lg"
      >
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Sign In
        </h2>

        {/* Email */}
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-indigo-600 hover:underline"
            onClick={() => router.push("/auth/user/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition"
        >
          Sign In
        </button>

        {/* Create account */}
  <div className="mt-4 text-center text-sm text-gray-700">
  Don&apos;t have an account?{" "}
  <button
    type="button"
    onClick={() => router.push("/auth/user/register")}
    className="font-medium text-indigo-600 hover:underline"
  >
    Create account
  </button>
</div>

      </form>
    </div>
  );
}
