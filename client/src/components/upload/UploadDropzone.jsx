import { Plus, UploadCloud } from "lucide-react";

export default function UploadDropzone({
    getRootProps,
    getInputProps,
    isDragActive,
    open,
}) {
    return (
        <div
            {...getRootProps()}
            className={`group relative overflow-hidden rounded-[24px] border transition-all duration-300 ${
                isDragActive
                    ? "border-violet-400/60 bg-violet-500/[0.08] shadow-xl shadow-violet-500/[0.08]"
                    : "border-white/[0.08] bg-[#12151A] hover:border-white/[0.14]"
            }`}
        >
            <input {...getInputProps()} />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_55%)]" />

            <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
                <div
                    className={`mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] border transition-all duration-300 ${
                        isDragActive
                            ? "scale-105 border-violet-400/40 bg-violet-500/15 text-violet-300"
                            : "border-white/[0.08] bg-white/[0.04] text-gray-300 group-hover:border-white/[0.14] group-hover:bg-white/[0.06] group-hover:text-white"
                    }`}
                >
                    <UploadCloud size={30} strokeWidth={1.8} />
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {isDragActive
                        ? "Drop your files here"
                        : "Upload files to share"}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Drag and drop files here, browse your device, or paste
                    files directly with{" "}
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-gray-400">
                        ⌘V
                    </span>
                </p>

                <button
                    type="button"
                    onClick={open}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.97]"
                >
                    <Plus size={17} />
                    Choose files
                </button>

                <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
                    <span className="h-1 w-1 rounded-full bg-gray-700" />
                    Multiple files supported
                    <span className="h-1 w-1 rounded-full bg-gray-700" />
                    Drag & drop supported
                </div>
            </div>
        </div>
    );
}