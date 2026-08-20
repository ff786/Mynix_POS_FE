function StatCard({title, value, icon: Icon, color, onClick, ...props})

{
    const clickable = typeof onClick === "function";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!clickable}
            className={`group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 ${
                clickable
                    ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                    : "cursor-default"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h3>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 ${color} ${
                        clickable ? "group-hover:scale-105" : ""
                    }`}
                >
                    <Icon size={21} />
                </div>
            </div>

            {clickable && (
                <div className="mt-4 text-xs font-medium text-slate-400 transition-colors group-hover:text-emerald-600">
                    View details →
                </div>
            )}
        </button>
    );
}

export default StatCard;