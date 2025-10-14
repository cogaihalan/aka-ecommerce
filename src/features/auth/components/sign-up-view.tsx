import { SignUp as ClerkSignUpForm } from "@clerk/nextjs";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignUpViewPage() {
  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
          <p className="text-muted-foreground">
            Create a new account to get started
          </p>
        </div>

        <ClerkSignUpForm
          initialValues={{
            emailAddress: "your_mail+clerk_test@example.com",
          }}
        />

        <p className="text-muted-foreground text-center text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
