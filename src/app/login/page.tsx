"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { API } from "@root/utils/API";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await API.login(username, password);

      if (response.success) {
        router.push("/class-program");
      }

      console.log(response);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[86vh] md:min-h-[100vh] bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* University Image - responsive */}
        <div className="relative h-48 md:h-60 w-full">
          <Image
            priority
            fill
            alt="login-banner"
            className="object-cover"
            src={"/images/login-banner.jpg"}
          />
        </div>

        {/* Form Content - responsive padding */}
        <div className="p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-lg md:text-xl text-[#878787] mb-2">
              Sınıf Takvim Portalı
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Giriş</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Kullanıcı kodu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş yap"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
