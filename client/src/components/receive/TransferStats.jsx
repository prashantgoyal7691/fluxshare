import { Clock3, Download } from "lucide-react";

export default function TransferStats({
    transferInfo,
    remainingDownloads,
    remainingTime,
    isExpired,
    isExpiringSoon,
    formatRemainingTime,
}) {
    return (
        <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <Download size={15} />

                    <span className="text-xs">
                        Downloads
                    </span>
                </div>

                <p className="mt-2 text-lg font-semibold text-white">
                    {transferInfo.downloadCount}
                    <span className="ml-1 text-sm font-normal text-gray-600">
                        / {transferInfo.maxDownloads}
                    </span>
                </p>

                <p className="mt-1 text-xs text-gray-600">
                    {remainingDownloads} remaining
                </p>
            </div>

            <div
                className={`rounded-2xl border p-4 ${
                    isExpired
                        ? "border-red-500/20 bg-red-500/[0.05]"
                        : isExpiringSoon
                            ? "border-yellow-500/20 bg-yellow-500/[0.05]"
                            : "border-white/[0.06] bg-white/[0.025]"
                }`}
            >
                <div
                    className={`flex items-center gap-2 ${
                        isExpired
                            ? "text-red-400"
                            : isExpiringSoon
                                ? "text-yellow-400"
                                : "text-gray-500"
                    }`}
                >
                    <Clock3 size={15} />

                    <span className="text-xs">
                        Availability
                    </span>
                </div>

                <p
                    className={`mt-2 text-lg font-semibold ${
                        isExpired
                            ? "text-red-400"
                            : isExpiringSoon
                                ? "text-yellow-400"
                                : "text-white"
                    }`}
                >
                    {isExpired
                        ? "Expired"
                        : formatRemainingTime(remainingTime)}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                    {isExpired
                        ? "This transfer is no longer available"
                        : isExpiringSoon
                            ? "Transfer expires soon"
                            : "Time remaining"}
                </p>
            </div>
        </div>
    );
}