"use client";

import { useState } from "react";

import UploadPage from "./upload/page";
import ReceivePage from "./receive/page";

import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";

export default function Home() {

  const [activeTab, setActiveTab] = useState(null);

  return (

    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

      {/* Glow Effects */}

      <div className="absolute top-[-250px] left-[-150px] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-3xl" />

      <div className="absolute bottom-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-3xl" />

      {/* Branding */}

      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center">

        <h1 className="text-7xl font-black tracking-tight md:text-8xl">

          FluxShare

        </h1>

        <p className="mt-5 text-xl text-gray-400">

          Fast • Temporary • Secure file sharing

        </p>

      </div>

      {/* Left Action Bar */}

      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20">

        <div className="flex flex-col gap-6">

          <button
            onClick={() => setActiveTab("send")}
            className={`flex h-20 w-20 items-center justify-center rounded-3xl border transition-all duration-300 backdrop-blur-2xl
            ${
              activeTab === "send"
                ? "border-white bg-white text-black shadow-2xl scale-110"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20 hover:scale-105"
            }`}
          >

            <ArrowUpRight size={34} />

          </button>

          <button
            onClick={() => setActiveTab("receive")}
            className={`flex h-20 w-20 items-center justify-center rounded-3xl border transition-all duration-300 backdrop-blur-2xl
            ${
              activeTab === "receive"
                ? "border-white bg-white text-black shadow-2xl scale-110"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20 hover:scale-105"
            }`}
          >

            <ArrowDownLeft size={34} />

          </button>

        </div>

      </div>

      {/* Empty Landing State */}

      {
        !activeTab && (

          <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

            <div className="text-center">

              <h2 className="text-5xl font-bold leading-tight">

                Share files instantly

              </h2>

              <p className="mt-6 text-xl text-gray-400 max-w-2xl">

                Upload, send and receive files securely with temporary access keys.

              </p>

            </div>

          </div>
        )
      }

      {/* Floating Modal */}

      {
        activeTab && (

          <div className="relative z-30 flex min-h-screen items-center justify-center px-6">

            <div className="relative w-full max-w-6xl min-h-[720px] rounded-[48px] border border-white/10 bg-white/10 p-16 shadow-2xl backdrop-blur-3xl">

              {/* Close Button */}

              <button
                onClick={() => setActiveTab(null)}
                className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >

                <X size={24} />

              </button>

              {/* Header */}

              <div className="mb-14">

                <h2 className="text-7xl font-black tracking-tight">

                  {
                    activeTab === "send"
                      ? "Send Files"
                      : "Receive Files"
                  }

                </h2>

                <p className="mt-5 text-xl text-gray-300">

                  {
                    activeTab === "send"
                      ? "Upload and share files with temporary secure access."
                      : "Enter your secret key to receive shared files."
                  }

                </p>

              </div>

              {/* Content */}

              <div>

                {
                  activeTab === "send"
                    ? <UploadPage />
                    : <ReceivePage />
                }

              </div>

            </div>

          </div>
        )
      }

    </main>
  );
}