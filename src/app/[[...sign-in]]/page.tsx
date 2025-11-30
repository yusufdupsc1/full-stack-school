"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // If signed in with role, redirect to dashboard
    const role = user?.publicMetadata?.role;
    if (isSignedIn && role) {
      router.push(`/${role}`);
      return;
    }

    // If signed in but no role, redirect to setup
    if (isSignedIn && !role) {
      router.push("/setup");
      return;
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            SchooLama
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Email Address
            </Clerk.Label>
            <Clerk.Input
              type="email"
              required
              placeholder="your-email@example.com"
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign In
          </SignIn.Action>
          <div className="mt-4 p-3 bg-yellow-50 rounded text-xs text-gray-700 border border-yellow-200">
            <p className="font-semibold mb-1">💡 Sign In With:</p>
            <p className="mb-2">
              Use your <strong>email address</strong> from Clerk
              <br />
              (e.g., your-email@example.com)
            </p>
            <a
              href="/setup"
              className="text-blue-600 font-semibold hover:underline"
            >
              ➜ After signing in, click here to add your role
            </a>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
