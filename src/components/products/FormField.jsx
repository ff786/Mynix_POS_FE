function FormField({
                       label,
                       required,
                       hint,
                       htmlFor,
                       children,
                   }) {

    return (

        <div>

            <label
                htmlFor={htmlFor}
                className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-slate-700
                "
            >

                {label}

                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}

            </label>

            {children}

            {hint && (
                <p className="mt-2 text-xs text-slate-400">
                    {hint}
                </p>
            )}

        </div>
    );
}

export default FormField;
