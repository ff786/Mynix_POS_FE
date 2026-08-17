import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import Staff from "./pages/Staff";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import PublicInvoice from "@/pages/invoice/PublicInvoice";


import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {

    return (

        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/invoice/:token"
                element={<PublicInvoice />}
            />
            <Route
                element={
                    <ProtectedRoute
                        roles={["ADMIN", "CASHIER"]}
                    >
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/pos"
                    element={<POS />}
                />
                <Route
                    path="/sales"
                    element={<Sales />}
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <Products />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <Categories />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <Staff />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers/:id"
                    element={
                        <ProtectedRoute>
                            <CustomerDetails />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
        </Routes>
    );
}