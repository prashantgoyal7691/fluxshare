import { Clock3, Download } from "lucide-react";

export default function UploadOptions({
    expiry,
    setExpiry,
    maxDownloads,
    setMaxDownloads,
}) {
    const expiryOptions = [
        [1, "1 min"],
        [5, "5 min"],
        [15, "15 min"],
        [60, "1 hour"],
        [1440, "24 hours"],
    ];

    const downloadOptions = [1, 5, 10, 25];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-white/[0.08] bg-[#12151A] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-gray-400">
                        <Clock3 size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-white">
                            Expiration
                        </p>

                        <p className="text-xs text-gray-600">
                            When should this transfer expire?
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {expiryOptions.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setExpiry(value)}
                            className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition-all ${
                                expiry === value
                                    ? "border-white bg-white text-black"
                                    : "border-white/[0.08] bg-white/[0.025] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-[20px] border border-white/[0.08] bg-[#12151A] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-gray-400">
                        <Download size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-white">
                            Download limit
                        </p>

                        <p className="text-xs text-gray-600">
                            Maximum number of downloads
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {downloadOptions.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setMaxDownloads(value)}
                            className={`rounded-xl border py-2.5 text-xs font-medium transition-all ${
                                maxDownloads === value
                                    ? "border-white bg-white text-black"
                                    : "border-white/[0.08] bg-white/[0.025] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300"
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}