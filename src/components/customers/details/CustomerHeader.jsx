import {
    ArrowLeft,
    Pencil,
    Phone,
    UserRound,
} from "lucide-react";

function CustomerHeader({
    customer,
    onBack,
    onEdit,
}) {

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-lg font-bold text-emerald-700">
                        {customer.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div>

                        <h1 className="text-xl font-bold text-slate-900">
                            {customer.name}
                        </h1>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <Phone size={14} />
                            {customer.contactNumber}
                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                    <Pencil size={16} />
                    Edit Customer
                </button>

            </div>

        </div>
    );
}

export default CustomerHeader;
