import { File, Image, Video, Plus, X } from "lucide-react";

export default function SelectedFiles({
    files,
    onRemoveFile,
    onClear,
    open,
    getTotalSize,
}) {
    const getFileIcon = (file) => {
        if (file.type?.startsWith("image")) {
            return <Image size={20} />;
        }

        if (file.type?.startsWith("video")) {
            return <Video size={20} />;
        }

        return <File size={20} />;
    };

    return (
        <div className="rounded-[24px] border border-white/[0.08] bg-[#12151A] p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                            Selected files
                        </h3>

                        <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-gray-400">
                            {files.length}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        {getTotalSize()} total
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={open}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-300 transition-all hover:bg-white/[0.08] hover:text-white"
                    >
                        <Plus size={16} />
                        Add files
                    </button>

                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-400 transition-all hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-red-400"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                {files.map((file, index) => (
                    <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 transition-all hover:bg-white/[0.045]"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-gray-400">
                            {getFileIcon(file)}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-200">
                                {file.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemoveFile(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remove ${file.name}`}
                        >
                            <X size={17} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}