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
    <div className="gap-[12px] h-full flex items-center flex-col justify-center">
      <input
        className="w-[14%] h-[30px] border-none text-center border-b-[1px] border-b-solid border-b-black"
        value={email}
        onChange={(value) => setEmail(value.target.value)}
        placeholder="Mail adresi"
      />

      <input
        className="w-[14%] h-[30px] border-none text-center border-b-[1px] border-b-solid border-b-black"
        type="password"
        value={password}
        onChange={(value) => setPassword(value.target.value)}
        placeholder="Şifre"
      />

      <button
        className="w-[10%] border-none h-[40px] flex mt-[40px] rounded-[8px] items-center justify-center bg-[#c00000]"
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
      >
        <h3>Giriş Yap</h3>
      </button>

      <h3 style={{ position: "absolute", bottom: 20 }}>
        Mustafa Emre Çiftçi tarafından ODTÜ EEMB için hazırlanmıştır.
      </h3>
    </div>
  );
}
