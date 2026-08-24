import { CheckSquare } from "lucide-react";
import FileListItem from "./FileListItem";

export default function FileList({
    files,
    selectedFiles,
    onToggle,
    onSelectAll,
    onClear,
    formatSize,
}) {
    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-200">
                        Shared files
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                        Choose the files you want to download
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onSelectAll}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-white/[0.05] hover:text-gray-300"
                    >
                        <CheckSquare size={14} />
                        Select all
                    </button>

                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-lg px-2.5 py-1.5 text-xs text-gray-600 transition-colors hover:bg-white/[0.05] hover:text-gray-300"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {files.map((file, index) => (
                    <FileListItem
                        key={`${file.id}-${index}`}
                        file={file}
                        isSelected={selectedFiles.includes(file.id)}
                        onToggle={onToggle}
                        formatSize={formatSize}
                    />
                ))}
            </div>
        </div>
    );
}