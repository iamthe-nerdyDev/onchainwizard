import { WandIcon } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { LocaleSwitcher } from "lingo.dev/react-client";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <a href="#" className="flex items-center gap-2">
            <span className="font-semibold font-mono text-lg">
              OnchainWizard
            </span>
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <WandIcon />
            </div>
          </a>

          <span className="w-[1px] h-4 bg-gray-400" />

          <LocaleSwitcher locales={["en", "es", "fr", "de"]} />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
