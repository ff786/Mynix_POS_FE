function DashboardHeader() {

    return (

        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Here's what's happening with your business today.
                </p>
            </div>
        </div>
    );
}

export default DashboardHeader;