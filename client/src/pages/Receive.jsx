import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Check,
    Clock3,
    Download,
    ArrowRight,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import TransferKeyInput from "../components/receive/TransferKeyInput";
import FileList from "../components/receive/FileList";
import DownloadSummary from "../components/receive/DownloadSummary";
import TransferStats from "../components/receive/TransferStats";
import {
    getTransferInfo,
    downloadSelectedFiles,
} from "../services/fileService";
import { formatFileSize } from "../utils/fileUtils";
import { formatRemainingTime } from "../utils/timeUtils";
import useTransferExpiry from "../hooks/useTransferExpiry";

export default function ReceivePage({ initialKey = "" }) {
    const [key, setKey] = useState(initialKey);
    const [transferInfo, setTransferInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        setKey(initialKey);

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

            const data = await getTransferInfo(transferKey);

            if (!data.success) {
                toast.error(data.message || "Transfer not found");
                return;
            }

            setSelectedFiles([]);
            setTransferInfo(data);
            toast.success("Transfer found");
        } catch (error) {
            console.error("Fetch transfer error:", error);
            toast.error("Failed to fetch transfer");
        } finally {
            setLoading(false);
        }
    };

    const toggleFileSelection = (fileId) => {
        setSelectedFiles((prev) =>
            prev.includes(fileId)
                ? prev.filter((id) => id !== fileId)
                : [...prev, fileId],
        );
    };

    const selectAllFiles = () => {
        if (!transferInfo?.files) return;

        setSelectedFiles(
            transferInfo.files.map((file) => file.id),
        );
    };

    const clearFileSelection = () => {
        setSelectedFiles([]);
    };

    const {
        remainingTime,
        isExpired,
        isExpiringSoon,
    } = useTransferExpiry(
        transferInfo?.expiresAt,
        clearFileSelection,
    );

    const getSelectedFiles = () => {
        if (!transferInfo?.files) return [];

        return transferInfo.files.filter((file) =>
            selectedFiles.includes(file.id),
        );
    };

    const getSelectedSize = () => {
        return getSelectedFiles().reduce(
            (total, file) => total + (file.fileSize || 0),
            0,
        );
    };

    const handleDownload = async () => {
        if (!transferInfo?.key || selectedFiles.length === 0 || isExpired) {
            return;
        }

        try {
            setLoading(true);

            const response = await downloadSelectedFiles(
                transferInfo.key,
                selectedFiles,
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                toast.error(
                    data?.message || "Download failed",
                );

                return;
            }

            const contentType = response.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                const data = await response.json();

                if (data.type === "file" && data.downloadUrl) {
                    window.location.href = data.downloadUrl;

                    toast.success("File download started");

                    setTimeout(() => {
                        fetchTransferInfo(transferInfo.key);
                    }, 500);

                    return;
                }

                toast.error(data.message || "Download failed");
                return;
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `${transferInfo.key}-selected.zip`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                selectedFiles.length === 1
                    ? "File downloaded"
                    : "Selected files downloaded",
            );

            setTimeout(() => {
                fetchTransferInfo(transferInfo.key);
            }, 500);
        } catch (error) {
            console.error("Download error:", error);

            toast.error("Download failed");
        } finally {
            setLoading(false);
        }
    };

    const getRemainingDownloads = () => {
        if (!transferInfo) return 0;

        return Math.max(
            0,
            transferInfo.maxDownloads - transferInfo.downloadCount,
        );
    };

    const isLimitReached =
        transferInfo &&
        transferInfo.downloadCount >= transferInfo.maxDownloads;

    return (
        <div className="w-full">
            {!transferInfo ? (
                <TransferKeyInput
                    keyValue={key}
                    setKey={setKey}
                    onSubmit={() => fetchTransferInfo()}
                    loading={loading}
                />
            ) : (
                <div className="mx-auto max-w-3xl">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#12151A]">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.07),transparent_50%)]" />

                        <div className="relative p-5 sm:p-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                                        <Check size={24} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-green-400">
                                            Transfer found
                                        </p>

                                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            Files ready
                                        </h2>

                                        <p className="mt-1.5 text-sm text-gray-500">
                                            {transferInfo.totalFiles}{" "}
                                            {transferInfo.totalFiles === 1
                                                ? "file"
                                                : "files"}{" "}
                                            available for download
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 sm:text-right">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600">
                                        Transfer key
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-semibold tracking-[0.16em] text-gray-300">
                                        {transferInfo.key}
                                    </p>
                                </div>
                            </div>

                            <div className="my-6 h-px bg-white/[0.06]" />

                            <FileList
                                files={transferInfo.files}
                                selectedFiles={selectedFiles}
                                onToggle={toggleFileSelection}
                                onSelectAll={selectAllFiles}
                                onClear={clearFileSelection}
                                formatSize={formatFileSize}
                            />

                            <DownloadSummary
                                selectedCount={selectedFiles.length}
                                selectedSize={getSelectedSize()}
                                totalFiles={transferInfo.files.length}
                                formatSize={formatFileSize}
                            />

                            <TransferStats
                                transferInfo={transferInfo}
                                remainingDownloads={getRemainingDownloads()}
                                remainingTime={remainingTime}
                                isExpired={isExpired}
                                isExpiringSoon={isExpiringSoon}
                                formatRemainingTime={formatRemainingTime}
                            />

                            <button
                                type="button"
                                disabled={
                                    loading ||
                                    isLimitReached ||
                                    isExpired ||
                                    selectedFiles.length === 0

                                }
                                onClick={handleDownload}
                                className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-gray-600"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                        Preparing download...
                                    </>
                                ) : isExpired ? (
                                    <>
                                        <Clock3 size={18} />
                                        Transfer expired
                                    </>
                                ) : isLimitReached ? (
                                    <>
                                        <Download size={18} />
                                        Download limit reached
                                    </>
                                ) : selectedFiles.length === 0 ? (
                                    <>
                                        <Download size={18} />
                                        Select files to download
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />

                                        Download{" "}
                                        {selectedFiles.length === 1
                                            ? "file"
                                            : `${selectedFiles.length} files`}

                                        <ArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>

                            <div className="mt-5 flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-600 sm:flex-row sm:gap-4">
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck size={13} />
                                    Private transfer
                                </span>

                                <span className="hidden h-1 w-1 rounded-full bg-gray-700 sm:block" />

                                <span className="flex items-center gap-1.5">
                                    <Clock3 size={13} />
                                    Temporary access
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => {
                                setTransferInfo(null);
                                setKey("");
                            }}
                            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm text-gray-500 transition-all hover:bg-white/[0.06] hover:text-gray-200"
                        >
                            <RefreshCw size={15} />
                            Check another transfer
                        </button>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-700">
                        Files are only available while this transfer is active.
                    </p>
                </div>
            )}
        </div>
    );
}