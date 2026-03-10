/**
 * LoginPage component.
 * Provides email/password login form with validation and error handling.
 */
import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validators";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const validation = validateLoginForm({ email, password });
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      // Error is set in the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ContractVault</h1>
          <p className="mt-2 text-sm text-gray-600">
            Contract Lifecycle Management System
          </p>
        </div>

        {/* Form */}
        <form
          className="bg-white shadow-md rounded-lg px-8 py-10 space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
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
              className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="you@company.com"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
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
              className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
