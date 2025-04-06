"use client";

import React from "react";
import { useRouter } from "next/navigation";

// utils
import { API } from "@root/utils/API";

export default function Home() {
  const router = useRouter();

  const handleAuth = async () => {
    const res = await API.getMeetingEvents();

    if (res.loggedIn === false) {
      router.push("/login");
    } else {
      router.push("/class-program");
    }
  };

  React.useEffect(() => {
    handleAuth();
  }, []);
}
