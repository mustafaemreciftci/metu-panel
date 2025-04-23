"use client";

import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// utils
import { API } from "@root/utils/API";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="gap-[12px] h-[100vh] flex flex-col items-center justify-center">
      <input
        type="text"
        value={email}
        placeholder="Mail adresi"
        className="input focus:outline-0"
        onChange={(value) => setEmail(value.target.value)}
      />

      <input
        type="password"
        value={password}
        placeholder="Şifre"
        className="input focus:outline-0"
        onChange={(value) => setPassword(value.target.value)}
      />

      <button
        onClick={async () => {
          const authStatus = await API.login(email, password);

          if (authStatus === "invalid") {
            toast.info("Yanlış email veya şifre.", {
              theme: "light",
              autoClose: 3000,
              draggable: true,
              closeOnClick: true,
              pauseOnHover: true,
              progress: undefined,
              hideProgressBar: false,
              position: "bottom-center",
            });
          } else if (authStatus === "success") {
            router.push("/class-program");
          }
        }}
        className="btn btn-wide btn-primary mt-8"
      >
        Giriş Yap
      </button>
    </div>
  );
}
