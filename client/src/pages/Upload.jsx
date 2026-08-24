import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowRight } from "lucide-react";
import UploadDropzone from "../components/upload/UploadDropzone";
import SelectedFiles from "../components/upload/SelectedFiles";
import UploadOptions from "../components/upload/UploadOptions";
import TransferReady from "../components/upload/TransferReady";
import toast from "react-hot-toast";
import { uploadFiles } from "../services/fileService";
import { formatTotalFileSize } from "../utils/fileUtils";

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

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFiles((prev) => [...prev, ...acceptedFiles]);
            setUploadData(null);
            setUploadProgress(0);
        }
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        multiple: true,
        noClick: true,
        noKeyboard: true,
        noDragEventsBubbling: true,
    });

    useEffect(() => {
        const handlePaste = (event) => {
            const pastedFiles = event.clipboardData.files;

            if (pastedFiles.length === 0) return;

            setFiles((prev) => {
                const newFiles = Array.from(pastedFiles);

                const uniqueFiles = newFiles.filter(
                    (newFile) =>
                        !prev.some(
                            (existingFile) =>
                                existingFile.name === newFile.name &&
                                existingFile.size === newFile.size &&
                                existingFile.lastModified === newFile.lastModified,
                        ),
                );

                return [...prev, ...uniqueFiles];
            });

            setUploadData(null);
            setUploadProgress(0);
        };

        window.addEventListener("paste", handlePaste);

        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    const removeFile = (index) => {
        setFiles((prev) =>
            prev.filter((_, fileIndex) => fileIndex !== index),
        );

        setUploadData(null);
        setUploadProgress(0);
    };

    const clearSelection = () => {
        setFiles([]);
        setUploadData(null);
        setUploadProgress(0);
        setCopied(false);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select files");
            return;
        }

        try {
            setLoading(true);
            setUploadProgress(0);

            const data = await uploadFiles(
                files,
                expiry,
                maxDownloads,
                (progressEvent) => {
                    if (!progressEvent.total) return;

                    const percent = Math.round(
                        (progressEvent.loaded * 100) /
                        progressEvent.total,
                    );

                    setUploadProgress(percent);
                },
            );

            setUploadData(data);

            try {
                await navigator.clipboard.writeText(data.key);
                setCopied(true);
            } catch {
                setCopied(false);
            }

            toast.success("Transfer created successfully");

            setUploadProgress(100);
            setLoading(false);
        } catch (error) {
            console.error("Upload error:", error);

            setLoading(false);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Upload failed");
            }
        }
    };

    const copyKey = async () => {
        if (!uploadData?.key) return;

        try {
            await navigator.clipboard.writeText(uploadData.key);

            setCopied(true);

            toast.success("Key copied");

            setTimeout(() => {
                setCopied(false);
            }, 2500);
        } catch {
            toast.error("Unable to copy key");
        }
    };

    const copyLink = async () => {
        if (!shareLink) return;

        try {
            await navigator.clipboard.writeText(shareLink);
            toast.success("Link copied");
        } catch {
            toast.error("Unable to copy link");
        }
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
            } else {
                await navigator.clipboard.writeText(shareLink);
                toast.success("Link copied");
            }
        } catch (error) {
            console.log("Share cancelled:", error);
        }
    };

    return (
        <div className="space-y-8">
            {!uploadData ? (
                <>
                    <UploadDropzone
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        open={open}
                    />

                    {files.length > 0 && (
                        <SelectedFiles
                            files={files}
                            onRemoveFile={removeFile}
                            onClear={clearSelection}
                            open={open}
                            getTotalSize={() => formatTotalFileSize(files)}
                        />
                    )}

                    <UploadOptions
                        expiry={expiry}
                        setExpiry={setExpiry}
                        maxDownloads={maxDownloads}
                        setMaxDownloads={setMaxDownloads}
                    />

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-gray-600"
                    >
                        {loading ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                Uploading {uploadProgress}%
                            </>
                        ) : (
                            <>
                                Create transfer
                                <ArrowRight
                                    size={19}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>

                    {loading && (
                        <div>
                            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                                <span>Uploading files</span>
                                <span>{uploadProgress}%</span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-300"
                                    style={{
                                        width: `${uploadProgress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <TransferReady
                    uploadData={uploadData}
                    shareLink={shareLink}
                    copied={copied}
                    expiry={expiry}
                    maxDownloads={maxDownloads}
                    onCopyKey={copyKey}
                    onCopyLink={copyLink}
                    onShare={handleNativeShare}
                    onCreateAnother={clearSelection}
                />
            )}
        </div>
    );
}