"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";

import UploadPage from "./upload/page";
import ReceivePage from "./receive/page";

import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function HomeContent() {
  const [activeTab, setActiveTab] = useState("send");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialKey, setInitialKey] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const key = params.get("key");
    if (key) {
      setInitialKey(key);
    }
    if (tab === "receive") {
      setActiveTab("receive");
      setIsModalOpen(true);
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

      <div className="absolute top-[-250px] left-[-150px] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-3xl" />

      <div className="absolute bottom-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-3xl" />

      {/* Branding */}

      <div className="absolute top-6 left-1/2 z-10 w-full max-w-[90%] -translate-x-1/2 px-4 text-center md:top-10">
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-8xl">
          FluxShare
        </h1>
        <p className="mt-4 text-sm text-gray-400 sm:text-lg md:text-xl">
          Fast • Temporary • Secure file sharing
        </p>
      </div>

      {/* Left Action Bar */}

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:left-10 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2">
        <div className="flex flex-row gap-4 md:flex-col md:gap-6">
          <button
            onClick={() => {
              setActiveTab("send");
              setIsModalOpen(true);
            }}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 backdrop-blur-2xl md:h-20 md:w-20 md:rounded-3xl
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
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 backdrop-blur-2xl md:h-20 md:w-20 md:rounded-3xl
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
            <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
              Share files instantly
            </h2>
            <p className="mt-5 max-w-2xl text-base text-gray-400 sm:text-xl">
              Upload, send and receive files securely with temporary access
              keys.
            </p>
          </motion.div>
        </div>
      )}

      {/* Floating Modal */}

      {isModalOpen && (
        <div className="relative z-30 flex min-h-screen items-start justify-center overflow-y-auto px-3 py-20 md:items-center md:px-6 md:py-10">
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-3xl sm:p-8 md:rounded-[48px] md:p-12">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-white/20 md:right-8 md:top-8 md:h-12 md:w-12 md:rounded-2xl"
            >
              <X size={24} />
            </button>
            {/* Header */}
            <div className="mb-14">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
                {activeTab === "send" ? "Send Files" : "Receive Files"}
              </h2>
              <p className="mt-4 text-sm text-gray-300 sm:text-lg md:text-xl">
                {activeTab === "send"
                  ? "Upload and share files with temporary secure access."
                  : "Enter your secret key to receive shared files."}
              </p>
            </div>
            {/* Content */}
            <div>
              {/* Content */}
              <div className="min-h-[420px]">
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
                      <ReceivePage initialKey={initialKey} />
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
