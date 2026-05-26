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
} from "lucide-react";

export default function UploadPage() {

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadData, setUploadData] = useState(null);

  const [expiry, setExpiry] = useState(5);

  // DROP SUPPORT

  const onDrop = (acceptedFiles) => {

    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: true,
  });

  // PASTE SUPPORT

  useEffect(() => {

    const handlePaste = (event) => {

      const pastedFiles = event.clipboardData.files;

      if (pastedFiles.length > 0) {

        setFiles((prev) => [
          ...prev,
          ...Array.from(pastedFiles),
        ]);
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
      return alert("Please select files");
    }

    try {

      setLoading(true);

      setUploadProgress(0);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("expiry", expiry);

      const response = await axios.post(
        "http://localhost:5002/api/files/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {

            const percent = Math.round(
              (progressEvent.loaded * 100) /
              progressEvent.total
            );

            setUploadProgress(percent);
          },
        }
      );

      setUploadData(response.data);

      setUploadProgress(100);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      alert("Upload failed");
    }
  };

  // COPY KEY

  const copyKey = async () => {

    if (!uploadData?.key) return;

    await navigator.clipboard.writeText(
      uploadData.key
    );

    alert("Key copied");
  };

  return (

    <div className="space-y-8">

      {/* DROP ZONE */}

      <div
        {...getRootProps()}
        className={`relative flex min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-[40px] border border-dashed transition-all duration-300
        ${
          isDragActive
            ? "border-blue-400 bg-blue-500/10"
            : "border-white/20 bg-white/5 hover:bg-white/10"
        }`}
      >

        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center px-10">

          <div className="mb-8 text-white/80">

            {renderFileIcon()}

          </div>

          {
            files.length === 0 ? (

              <>

                <h3 className="text-4xl font-semibold">

                  Drop or paste files here

                </h3>

                <p className="mt-5 max-w-2xl text-lg text-gray-400">

                  Drag & drop files, folders, videos,
                  screenshots or paste content with CMD + V.

                </p>

              </>

            ) : (

              <div className="w-full max-w-3xl space-y-4">

                <div className="mb-6 text-center">

                  <h3 className="text-3xl font-semibold">

                    {files.length} Files Selected

                  </h3>

                  <p className="mt-3 text-gray-400">

                    {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB Total

                  </p>

                </div>

                <div className="max-h-[250px] space-y-3 overflow-y-auto pr-2">

                  {
                    files.map((file, index) => (

                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                      >

                        <div className="overflow-hidden">

                          <p className="truncate text-lg font-medium text-white">
                            {file.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>

                        </div>

                        <div className="text-sm text-gray-500">
                          {file.type || "Unknown"}
                        </div>

                      </div>
                    ))
                  }

                </div>

              </div>
            )
          }

        </div>

      </div>

      {/* EXPIRY */}

      <div>

        <label className="mb-3 block text-lg font-medium">

          Expiry Time

        </label>

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

      </div>

      {/* UPLOAD BUTTON */}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full rounded-2xl bg-white py-5 text-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
      >

        {
          loading
            ? "Uploading Files..."
            : "Upload Files"
        }

      </button>

      {/* PROGRESS */}

      {
        loading && (

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
        )
      }

      {/* RESULT */}

      {
        uploadData && (

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <p className="mb-4 text-lg text-gray-400">

              Secret Key

            </p>

            <p className="mb-6 text-sm text-gray-500">
              Share this key with anyone to receive the uploaded files.
            </p>

            <div className="flex items-center gap-4">

              <div className="flex-1 rounded-2xl bg-white/10 px-6 py-5 text-3xl font-bold tracking-[0.3em]">

                {uploadData.key}

              </div>

              <button
                onClick={copyKey}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black transition-all hover:scale-105"
              >

                <Copy size={24} />

              </button>

            </div>

          </div>
        )
      }

    </div>
  );
}