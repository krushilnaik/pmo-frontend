"use client";

import { apps } from "@/tools/agents";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const toggleNav = () => {
    navRef.current?.classList.toggle("expanded");
  };

  return (
    <nav ref={navRef} className="bg-container h-content w-nav flex flex-col justify-between p-3 rounded-r-lg">
      <div className="flex flex-col gap-1">
        {apps.map((n) => (
          <Link
            href={n.route}
            data-tooltip={n.name}
            className="@container h-12 w-full p-gap hover:bg-highlight flex justify-start items-center"
            style={
              pathname === n.route
                ? { color: "var(--color-primary-text)", backgroundColor: "var(--color-highlight)" }
                : {}
            }
            key={`nav-${n.name}`}
          >
            <span className="inline-block w-6 h-6 text-center">v</span>
            <span className="hidden @[4.5rem]:inline">{n.name}</span>
          </Link>
        ))}
      </div>
      <div>
        <button
          className="@container h-12 w-full p-gap hover:bg-highlight flex justify-start items-center"
          onClick={toggleNav}
        >
          <span className="inline-block w-6 h-6">v</span>
          <span className="hidden @[4.5rem]:inline">Collapse</span>
        </button>
      </div>
    </nav>
  );
}
