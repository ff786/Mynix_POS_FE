import {
    ReceiptText,
    Search,
    RefreshCw,
    X,
    CalendarDays,
} from "lucide-react";

function SalesToolbar({
                          search,
                          setSearch,
                          selectedDate,
                          setSelectedDate,
                          onRefresh,
                          refreshing,
                      }) {

    function clearSearch() {
        setSearch("");
    }

    function clearDate() {
        setSelectedDate("");
    }

    return (
        <section className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            sm:p-5
            lg:p-6
        ">

            <div className="
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">

                {/* Heading */}

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                    ">

                        <ReceiptText
                            size={20}
                            className="text-emerald-600"
                        />

                    </div>

                    <div className="min-w-0">

                        <h1 className="
                            truncate
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-2xl
                        ">
                            Sales History
                        </h1>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                            sm:text-sm
                        ">
                            Review previous transactions
                            and receipts
                        </p>

                    </div>

                </div>

                {/* Controls */}

                <div className="
                    flex
                    w-full
                    flex-col
                    gap-2
                    sm:flex-row
                    lg:w-auto
                ">

                    {/* Search */}

                    <div className="
                        relative
                        w-full
                        sm:min-w-[280px]
                        lg:w-80
                    ">

                        <Search
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                Search invoice or customer...
                            "
                            autoComplete="off"
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-10
                                pr-10
                                text-sm
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:bg-white
                                focus:ring-4
                                focus:ring-emerald-500/10
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="
                                    absolute
                                    right-2
                                    top-1/2
                                    flex
                                    h-8
                                    w-8
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                "
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}

                    </div>

                    {/* Date */}

                    <div className="
                        relative
                        w-full
                        sm:w-auto
                    ">

                        <CalendarDays
                            size={16}
                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) =>
                                setSelectedDate(
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-10
                                pr-3
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                focus:border-emerald-500
                                focus:bg-white
                                focus:ring-4
                                focus:ring-emerald-500/10
                                sm:w-44
                            "
                        />

                        {selectedDate && (
                            <button
                                type="button"
                                onClick={clearDate}
                                className="
                                    absolute
                                    right-1.5
                                    top-1/2
                                    flex
                                    h-8
                                    w-8
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                "
                                aria-label="Clear date"
                            >
                                <X size={14} />
                            </button>
                        )}

                    </div>

                    {/* Refresh */}

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="
                            inline-flex
                            h-11
                            w-full
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                            active:scale-[0.98]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:w-auto
                        "
                    >

                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span>
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </span>

                    </button>

                </div>

            </div>

        </section>
    );
}

export default SalesToolbar;