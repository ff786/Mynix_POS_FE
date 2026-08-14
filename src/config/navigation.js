import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    FolderTree,
    Receipt,
} from "lucide-react";

export const navigation = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "New Sale",
        path: "/pos",
        icon: ShoppingCart,
    },
    {
        label: "Products",
        path: "/products",
        icon: Package,
    },
    {
        label: "Categories",
        path: "/categories",
        icon: FolderTree,
    },
    {
        label: "Sales",
        path: "/sales",
        icon: Receipt,
    },
];