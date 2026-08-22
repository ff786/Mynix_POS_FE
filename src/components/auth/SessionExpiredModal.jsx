import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Clock3,
    LogIn,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";


function SessionExpiredModal() {

    const [open, setOpen] =
        useState(false);

    const handledRef =
        useRef(false);

    const navigate =
        useNavigate();

    const { logout } =
        useAuth();


    useEffect(() => {

        function handleSessionExpired() {

            /*
             * Prevent several simultaneous 401
             * responses from opening multiple
             * session dialogs.
             */
            if (handledRef.current) {
                return;
            }

            handledRef.current = true;

            /*
             * Clear the React authentication state.
             *
             * api.js has already removed the JWT
             * from localStorage.
             */
            logout();

            setOpen(true);
        }


        window.addEventListener(
            "mynix:session-expired",
            handleSessionExpired
        );


        return () => {

            window.removeEventListener(
                "mynix:session-expired",
                handleSessionExpired
            );

        };

    }, [logout]);


    function handleLoginAgain() {

        setOpen(false);

        handledRef.current = false;

        navigate("/login", {
            replace: true,
        });
    }


    if (!open) {
        return null;
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-slate-950/45
                px-4
                backdrop-blur-sm
            "
        >

            {/* Modal */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="session-expired-title"
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_80px_rgba(15,23,42,0.25)]
                "
            >

                {/* Header */}

                <div className="
                    flex
                    items-center
                    justify-center
                    bg-slate-50
                    px-6
                    pb-7
                    pt-8
                ">

                    <div className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-amber-50
                        ring-8
                        ring-amber-50/60
                    ">

                        <Clock3
                            size={30}
                            strokeWidth={2}
                            className="
                                text-amber-600
                            "
                        />

                    </div>

                </div>


                {/* Content */}

                <div className="
                    px-6
                    pb-6
                    pt-6
                    text-center
                    sm:px-8
                ">

                    <p className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.24em]
                        text-emerald-600
                    ">
                        MYNIX POS
                    </p>


                    <h2
                        id="session-expired-title"
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Session Expired
                    </h2>


                    <p className="
                        mx-auto
                        mt-3
                        max-w-sm
                        text-sm
                        leading-6
                        text-slate-500
                    ">
                        Your login session has
                        expired for security reasons.
                        Please sign in again to
                        continue using MYNIX POS.
                    </p>


                    <div className="
                        mt-5
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-left
                    ">

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <div className="
                                mt-0.5
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-slate-500
                                shadow-sm
                            ">
                                <Clock3
                                    size={15}
                                />
                            </div>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="
                    border-t
                    border-slate-100
                    bg-white
                    px-6
                    py-5
                    sm:px-8
                ">

                    <button
                        type="button"
                        onClick={
                            handleLoginAgain
                        }
                        className="
                            flex
                            min-h-12
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-emerald-600
                            px-5
                            text-sm
                            font-bold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-emerald-700
                            active:scale-[0.99]
                            focus:outline-none
                            focus:ring-4
                            focus:ring-emerald-500/15
                        "
                    >

                        <LogIn
                            size={17}
                        />

                        Login Again

                    </button>


                    <p className="
                        mt-3
                        text-center
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-slate-300
                    ">
                        The Signature of Perfection
                    </p>

                </div>

            </div>

        </div>
    );
}


export default SessionExpiredModal;