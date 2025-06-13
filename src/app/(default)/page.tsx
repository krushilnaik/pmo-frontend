"use client";

import { apps } from "@/tools/agents";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";

export default function Home() {
  // const { data: session } = useSession();

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <div className="flex flex-col justify-baseline flex-wrap gap-8 max-w-7xl p-16">
      <section>
        <h1 className="mb-6">Agentic PMO</h1>
        <p className="text-lg">
          Agentic PMO is an intelligent project management hub where agents handle risk, reporting, and analysis to
          streamline decisions and keep delivery on track.
        </p>
      </section>
      <section className="grid grid-cols-2 gap-4">
        {apps
          .filter((a) => a.route.startsWith("/agent"))
          .map((a, i) => (
            <div key={`blurb-${i}`} className="grid grid-cols-[auto_1fr] gap-4">
              <div className="flex flex-col w-44 h-24 gap-4 items-center rounded-lg border-2 border-container-alt aspect-video p-2">
                <span>v</span>
                <span>{a.name}</span>
              </div>
              <p className="max-w-96">{a.description}</p>
            </div>
          ))}
      </section>
    </div>
  );
}
