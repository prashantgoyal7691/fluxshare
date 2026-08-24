import { Check, Copy, Share2 } from "lucide-react";

export default function TransferReady({
    uploadData,
    shareLink,
    copied,
    expiry,
    maxDownloads,
    onCopyKey,
    onCopyLink,
    onShare,
    onCreateAnother,
}) {
    return (
        <div className="py-6">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    <Check size={28} />
                </div>

                <p className="text-sm font-medium text-green-400">
                    Transfer ready
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    Your files are ready to share
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Share the key or link below with the person who needs
                    the files.
                </p>

                <div className="mt-8 rounded-[22px] border border-white/[0.08] bg-[#12151A] p-5">
                    <p className="mb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                        Secret key
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1 rounded-xl bg-white/[0.05] px-4 py-4 text-center font-mono text-xl font-semibold tracking-[0.15em] text-white sm:text-2xl">
                            {uploadData.key}
                        </div>

                        <button
                            type="button"
                            onClick={onCopyKey}
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                                copied
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {copied ? (
                                <Check size={19} />
                            ) : (
                                <Copy size={19} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-3 rounded-[22px] border border-white/[0.08] bg-[#12151A] p-5 text-left">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-600">
                        Share link
                    </p>

                    <p className="break-all rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-gray-400">
                        {shareLink}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={onCopyLink}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-medium text-gray-300 transition-all hover:bg-white/[0.08] hover:text-white"
                        >
                            <Copy size={16} />
                            Copy link
                        </button>

                        <button
                            type="button"
                            onClick={onShare}
                            className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-gray-200"
                        >
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-6 text-xs text-gray-600">
                    <span>
                        Expires in{" "}
                        {expiry === 1440
                            ? "24 hours"
                            : expiry >= 60
                                ? `${expiry / 60} hour`
                                : `${expiry} min`}
                    </span>

                    <span>
                        {maxDownloads} downloads allowed
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onCreateAnother}
                    className="mt-8 text-sm text-gray-500 transition-colors hover:text-white"
                >
                    Create another transfer
                </button>
            </div>
        </div>
    );
}