import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="page-shell page-shell--inner">
      <AuthForm mode="signup" />
    </main>
  );
}
