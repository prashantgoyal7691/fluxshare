import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock3,
  LockKeyhole,
  Zap,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import UploadPage from "./pages/Upload";
import ReceivePage from "./pages/Receive";
import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function Home() {
  const [activeMode, setActiveMode] = useState("send");
  const [initialKey, setInitialKey] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const tab = params.get("tab");
    const key = params.get("key");

    if (key) {
      setInitialKey(key);
    }

    if (tab === "receive") {
      setActiveMode("receive");
    }
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#090B0F] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-250px] top-[-250px] h-[550px] w-[550px] rounded-full bg-violet-600/[0.08] blur-[140px]" />

        <div className="absolute bottom-[-250px] right-[-250px] h-[550px] w-[550px] rounded-full bg-blue-600/[0.07] blur-[140px]" />

        <div className="absolute left-1/2 top-[30%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.06]">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => setActiveMode("send")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <ArrowUpRight size={19} strokeWidth={2.5} />
            </div>

            <span className="text-lg font-bold tracking-tight">
              FluxShare
            </span>
          </button>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <NavDropdown
              label="How it works"
              menu="how"
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-white">
                    Share files in seconds
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Select your files, configure the transfer and share
                    the generated key.
                  </p>
                </div>

                <div className="space-y-3">
                  <Step number="01" title="Select files" />
                  <Step number="02" title="Configure transfer" />
                  <Step number="03" title="Share the key" />
                </div>
              </div>
            </NavDropdown>

            <NavDropdown
              label="Security"
              menu="security"
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-white">
                    Private by default
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Transfers are temporary and protected by a secret
                    access key.
                  </p>
                </div>

                <div className="space-y-3">
                  <InfoItem
                    icon={<LockKeyhole size={16} />}
                    title="Secret transfer keys"
                  />

                  <InfoItem
                    icon={<Clock3 size={16} />}
                    title="Automatic expiration"
                  />

                  <InfoItem
                    icon={<ShieldCheck size={16} />}
                    title="Temporary access"
                  />
                </div>
              </div>
            </NavDropdown>

            <NavDropdown
              label="About"
              menu="about"
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            >
              <div>
                <p className="font-medium text-white">
                  About FluxShare
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  FluxShare is a simple file-sharing platform designed
                  to make sending temporary files fast and effortless.
                </p>

                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                  <p className="text-xs text-gray-500">
                    No account
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Temporary transfers
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Secure access
                  </p>
                </div>
              </div>
            </NavDropdown>
          </nav>

          <button
            onClick={() =>
              setActiveMode(
                activeMode === "send" ? "receive" : "send",
              )
            }
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
          >
            {activeMode === "send" ? (
              <>
                <ArrowDownLeft size={16} />
                <span className="hidden sm:inline">
                  Receive files
                </span>
                <span className="sm:hidden">Receive</span>
              </>
            ) : (
              <>
                <ArrowUpRight size={16} />
                <span className="hidden sm:inline">
                  Send files
                </span>
                <span className="sm:hidden">Send</span>
              </>
            )}
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-1.5 text-xs font-medium text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Secure temporary file sharing
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Share files.
              <br />

              <span className="text-gray-500">
                Without the hassle.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Upload your files, get a secure transfer key, and
              share them instantly. No account required.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1">
              <button
                onClick={() => setActiveMode("send")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${activeMode === "send"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                <ArrowUpRight size={17} />
                Send files
              </button>

              <button
                onClick={() => setActiveMode("receive")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${activeMode === "receive"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                <ArrowDownLeft size={17} />
                Receive files
              </button>
            </div>
          </div>

          <motion.div
            layout
            className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-2"
          >
            <div className="rounded-[23px] border border-white/[0.06] bg-[#0E1116] p-4 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeMode === "send" ? (
                    <UploadPage />
                  ) : (
                    <ReceivePage initialKey={initialKey} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          <Feature
            icon={<Zap size={18} />}
            title="Fast"
            description="Quick transfers without unnecessary steps."
          />

          <Feature
            icon={<Clock3 size={18} />}
            title="Temporary"
            description="Files disappear automatically after expiry."
          />

          <Feature
            icon={<LockKeyhole size={18} />}
            title="Private"
            description="Access is protected by a secret transfer key."
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <ShieldCheck size={14} className="text-gray-600" />

          <p className="text-xs text-gray-600">
            No account required · Temporary access · Private by
            default
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.11] hover:bg-white/[0.035]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-gray-400 transition-colors group-hover:bg-white/[0.08] group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-sm font-medium text-white">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function NavDropdown({
  label,
  menu,
  openMenu,
  setOpenMenu,
  children,
}) {
  const isOpen = openMenu === menu;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpenMenu(menu)}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <button
        type="button"
        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all ${isOpen
            ? "bg-white/[0.06] text-white"
            : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
          }`}
      >
        {label}

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-[calc(100%+10px)] z-50 w-[280px] -translate-x-1/2 rounded-2xl border border-white/[0.10] bg-[#0E1116]/85 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          {children}
        </div>
      )}
    </div>
  );
}

function Step({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-[10px] text-gray-500">
        {number}
      </div>

      <span className="text-xs text-gray-400">
        {title}
      </span>
    </div>
  );
}

function InfoItem({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-gray-500">
        {icon}
      </div>

      <span className="text-xs text-gray-400">
        {title}
      </span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#16191F",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
          },
        }}
      />

      <AppRoutes home={<Home />} />
    </BrowserRouter>
  );
}

export default App;