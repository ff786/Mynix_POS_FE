function StatCard({
                      title,
                      value,
                      icon: Icon,
                      color,
                  }) {

    return (

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        {value}
                    </h3>
                </div>
                <div
                    className={`
                        ${color}
                        w-11 h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-white
                    `}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

export default StatCard;