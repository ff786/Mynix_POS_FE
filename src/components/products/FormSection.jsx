/** A titled group of fields inside the product form. */
function FormSection({
                         icon: Icon,
                         title,
                         description,
                         action,
                         children,
                     }) {

    return (

        <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">

            <div className="mb-5 flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                    {Icon && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <Icon size={18} className="text-slate-600" />
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            {title}
                        </h3>

                        {description && (
                            <p className="mt-0.5 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>

                </div>

                {action}

            </div>

            {children}

        </section>
    );
}

export default FormSection;
