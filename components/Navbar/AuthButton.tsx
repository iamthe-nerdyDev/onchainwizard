"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import {
  IconMessage,
  IconAddressBook,
  IconSettings,
  IconPower,
} from "@tabler/icons-react";
import Link from "next/link";

const menuItems = [
  {
    label: "Go to chat",
    path: "/chat",
    icon: <IconMessage strokeWidth={1.7} />,
  },
  {
    label: "My contacts",
    path: "/contacts",
    icon: <IconAddressBook strokeWidth={1.7} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <IconSettings strokeWidth={1.7} />,
  },
];

const Main = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center focus:outline-none"
      >
        <img
          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${session.data?.user.id}`}
          alt={session.data?.user.name || "user"}
          width={35}
          height={35}
          className="rounded-full bg-gray-100"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start py-3"
            >
              <Link className="w-full flex items-center gap-3" href={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
          <hr />

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={handleLogout}
          >
            <IconPower strokeWidth={1.7} />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const AuthButton = () => {
  return (
    <SessionProvider>
      <Main />
    </SessionProvider>
  );
};

export default AuthButton;
