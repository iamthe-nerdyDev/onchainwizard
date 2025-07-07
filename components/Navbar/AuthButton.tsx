"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import {
  IconMessage,
  IconAddressBook,
  IconPower,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

const menuItems = [
  {
    label: "Go to chat",
    path: "/chat",
    icon: <IconMessage strokeWidth={1.8} size={21} />,
  },
  {
    label: "My contacts",
    path: "/contacts",
    icon: <IconAddressBook strokeWidth={1.8} size={21} />,
  },
];

const Main = ({ userId }: { userId: number }) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const dialogRef = useRef<HTMLDivElement>(null);

  const userData = {
    id: userId,
    name: session?.user?.name || `User #${userId}`,
    email: session?.user?.email!,
    avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${userId}`,
  };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
      >
        <img
          src={userData.avatar}
          alt={userData.name}
          width={35}
          height={35}
          className="rounded-full bg-gray-100 border-2 border-gray-200"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <IconX size={20} />
              </button>

              <div className="flex items-center space-x-4">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-blue-100 font-mono font-semibold">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      size={"lg"}
                      variant="ghost"
                      className="w-full justify-start py-5 px-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <div className="text-left">
                          <p className="font-medium">{item.label}</p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-6 pt-0">
              <Button
                size={"lg"}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 py-5"
                onClick={handleLogout}
              >
                <div className="flex items-center space-x-3">
                  <IconPower strokeWidth={1.8} size={21} />
                  <div className="text-left">
                    <p className="font-medium">Logout</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AuthButton = ({ userId }: { userId: number }) => {
  return (
    <SessionProvider>
      <Main userId={userId} />
    </SessionProvider>
  );
};

export default AuthButton;
