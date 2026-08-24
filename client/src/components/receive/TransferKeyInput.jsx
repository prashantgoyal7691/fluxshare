import {
    ArrowRight,
    Clock3,
    FileArchive,
    KeyRound,
    Search,
    ShieldCheck,
} from "lucide-react";

export default function TransferKeyInput({
    keyValue,
    setKey,
    onSubmit,
    loading,
}) {
    return (
        <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#12151A]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_55%)]" />

                <div className="relative px-5 py-10 text-center sm:px-10 sm:py-12">
                    <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] border border-white/[0.08] bg-white/[0.04] text-gray-300">
                        <FileArchive size={30} strokeWidth={1.8} />
                    </div>

                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
                        Secure file transfer
                    </p>

                    <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Receive your files
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                        Enter the transfer key someone shared with you
                        to access their files.
                    </p>

                    <div className="mx-auto mt-8 max-w-xl">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0E1116] px-4 py-2.5 transition-all focus-within:border-white/[0.18] focus-within:bg-white/[0.035] sm:px-5">
                            <KeyRound
                                size={19}
                                className="shrink-0 text-gray-500"
                            />

                            <input
                                type="text"
                                value={keyValue}
                                onChange={(event) =>
                                    setKey(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        onSubmit();
                                    }
                                }}
                                placeholder="Enter transfer key"
                                className="w-full bg-transparent py-2.5 text-base font-medium tracking-[0.12em] text-white outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-600"
                                autoComplete="off"
                                spellCheck="false"
                            />

                            {keyValue && (
                                <button
                                    type="button"
                                    onClick={() => setKey("")}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="group mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-gray-600"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                    Checking transfer...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    Find transfer

                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-gray-400">
                                <ShieldCheck size={18} />
                            </div>

                            <p className="text-sm font-medium text-white">
                                Private access
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-600">
                                Only someone with the transfer key can access
                                these files.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-gray-400">
                                <Clock3 size={18} />
                            </div>

                            <p className="text-sm font-medium text-white">
                                Temporary access
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-600">
                                Transfers automatically become unavailable
                                after expiration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-700">
                The transfer key is case-sensitive.
            </p>
        </div>
    );
}