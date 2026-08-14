function StatCard({title, value, icon, color}) {

    const Icon = icon;

    return (

        <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-slate-500">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div className={`p-4 rounded-xl ${color}`}>

                    <Icon className="text-white" size={24} />

                </div>

            </div>

        </div>

    );

}

export default StatCard;