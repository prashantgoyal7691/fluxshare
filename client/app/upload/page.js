"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  File,
  Image,
  Video,
  Copy,
  Check,
  Share2,
  Send,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UploadPage() {
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadData, setUploadData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [expiry, setExpiry] = useState(5);

  const [maxDownloads, setMaxDownloads] = useState(10);

  const shareLink = uploadData
    ? `${window.location.origin}/transfer/${uploadData.key}`
    : "";

  // DROP SUPPORT

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // PASTE SUPPORT

  useEffect(() => {
    const handlePaste = (event) => {
      const pastedFiles = event.clipboardData.files;

      if (pastedFiles.length > 0) {
        setFiles((prev) => [...prev, ...Array.from(pastedFiles)]);
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // FILE TYPE ICON

  const renderFileIcon = () => {
    if (files.length === 0) {
      return <UploadCloud size={80} />;
    }

    const firstFile = files[0];

    if (firstFile.type.startsWith("image")) {
      return <Image size={70} />;
    }

    if (firstFile.type.startsWith("video")) {
      return <Video size={70} />;
    }

    return <File size={70} />;
  };

  // UPLOAD

  const handleUpload = async () => {
    if (files.length === 0) {
      return toast.error("Please select files");
    }

    try {
      setLoading(true);

      setUploadProgress(0);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("expiry", expiry);
      formData.append("maxDownloads", maxDownloads);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            setUploadProgress(percent);
          },
        },
      );

      setUploadData(response.data);
      await navigator.clipboard.writeText(response.data.key);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
      toast.success("Files uploaded successfully");

      setUploadProgress(100);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Upload failed");
      }
    }
  };

  // COPY KEY

  const copyKey = async () => {
    if (!uploadData?.key) return;

    await navigator.clipboard.writeText(uploadData.key);

    setCopied(true);

    toast.success("Key copied successfully");

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleNativeShare = async () => {
    if (!shareLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "FluxShare Transfer",
          text: "Download shared files",
          url: shareLink,
        });

        toast.success("Share opened");
      } else {
        await navigator.clipboard.writeText(shareLink);

        toast.success("Link copied");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {/* DROP ZONE */}

      <div
        {...getRootProps()}
        className={`relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed transition-all duration-300 md:min-h-[420px] md:rounded-[40px]
        ${
          isDragActive
            ? "border-blue-400 bg-blue-500/10"
            : "border-white/20 bg-white/5 hover:bg-white/10"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center px-5 text-center md:px-10">
          <div className="mb-8 text-white/80">{renderFileIcon()}</div>
          {files.length === 0 ? (
            <>
              <h3 className="text-2xl font-semibold sm:text-4xl">
                Drop or paste files here
              </h3>
              <p className="mt-4 max-w-2xl text-sm text-gray-400 sm:text-lg">
                Drag & drop files, folders, videos, screenshots or paste content
                with CMD + V.
              </p>
            </>
          ) : (
            <div className="w-full max-w-3xl space-y-4">
              <div className="mb-6 text-center">
                <h3 className="text-3xl font-semibold">
                  {files.length} Files Selected
                </h3>
                <p className="mt-3 text-gray-400">
                  {(
                    files.reduce((acc, file) => acc + file.size, 0) /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB Total
                </p>
              </div>
              <div className="max-h-[220px] space-y-3 overflow-y-auto pr-2 md:max-h-[280px]">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                  >
                    <div className="w-full overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-white sm:text-lg">
                        {file.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="break-all text-xs text-gray-500 sm:text-sm">
                      {file.type || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXPIRY */}

      <div>
        <label className="mb-3 block text-lg font-medium">Expiry Time</label>

        <select
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-lg text-white outline-none backdrop-blur-xl"
        >
          <option value={1}>1 Minute</option>
          <option value={5}>5 Minutes</option>
          <option value={15}>15 Minutes</option>
          <option value={60}>1 Hour</option>
          <option value={1440}>24 Hours</option>
        </select>
        <div className="mt-6">
          <label className="mb-3 block text-lg font-medium">
            Maximum Downloads
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 5, 10, 25].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMaxDownloads(value)}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  maxDownloads === value
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* UPLOAD BUTTON */}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full rounded-2xl bg-white py-5 text-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Uploading Files..." : "Upload Files"}
      </button>

      {/* PROGRESS */}

      {loading && (
        <div>
          <div className="mb-3 flex justify-between text-sm text-gray-400">
            <span>Uploading...</span>

            <span>{uploadProgress}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* RESULT */}

      {uploadData && (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="mb-4 text-lg text-gray-400">Secret Key</p>

          <p className="mb-6 text-sm text-gray-500">
            Share this key with anyone to receive the uploaded files.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full break-all rounded-2xl bg-white/10 px-4 py-4 text-center text-xl font-bold tracking-[0.18em] sm:flex-1 sm:px-6 sm:py-5 sm:text-3xl sm:tracking-[0.3em]">
              {uploadData.key}
            </div>
            <button
              onClick={copyKey}
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 ${
                copied ? "bg-green-500 text-white" : "bg-white text-black"
              }`}
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="mb-2 text-sm text-gray-400">Shareable Link</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast.success("Link copied");
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white transition-all duration-300 hover:bg-white/10"
              >
                <Copy size={18} />
                Copy Link
              </button>
              <p className="col-span-full break-all text-xs text-white sm:text-sm">{shareLink}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
