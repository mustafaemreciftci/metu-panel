"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// utils
import { API } from "@root/utils/API";

// <ToastContainer />

export default function Header() {
  const router = useRouter();

  const [role, setRole] = useState("");

  const handleAuth = async () => {
    const res = await API.handleAuth();

    if (res.loggedIn !== false) {
      setRole(res.role);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div className="h-[12vh] w-full flex flex-row items-center justify-between shadow-sm">
      <Image
        priority
        alt="logo"
        width={60}
        height={60}
        className="w-auto h-auto ml-[3%]"
        src={"/logo.png"}
      />

      <div className="w-[40vw] flex mr-[2vw] flex-row justify-around">
        {role === "admin" && (
          <Link
            style={{
              color: "#404041",
              fontWeight: "bold",
              textDecoration: "none",
            }}
            href={"/program-config"}
          >
            Veriler
          </Link>
        )}

        <Link
          style={{
            color: "#404041",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          href={"/class-schedule"}
        >
          Sınıf Takvimi
        </Link>

        <Link
          style={{
            color: "#404041",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          href={"/class-program"}
        >
          Sınıf Programı
        </Link>

        <Link
          style={{
            color: "#404041",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          href={"/room-program"}
        >
          Toplantı Programı
        </Link>

        <button
          style={{
            color: "#404041",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          onClick={async () => {
            API.logout();

            router.replace("/login");
          }}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
