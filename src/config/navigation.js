import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    FolderTree,
    Receipt,
    Users,
} from "lucide-react";

export const navigation = [

    {
        path: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        roles: ["ADMIN", "CASHIER"],
    },

    {
        path: "/pos",
        icon: ShoppingCart,
        label: "New Sale",
        roles: ["ADMIN", "CASHIER"],
    },

    {
        path: "/products",
        icon: Package,
        label: "Products",
        roles: ["ADMIN"],
    },

    {
        path: "/categories",
        icon: FolderTree,
        label: "Categories",
        roles: ["ADMIN"],
    },
    {
        path: "/staff",
        icon: Users,
        label: "Staff",
        roles: ["ADMIN"],
    },
    {
        path: "/sales",
        icon: Receipt,
        label: "Sales",
        roles: ["ADMIN", "CASHIER"],
    },
    {
        path: "/customers",
        icon: Users,
        label: "Customers",
        roles: ["ADMIN", "CASHIER"],
    },

];