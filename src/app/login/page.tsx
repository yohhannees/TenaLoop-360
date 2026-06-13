import { AnimatedAuthPage } from "@/components/ui/animated-characters-login-page";

export const metadata = {
  title: "Sign in - TenaLoop 360",
};

export default function LoginPage() {
  return <AnimatedAuthPage mode="login" />;
}
