import { Check, File, Image, Video } from "lucide-react";

export default function FileListItem({
    file,
    isSelected,
    onToggle,
    formatSize,
}) {
    const getFileIcon = () => {
        const type = file?.mimeType || file?.contentType || "";

        if (type.startsWith("image")) {
            return <Image size={19} />;
        }

        if (type.startsWith("video")) {
            return <Video size={19} />;
        }

        return <File size={19} />;
    };

    return (
        <button
            type="button"
            onClick={() => onToggle(file.id)}
            className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-1 text-left transition-all ${
                isSelected
                    ? "border-white/[0.14] bg-white/[0.06]"
                    : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.1] hover:bg-white/[0.045]"
            }`}
        >
            <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md transition-all ${
                    isSelected
                        ? "bg-white text-black"
                        : "border border-white/[0.15] text-transparent"
                }`}
            >
                {isSelected && <Check size={13} strokeWidth={3} />}
            </div>

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-gray-400">
                {getFileIcon()}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-200">
                    {file.fileName}
                </p>

                <p className="mt-0.5 text-xs text-gray-600">
                    {formatSize(file.fileSize)}
                </p>
            </div>

            <div
                className={`text-xs transition-colors ${
                    isSelected ? "text-gray-300" : "text-gray-700"
                }`}
            >
                {isSelected ? "Selected" : "Ready"}
            </div>
        </button>
    );
}