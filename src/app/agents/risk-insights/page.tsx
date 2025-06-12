"use client";

import Pill from "@/components/Pill";
import { Message } from "@/types";
import { ChatBubble } from "@/components";
// import { Message } from "@/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ChangeEvent, FormEventHandler, useState } from "react";

const riskInsightsDescription =
  "The Risk Insights Agent runs comprehensive quality and hygiene audits on risk registers.";

const messageOnUpload = `
Thanks! What would like to do? I can:

1. Run risk hygiene insights on the uploaded registers.
2. Perform Monte Carlo analysis.
3. Compare two risk registers using PERT *(coming soon)*.

Where would you like to start?
`.trim();

export default function RiskInsightsPage() {
  const [base, setBase] = useState(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [registers, setRegisters] = useState<string[]>(["test"]);
  const [sessionID, setSessionID] = useState(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  // const { data: session } = useSession();

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setProcessing(true);
    setProgressMessage("Uploading file(s)...");

    try {
      const form = new FormData();

      if (e.target.files && e.target.files.length > 0) {
        for (const file of e.target.files) {
          form.append("files", file);
        }
      }

      const response = await fetch(`${base}/file-upload`, {
        method: "POST",
        headers: { sessionID },
        body: form,
      });

      const data = await response.json();
      console.log("POST response:", data);
      setRegisters(data.filenames);
      setMessages((prev) =>
        prev.concat({
          sender: "bot",
          message: messageOnUpload,
        })
      );
    } catch (error) {
      console.error("POST error:", error);
    } finally {
      setProgressMessage("");
      setProcessing(false);
    }
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProcessing(true);

    if (registers.length === 0) {
      setMessages((prev) => prev.concat({ sender: "bot", message: "Please upload a file first." }));
      setProcessing(false);
      return;
    }

    setMessages((prev) => prev.concat({ sender: "user", message: value }));
    setProgressMessage("Connecting to backend");

    const socket = new WebSocket(`${base.replace("http", "ws")}/chat`);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ sessionID, registers, query: value }));
      setValue("");
    };

    socket.onmessage = ({ data }) => {
      const response = JSON.parse(data);
      console.log("WebSocket message:", response);

      if (response?.progress) {
        setProgressMessage(response.progress);
      } else {
        setMessages((prev) => prev.concat({ ...response, sender: "bot" }));
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      setProgressMessage("");
      console.log("WebSocket connection closed");
      setProcessing(false);
    };
  };

  const avatars = {
    bot: (
      <div className="bg-foreground rounded-full w-14 h-14 grid place-content-center">
        <span className="Appkit4-icon icon-bot-outline text-lg" />
      </div>
    ),
    user: (
      <div className="bg-foreground rounded-full w-14 h-14 grid place-content-center">
        {"Krushil Naik (US)"
          ?.split("(")[0]
          ?.split(" ")
          .map((x) => x[0])
          .join("")}
      </div>
    ),
  };

  // useEffect(() => {
  //   const server = location.host;

  //   if (server.startsWith("localhost")) {
  //     setBase("http://localhost:8000");
  //   } else {
  //     setBase(process.env.NEXT_PUBLIC_API_BASE_URL!);
  //   }
  // }, []);

  return (
    <div className="flex flex-col justify-between max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex flex-col gap-4 w-5xl max-w-[70vw] justify-between h-full mx-auto pt-20 translate-z-0">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl font-medium">Risk Insights</h1>
          <p className="text-xl max-w-6xl">{riskInsightsDescription}</p>
        </div>
        <section className="text-lg">
          <h2>The Risk Insights Agent can run:</h2>
          <ul>
            <li>
              Risk hygiene insights.
              <ul>
                <li>
                  Risk description analysis across projects and recommend a standard naming of similar risk
                  descriptions.
                </li>
                <li>
                  Quantification of rationale analysis to ensure project managers accurately explain risk schedule and
                  cost impact.
                </li>
                <li>Data hygiene checks.</li>
                <li>Mitigation checks.</li>
                <li>Risk profile timeline analysis.</li>
              </ul>
            </li>
            <li>Monte Carlo budget analysis.</li>
            <li>Program Evaluation and Review Technique (PERT) comparison between two risk registers.</li>
          </ul>
        </section>
        {messages.map((m, i) => (
          // @ts-ignore
          <ChatBubble key={`chat-bubble-${i}`} {...m} avatar={avatars[m.sender]} />
          // <div>hi</div>
        ))}
        <div className="flex flex-col gap-2 sticky bottom-8 w-full">
          <span className="animate-pulse px-2">{progressMessage}</span>
          <div
            className="flex flex-col gap-2 justify-center border-2 border-white/15 p-2 rounded-lg bg-container"
            style={
              processing
                ? {
                    opacity: 0.5,
                    // cursor: "not-allowed",
                    pointerEvents: "none",
                  }
                : {}
            }
          >
            <form
              onSubmit={handleFormSubmit}
              className="relative border-[1px] border-white/25 group focus-within:border-primary grid grid-cols-[1fr_auto] w-full rounded-sm p-1 hover:bg-highlight transition-colors duration-300"
            >
              <label
                style={value != "" ? { scale: "75%", top: "30%" } : {}}
                className="absolute text-white/50 group-focus-within:scale-75 group-focus-within:top-[30%] origin-top-left top-1/2 -translate-y-1/2 left-2 pointer-events-none transition-all duration-500"
                htmlFor="query"
              >
                Ask Risk Insights Agent
              </label>
              <input
                type={"text"}
                name="query"
                id="query"
                value={value}
                className="w-full outline-none px-1 pt-3"
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="flex gap-2">
                <label
                  htmlFor="files"
                  className="w-10 h-10 grid place-content-center rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                >
                  <span className="Appkit4-icon icon-paperclip-outline">p</span>
                </label>
                <button type="submit" className="w-10 h-10 bg-[#415385] hover:brightness-125">
                  <span className="Appkit4-icon icon-paper-airplane-outline">s</span>
                </button>
              </div>
            </form>
            <div className="flex justify-between items-center">
              <div>
                {registers.map((r, i) => (
                  <Pill
                    key={`pill-${i}`}
                    filepath={r || "Unknown File"}
                    onClick={() => setRegisters((prev) => prev.filter((_r) => r !== _r))}
                  />
                ))}
              </div>
              <i className="text-sm">AI-generated content may be inaccurate and requires human review.</i>
            </div>
            <input type="file" name="files" id="files" multiple max={2} min={1} hidden onChange={handleFileUpload} />
          </div>
        </div>
      </div>
    </div>
  );
}
