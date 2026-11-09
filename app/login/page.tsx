import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <main className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="mb-6 font-serif text-3xl">Iniciar sesión</h1>
        <LoginForm />
      </main>
    </div>
  );
}
