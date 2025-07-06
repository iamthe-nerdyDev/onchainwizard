"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import OtpInput from "react-otp-input";
import useForm from "@/hooks/useForm";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const numInputs = 5;
  const router = useRouter();
  const [ttl, setTTL] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const { isLoading, onChange, values, setValues, onSubmit } = useForm(fn, {
    step: "email",
    email: "",
    otp: "",
  });

  useEffect(() => {
    if (!ttl) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = ttl - now;

      if (distance < 0) {
        setTimer(0);
        clearInterval(interval);
      } else {
        setTimer(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ttl]);

  async function login() {
    const { email, otp } = values;

    const response = await signIn("otp-login", {
      email,
      otp,
      step: "otp",
      redirect: false,
    });

    if (response?.ok) {
      router.push("/checklist");
    } else {
      toast.error(response?.error || "Could not complete request!");
    }
  }

  async function fn() {
    const { step, email } = values;

    if (step === "email") {
      const response = await signIn("otp-login", {
        email,
        step: "email",
        redirect: false,
      });

      if (response?.error === "CredentialsSignin") {
        setTTL(Date.now() + 60 * 1000);
        return setValues({ ...values, step: "otp" });
      }

      toast.error("Could not send email");
      return;
    }

    await login();
  }

  const goBack = () => setValues({ ...values, step: "email", otp: "" });

  return values.step == "email" ? (
    <form
      action="#"
      method="post"
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-gray-500 text-balance">
          Provide your email to get your login OTP
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={onChange}
            name="email"
            placeholder="user@domain.ltd"
            required
          />
        </div>

        <Button
          variant={"secondary"}
          size={"lg"}
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-600"
          disabled={isLoading}
        >
          Contiue
        </Button>
      </div>
    </form>
  ) : (
    <form
      action="#"
      method="post"
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold">Confirm OTP</h1>
        <p className="text-sm text-gray-500 text-balance">
          Enter the {numInputs} digit code sent to your email address
        </p>
      </div>

      <OtpInput
        value={values.otp}
        onChange={(otp) => setValues({ ...values, otp })}
        numInputs={numInputs}
        containerStyle="flex gap-2.5 my-4 items-center justify-center"
        inputStyle="w-[40px] h-[40px] flex items-center justify-center border border-gray-300 transition-all bg-white rounded-md appearance-none no-spinner text-center outline-none focus:border-black"
        inputType="text"
        skipDefaultStyles
        shouldAutoFocus
        renderInput={(props) => <input {...props} required />}
      />

      <p className="font-open-sans text-gray-500 mb-5 text-center">
        {timer == 0 ? (
          <>
            Not received?{" "}
            <button
              type="button"
              onClick={goBack}
              className="text-blue-600 font-medium"
            >
              Try again
            </button>
          </>
        ) : (
          `New verification code sent - ${timer}s`
        )}
      </p>

      <Button
        variant={"secondary"}
        size={"lg"}
        type="submit"
        className="w-full bg-black text-white hover:bg-gray-600"
        disabled={isLoading}
      >
        Verify
      </Button>
    </form>
  );
}
