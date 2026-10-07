import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Enquiries from "./pages/Enquiries";
import Quotations from "./pages/Quotations";
import SalesOrders from "./pages/SalesOrders";
import Inventory from "./pages/Inventory";
import Dispatches from "./pages/Dispatches";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* =========================
                    DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    CUSTOMERS
                ========================= */}

                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Customers />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    ENQUIRIES
                ========================= */}

                <Route
                    path="/enquiries"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Enquiries />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    QUOTATIONS
                ========================= */}

                <Route
                    path="/quotations"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Quotations />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    SALES ORDERS
                ========================= */}

                <Route
                    path="/sales-orders"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <SalesOrders />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    INVENTORY
                ========================= */}

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Inventory />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    DISPATCHES
                ========================= */}

                <Route
                    path="/dispatches"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Dispatches />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    DEFAULT
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;