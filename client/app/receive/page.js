"use client";

import { useState } from "react";

export default function ReceivePage() {

  const [key, setKey] = useState("");

  const handleDownload = () => {

    if (!key) {
      alert("Please enter a key");
      return;
    }

    window.open(
      `http://localhost:5002/api/files/download/${key}`,
      "_blank"
    );
  };

  return (
<div className="space-y-8">

  <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">

    <div className="mb-8 text-center">

      <h3 className="text-4xl font-semibold text-white">
        Receive Shared Files
      </h3>

      <p className="mt-4 text-lg text-gray-400">
        Enter the transfer key shared with you.
      </p>

    </div>

    <input
      type="text"
      placeholder="Enter Secret Key"
      value={key}
      onChange={(e) => setKey(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-5 text-xl text-white outline-none placeholder:text-gray-500 backdrop-blur-xl"
    />

    <button
      onClick={handleDownload}
      className="mt-6 w-full rounded-2xl bg-white py-5 text-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
    >
      Download Files
    </button>

  </div>

</div>
  );
}