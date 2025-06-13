"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      redirect(sessionStorage.getItem("redirectTo") || "/");
    }
  }, []);

  return (
    <div className="bg-rose-950 grid place-content-center">
      <button className="rounded-lg bg-sky-800 px-2 py-1" onClick={() => signIn("azure-ad")}>
        Sign in (Azure AD)
      </button>
    </div>
  );
}
