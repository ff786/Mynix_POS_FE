import {
    CalendarDays,
    Check,
    RefreshCw,
    Search,
    X,
} from "lucide-react";

function SalesToolbar({
                          search,
                          setSearch,
                          selectedDate,
                          setSelectedDate,
                          onClearSearch,
                          onRefresh,
                          refreshing,
                      }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <CalendarDays size={20} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Sales History
                        </h1>

                        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                            Review transactions, payments and receipts
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="relative">
                    <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search invoice, customer or payment..."
                        autoComplete="off"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            aria-label="Clear search"
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                <div className="relative md:w-56">
                    <CalendarDays size={16} className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" />

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                </div>
            </div>

            {selectedDate && (
                <div className="mt-3 flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                        <Check size={15} className="shrink-0 text-emerald-600" />

                        <p className="truncate text-xs font-semibold text-emerald-800">
                            Showing sales for {formatDateLabel(selectedDate)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedDate("")}
                        className="inline-flex min-h-8 w-fit items-center gap-1 rounded-lg px-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                        Remove
                        <X size={13} />
                    </button>
                </div>
            )}
        </section>
    );
}

function formatDateLabel(value) {
    if (!value) {
        return "";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default SalesToolbar;