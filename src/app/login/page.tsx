import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="page-shell page-shell--inner">
      <AuthForm mode="login" />
    </main>
  );
}
