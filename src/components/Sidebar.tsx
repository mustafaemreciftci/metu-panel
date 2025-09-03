"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// utils
import { API } from "@root/utils/API";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuth = async () => {
    const res = await API.handleAuth();

    if (res.loggedIn !== false) {
      setRole(res.role);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  const navigationItems = [
    ...(role === "admin"
      ? [
          {
            href: "/program-config",
            label: "Veriler",
            icon: "/nav/veriler.png",
            isActive: pathname === "/program-config",
          },
        ]
      : []),
    {
      href: "/class-schedule",
      label: "Sınıf Takvimi",
      icon: "/nav/sinif-takvimi.png",
      isActive: pathname === "/class-schedule",
    },
    {
      href: "/class-program",
      label: "Sınıf Programı",
      icon: "/nav/sinif-programi.png",
      isActive: pathname === "/class-program",
    },
    {
      href: "/room-program",
      label: "Toplantı Programı",
      icon: "/nav/toplanti-programi.png",
      isActive: pathname === "/room-program",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#212020] text-white p-2 rounded-md shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-[#212020] shadow-lg z-50 transition-transform duration-300 ease-in-out
        w-64 md:w-[12vw] 
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
        flex flex-col items-center md:items-baseline justify-between 
        px-4 md:pl-12 py-6 md:pt-16 md:pb-16
      `}
      >
        {/* Logo */}
        <div className="flex justify-center md:justify-start w-full mb-8 md:mb-0">
          <Image priority alt="logo" width={132} height={132} src="/logo.png" />
        </div>

        {/* Navigation */}
        <div className="flex h-full flex-col justify-center items-center md:items-baseline gap-6 md:gap-12 w-full">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                w-full h-12 md:h-12 flex items-center justify-center md:justify-start 
                px-3 md:px-3 rounded-lg text-sm md:text-base font-bold text-center md:text-left
                transition-all duration-200
                ${
                  item.isActive
                    ? "bg-[#373636] text-white"
                    : "bg-transparent text-[#878787] hover:bg-[#373636] hover:text-white"
                }
              `}
            >
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <Image
                  priority
                  alt={item.label}
                  width={40}
                  height={40}
                  className="w-6 h-6 md:w-10 md:h-10"
                  src={item.icon}
                />
                <span className="text-xs md:text-base leading-tight">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          className="text-[#878787] font-bold text-sm md:text-base hover:text-white transition-colors duration-200 mt-8 md:mt-0"
          onClick={async () => {
            API.logout();
            router.replace("/login");
            setIsMobileMenuOpen(false);
          }}
        >
          Çıkış Yap
        </button>
      </div>

      {/* Content Spacer for Desktop */}
      <div className="hidden md:block w-[12vw]" />
    </>
  );
}
