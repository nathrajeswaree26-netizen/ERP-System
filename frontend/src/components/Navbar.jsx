import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <div className="navbar-logo">
                    F
                </div>

                <div>
                    <h2>Fundsroom ERP</h2>
                    <span>Enterprise Resource Planning</span>
                </div>
            </div>

            <div className="navbar-links">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    🏠 Dashboard
                </NavLink>

                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    👥 Customers
                </NavLink>

                <NavLink
                    to="/enquiries"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    📩 Enquiries
                </NavLink>

                <NavLink
                    to="/quotations"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    📄 Quotations
                </NavLink>

                <NavLink
                    to="/sales-orders"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    🛒 Sales Orders
                </NavLink>

                <NavLink
                    to="/inventory"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    📦 Inventory
                </NavLink>

                <NavLink
                    to="/dispatches"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    🚚 Dispatches
                </NavLink>

            </div>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </nav>
    );
}

export default Navbar;