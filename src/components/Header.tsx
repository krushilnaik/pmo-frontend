"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session && pathname !== "/auth/signin") {
    sessionStorage.setItem("redirectTo", pathname);
    redirect("/auth/signin");
  }

  return (
    <header className="bg-container h-16 p-gap flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="h-12 w-12 grid place-content-center">
          v
        </Link>
        Agentic PMO
      </div>
      <button onClick={() => signOut()} className="h-12 w-12 rounded-full bg-primary">
        {session?.user?.name
          ?.split("(")[0]
          ?.split(" ")
          .map((x) => x[0])
          .join("")}
      </button>
    </header>
  );
}
