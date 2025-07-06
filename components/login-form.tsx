"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    if (loading) return;

    const toastId = toast.loading("Sending magic link...");
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ email: values.email }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await authClient.signIn.magicLink(
      { email: values.email, callbackURL: "/checklist" },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: () => {
          toast.success("A magic link has been sent to your email.", {
            id: toastId,
          });

          form.reset();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to send magic link.", {
            id: toastId,
          });
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-gray-500 text-balance">
          Get started with a magic link
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...form.register("email")}
            className={form.formState.errors.email ? "border-red-500" : ""}
          />

          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          variant={"secondary"}
          size={"lg"}
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Sending..." : "Get Login Link"}
        </Button>
      </div>
    </form>
  );
}
