import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    return (
        <div className="dashboard-container">

            {/* =====================================
                DASHBOARD HEADER
            ===================================== */}

            <header className="dashboard-header">

                <h1>
                    Fundsroom ERP
                </h1>

                <p>
                    Enterprise Resource Planning System
                </p>

            </header>


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="dashboard-content">

                <h2>
                    Dashboard
                </h2>

                <p>
                    Welcome to the Fundsroom ERP System.
                    Manage your complete business workflow from one place.
                </p>


                {/* =====================================
                    MAIN MODULE CARDS
                ===================================== */}

                <div className="dashboard-cards">

                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/customers")
                        }
                    >
                        <h3>
                            👥 Customers
                        </h3>

                        <p>
                            Manage customer information,
                            contact details and business records.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/enquiries")
                        }
                    >
                        <h3>
                            📩 Enquiries
                        </h3>

                        <p>
                            Create and manage customer
                            enquiries and requested products.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/quotations")
                        }
                    >
                        <h3>
                            📄 Quotations
                        </h3>

                        <p>
                            Prepare quotations and manage
                            quotation status and pricing.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/sales-orders")
                        }
                    >
                        <h3>
                            🛒 Sales Orders
                        </h3>

                        <p>
                            Convert accepted quotations into
                            sales orders and process them.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/inventory")
                        }
                    >
                        <h3>
                            📦 Inventory
                        </h3>

                        <p>
                            Monitor available and reserved
                            stock for all products.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() =>
                            navigate("/dispatches")
                        }
                    >
                        <h3>
                            🚚 Dispatches
                        </h3>

                        <p>
                            Process confirmed sales orders
                            and manage final dispatches.
                        </p>
                    </div>

                </div>


                {/* =====================================
                    BUSINESS WORKFLOW
                ===================================== */}

                <section className="workflow-section">

                    <h2>
                        Business Workflow
                    </h2>

                    <p>
                        Track the complete business process
                        from enquiry to dispatch.
                    </p>


                    <div className="workflow-container">

                        <div className="workflow-step">

                            <div className="workflow-number">
                                1
                            </div>

                            <h3>
                                Customer Enquiry
                            </h3>

                            <p>
                                Create and manage enquiries
                            </p>

                        </div>


                        <div className="workflow-arrow">
                            →
                        </div>


                        <div className="workflow-step">

                            <div className="workflow-number">
                                2
                            </div>

                            <h3>
                                Quotation
                            </h3>

                            <p>
                                Prepare customer quotation
                            </p>

                        </div>


                        <div className="workflow-arrow">
                            →
                        </div>


                        <div className="workflow-step">

                            <div className="workflow-number">
                                3
                            </div>

                            <h3>
                                Sales Order
                            </h3>

                            <p>
                                Convert accepted quotation
                            </p>

                        </div>


                        <div className="workflow-arrow">
                            →
                        </div>


                        <div className="workflow-step">

                            <div className="workflow-number">
                                4
                            </div>

                            <h3>
                                Inventory
                            </h3>

                            <p>
                                Reserve available stock
                            </p>

                        </div>


                        <div className="workflow-arrow">
                            →
                        </div>


                        <div className="workflow-step">

                            <div className="workflow-number">
                                5
                            </div>

                            <h3>
                                Dispatch
                            </h3>

                            <p>
                                Process final delivery
                            </p>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    FEATURE INFORMATION
                ===================================== */}

                <div className="feature-grid">

                    <div className="feature-card">

                        <h3>
                            📦 Inventory Management
                        </h3>

                        <p>
                            Monitor available and reserved
                            inventory for your products.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>
                            🔐 Role Based Access
                        </h3>

                        <p>
                            Access to ERP operations is
                            controlled based on user roles.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>
                            📊 Order Management
                        </h3>

                        <p>
                            Manage enquiries, quotations,
                            sales orders and dispatches.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;