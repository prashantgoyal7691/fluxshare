"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Download, KeyRound, FileArchive } from "lucide-react";

export default function ReceivePage({ initialKey = "" }) {
  const [key, setKey] = useState(initialKey);
  const [transferInfo, setTransferInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (initialKey) {
      fetchTransferInfo(initialKey);
    }
  }, [initialKey]);

  const fetchTransferInfo = async (customKey) => {
    setTransferInfo(null);
    const transferKey = (customKey || key || "").trim();

    if (!transferKey) {
      toast.error("Please enter a key");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/info/${transferKey}`,
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      setTransferInfo(data);

      toast.success("Transfer found");

      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch transfer");

      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/download/${transferInfo.key}`,
        "_blank",
      );

      toast.success("Download started");

      // REFRESH TRANSFER INFO

      setTimeout(() => {
        fetchTransferInfo(transferInfo.key);
        setLoading(false);
      }, 1200);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      {/* RECEIVE WORKSPACE */}

      <div className="relative flex w-full h-full min-h-[460px] flex-col items-center justify-center rounded-[36px] border border-dashed border-white/10 bg-white/[0.04] px-10 text-center backdrop-blur-2xl transition-all duration-300">
        {/* ICON */}

        <div className="mb-10 rounded-full border border-white/10 bg-white/10 p-7 text-white backdrop-blur-xl">
          <FileArchive size={70} />
        </div>

        {/* INPUT */}

        <div className="w-full max-w-xl">
          <div className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-2xl transition-all duration-300 focus-within:border-white/30 focus-within:bg-white/15">
            <div className="text-gray-400">
              <KeyRound size={28} />
            </div>

            <input
              type="text"
              placeholder="Enter Secret Key"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setTransferInfo(null);
              }}
              className="w-full bg-transparent text-xl font-medium tracking-[0.12em] text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}

        <button
          onClick={() => fetchTransferInfo()}
          className="mt-8 flex w-full max-w-xl items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={24} />
          {loading ? "Checking Transfer..." : "Check Transfer"}
        </button>

        {transferInfo && (
          <div className="mt-8 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <div className="mb-5">
              <h3 className="text-2xl font-semibold text-white">
                Transfer Ready
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {transferInfo.totalFiles} files available
              </p>
            </div>

            <div className="space-y-3">
              {transferInfo.files.map((file, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-gray-300"
                >
                  {file.fileName}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
              <p>
                Downloads: {transferInfo.downloadCount}/
                {transferInfo.maxDownloads}
              </p>
            </div>

            <button
              disabled={
                loading ||
                transferInfo.downloadCount >= transferInfo.maxDownloads
              }
              onClick={handleDownload}
              className="mt-6 w-full rounded-2xl bg-white py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed
              disabled:opacity-50"
            >
              {transferInfo.downloadCount >= transferInfo.maxDownloads
                ? "Download Limit Reached"
                : "Download Now"}
            </button>
          </div>
        )}

        {/* SUBTEXT */}

        <p className="mt-6 text-sm text-gray-500">
          Files remain available until the sender's expiry time ends.
        </p>
      </div>
    </div>
  );
}
