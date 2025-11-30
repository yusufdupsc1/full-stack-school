"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string>("admin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddRole = async () => {
    if (!user?.id) {
      setError("You must be signed in first");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Success! Role "${role}" has been added to your account. Refresh the page to access the dashboard.`
        );
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setError(`❌ Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lamaSkyLight">
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in first at /sign-in to set up your account
          </p>
          <a
            href="/sign-in"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lamaSkyLight flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          🎓 Dashboard Setup
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Add a role to your Clerk account to access the dashboard
        </p>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Signed in as:
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="font-mono text-sm text-gray-900">
              {user.emailAddresses[0]?.emailAddress || user.username}
            </p>
            <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Your Role:
          </label>
          <div className="space-y-2">
            {[
              { value: "admin", label: "👨‍💼 Admin", desc: "Full system access" },
              {
                value: "teacher",
                label: "👨‍🏫 Teacher",
                desc: "Manage classes and grades",
              },
              {
                value: "student",
                label: "👨‍🎓 Student",
                desc: "View assignments and results",
              },
              {
                value: "parent",
                label: "👨‍👩‍👧 Parent",
                desc: "Track student progress",
              },
            ].map((roleOption) => (
              <label
                key={roleOption.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition"
              >
                <input
                  type="radio"
                  name="role"
                  value={roleOption.value}
                  checked={role === roleOption.value}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">
                    {roleOption.label}
                  </p>
                  <p className="text-xs text-gray-500">{roleOption.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={handleAddRole}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Setting up..." : "✨ Add Role & Access Dashboard"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          After adding your role, you may need to refresh the page or sign out
          and back in.
        </p>
      </div>
    </div>
  );
}
