"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { API } from "@root/utils/API";
import { OrbitProgress } from "react-loading-indicators";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const handleAuth = async () => {
    try {
      const res = await API.handleAuth();
      if (res.loggedIn) {
        router.push("/class-program");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Lütfen email ve şifre giriniz", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const authStatus = await API.login(email, password);

      if (authStatus === "success") {
        showToast("Giriş başarılı! Yönlendiriliyorsunuz...", "success");
        router.push("/class-program");
      } else {
        showToast("Yanlış email veya şifre", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Giriş sırasında bir hata oluştu", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    toast[type](message, {
      theme: "light",
      autoClose: 3000,
      draggable: true,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      hideProgressBar: false,
      position: "bottom-center",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (isAuthenticating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <OrbitProgress size="small" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Giriş Yap</h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Adresi
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="mail@example.com"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-primary/70" : "bg-primary hover:bg-primary-dark"
            } transition-colors`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <OrbitProgress size="small" color="white" />
              </span>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
