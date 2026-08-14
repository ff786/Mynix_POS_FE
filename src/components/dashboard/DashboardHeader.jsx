function DashboardHeader() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    return (

        <div className="mb-8">

            <h1 className="text-3xl font-bold">

                {greeting}, Admin 👋

            </h1>

            <p className="text-slate-500 mt-2">

                Here's what's happening today.

            </p>

        </div>

    );

}

export default DashboardHeader;