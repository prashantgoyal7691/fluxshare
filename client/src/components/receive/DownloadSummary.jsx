export default function DownloadSummary({
    selectedCount,
    selectedSize,
    totalFiles,
    formatSize,
}) {
    return (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-medium text-gray-300">
                    {selectedCount}{" "}
                    {selectedCount === 1 ? "file" : "files"} selected
                </p>

                <p className="mt-1 text-xs text-gray-600">
                    {formatSize(selectedSize)}
                </p>
            </div>

            <div className="text-xs text-gray-600">
                {selectedCount === totalFiles
                    ? "All files selected"
                    : `${totalFiles - selectedCount} not selected`}
            </div>
        </div>
    );
}