"use client";

import { Suspense, useEffect, useState } from "react";

import UploadPage from "./upload/page";
import ReceivePage from "./receive/page";

import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const [activeTab, setActiveTab] = useState("send");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "receive") {
      setActiveTab("receive");

      setIsModalOpen(true);
    }
  }, [searchParams]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

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

      <div className="fixed left-10 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col gap-6">
          <button
            onClick={() => {
              setActiveTab("send");
              setIsModalOpen(true);
            }}
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
            onClick={() => {
              setActiveTab("receive");
              setIsModalOpen(true);
            }}
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

      {!isModalOpen && (
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold leading-tight">
              Share files instantly
            </h2>

            <p className="mt-6 text-xl text-gray-400 max-w-2xl">
              Upload, send and receive files securely with temporary access
              keys.
            </p>
          </motion.div>
        </div>
      )}

      {/* Floating Modal */}

      {isModalOpen && (
        <div className="relative z-30 flex min-h-screen items-center justify-center px-6">
          <div className="relative w-full max-w-6xl min-h-[720px] rounded-[48px] border border-white/10 bg-white/10 p-10 md:p-12 shadow-2xl backdrop-blur-3xl">
            {/* Close Button */}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X size={24} />
            </button>

            {/* Header */}

            <div className="mb-14">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                {activeTab === "send" ? "Send Files" : "Receive Files"}
              </h2>

              <p className="mt-5 text-xl text-gray-300">
                {activeTab === "send"
                  ? "Upload and share files with temporary secure access."
                  : "Enter your secret key to receive shared files."}
              </p>
            </div>

            {/* Content */}

            <div>
              {/* Content */}

              <div className="h-[520px]">
                <AnimatePresence mode="wait">
                  {activeTab === "send" && (
                    <motion.div
                      key="send"
                      initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="h-full"
                    >
                      <UploadPage />
                    </motion.div>
                  )}

                  {activeTab === "receive" && (
                    <motion.div
                      key="receive"
                      initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="h-full"
                    >
                      <ReceivePage initialKey={searchParams.get("key") || ""} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
