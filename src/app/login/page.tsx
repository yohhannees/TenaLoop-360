import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Log in - TenaLoop 360",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
