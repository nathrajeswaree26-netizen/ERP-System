import { useEffect, useState } from "react";
import api from "../services/api";

function SalesOrders() {
    const [salesOrders, setSalesOrders] = useState([]);
    const [quotations, setQuotations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [confirming, setConfirming] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [quotationId, setQuotationId] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* ================================
       LOAD ORDERS
    ================================= */

    const loadSalesOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/sales-orders");

            let data = [];

            if (Array.isArray(response.data)) {
                data = response.data;
            } else if (
                Array.isArray(
                    response.data.salesOrders
                )
            ) {
                data =
                    response.data.salesOrders;
            } else if (
                Array.isArray(
                    response.data.sales_orders
                )
            ) {
                data =
                    response.data.sales_orders;
            }

            setSalesOrders(data);

        } catch (err) {
            console.error(err);

            setSalesOrders([]);

            setError(
                err.response?.data?.message ||
                "Failed to load sales orders."
            );
        } finally {
            setLoading(false);
        }
    };


    /* ================================
       LOAD QUOTATIONS
    ================================= */

    const loadQuotations = async () => {
        try {
            const response =
                await api.get("/quotations");

            let data = [];

            if (Array.isArray(response.data)) {
                data = response.data;
            } else if (
                Array.isArray(
                    response.data.quotations
                )
            ) {
                data =
                    response.data.quotations;
            }

            setQuotations(data);

        } catch (err) {
            console.error(err);
            setQuotations([]);
        }
    };


    useEffect(() => {
        loadSalesOrders();
        loadQuotations();
    }, []);


    /* ================================
       CREATE SALES ORDER
    ================================= */

    const handleCreate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!quotationId) {
            setError(
                "Please select an accepted quotation."
            );
            return;
        }

        try {
            setCreating(true);

            await api.post(
                "/sales-orders",
                {
                    quotation_id:
                        Number(quotationId)
                }
            );

            setSuccess(
                "Sales Order created successfully!"
            );

            setQuotationId("");
            setShowForm(false);

            await loadSalesOrders();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create Sales Order."
            );
        } finally {
            setCreating(false);
        }
    };


    /* ================================
       CONFIRM ORDER
    ================================= */

    const handleConfirm = async (id) => {

        const confirmed =
            window.confirm(
                `Confirm Sales Order #${id}? Inventory will be reserved.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setConfirming(id);
            setError("");
            setSuccess("");

            await api.patch(
                `/sales-orders/${id}/confirm`
            );

            setSuccess(
                `Sales Order #${id} confirmed and inventory reserved successfully.`
            );

            await loadSalesOrders();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to confirm Sales Order."
            );
        } finally {
            setConfirming(null);
        }
    };


    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const getCustomerName = (order) => {
        return (
            order.company_name ||
            order.customer_name ||
            `Customer #${order.customer_id || "-"}`
        );
    };


    const getStatusClass = (status) => {
        return String(
            status || "PENDING_CONFIRMATION"
        )
            .toLowerCase()
            .replaceAll("_", "-");
    };


    const acceptedQuotations =
        quotations.filter(
            (quotation) =>
                String(
                    quotation.status || ""
                ).toUpperCase() === "ACCEPTED"
        );


    return (
        <div className="erp-page">

            <main className="erp-content">

                {/* HEADER */}

                <section className="page-header">

                    <div>

                        <span className="eyebrow">
                            SALES / ORDER MANAGEMENT
                        </span>

                        <h1>
                            Sales Orders
                        </h1>

                        <p>
                            Convert accepted quotations
                            into confirmed sales orders.
                        </p>

                    </div>


                    <div className="stat-card">

                        <strong>
                            {salesOrders.length}
                        </strong>

                        <span>
                            Total Orders
                        </span>

                    </div>

                </section>


                {success && (
                    <div className="success-message">
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div className="error-box">
                        ⚠ {error}
                    </div>
                )}


                {/* CREATE CARD */}

                {!showForm && (

                    <section className="erp-card create-card">

                        <div>

                            <div className="card-icon">
                                🛒
                            </div>

                            <div>

                                <h2>
                                    Create Sales Order
                                </h2>

                                <p>
                                    Convert an accepted
                                    quotation into a Sales
                                    Order.
                                </p>

                            </div>

                        </div>


                        <button
                            className="primary-button"
                            onClick={() => {
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                                loadQuotations();
                            }}
                        >
                            + Create Sales Order
                        </button>

                    </section>
                )}


                {/* CREATE FORM */}

                {showForm && (

                    <section className="erp-card">

                        <div className="card-header">

                            <div>

                                <span className="eyebrow">
                                    NEW SALES ORDER
                                </span>

                                <h2>
                                    Convert Quotation
                                </h2>

                                <p>
                                    Only accepted quotations
                                    can be converted.
                                </p>

                            </div>


                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>


                        <form
                            onSubmit={handleCreate}
                        >

                            <div className="form-group">

                                <label>
                                    Accepted Quotation *
                                </label>

                                <select
                                    value={quotationId}
                                    onChange={(e) =>
                                        setQuotationId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Accepted Quotation
                                    </option>

                                    {acceptedQuotations.map(
                                        (quotation) => (

                                            <option
                                                key={
                                                    quotation.id
                                                }
                                                value={
                                                    quotation.id
                                                }
                                            >
                                                Quotation #
                                                {quotation.id}
                                                {" - "}
                                                {quotation.company_name ||
                                                    quotation.customer_name ||
                                                    `Customer #${quotation.customer_id}`}
                                                {" - ₹"}
                                                {Number(
                                                    quotation.total_amount ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2
                                                    }
                                                )}
                                            </option>

                                        )
                                    )}

                                </select>


                                {acceptedQuotations.length ===
                                    0 && (

                                    <small
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "8px",
                                            color:
                                                "#c2410c"
                                        }}
                                    >
                                        No accepted quotations
                                        are available.
                                    </small>

                                )}

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        creating ||
                                        !quotationId
                                    }
                                >
                                    {creating
                                        ? "Creating..."
                                        : "✓ Create Sales Order"}
                                </button>

                            </div>

                        </form>

                    </section>
                )}


                {/* LIST */}

                <section className="erp-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Sales Order List
                            </h2>

                            <p>
                                Track order confirmation
                                and inventory reservation.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={
                                loadSalesOrders
                            }
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading Sales Orders...
                            </h3>

                        </div>

                    ) : salesOrders.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🛒
                            </div>

                            <h3>
                                No Sales Orders Found
                            </h3>

                            <p>
                                Create a Sales Order from
                                an accepted quotation.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>CUSTOMER</th>
                                        <th>QUOTATION</th>
                                        <th>TOTAL</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {salesOrders.map(
                                        (order) => (

                                            <tr
                                                key={
                                                    order.id
                                                }
                                            >

                                                <td>
                                                    <strong className="id-text">
                                                        #
                                                        {
                                                            order.id
                                                        }
                                                    </strong>
                                                </td>


                                                <td>
                                                    <strong>
                                                        {getCustomerName(
                                                            order
                                                        )}
                                                    </strong>
                                                </td>


                                                <td>
                                                    #
                                                    {
                                                        order.quotation_id ||
                                                        "-"
                                                    }
                                                </td>


                                                <td>
                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            order.total_amount ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits:
                                                                    2
                                                            }
                                                        )}
                                                    </strong>
                                                </td>


                                                <td>

                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {
                                                            order.status ||
                                                            "PENDING_CONFIRMATION"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {String(
                                                        order.status
                                                    ).toUpperCase() ===
                                                        "PENDING_CONFIRMATION" ? (

                                                        <button
                                                            className="small-success-button"
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    order.id
                                                                )
                                                            }
                                                            disabled={
                                                                confirming ===
                                                                order.id
                                                            }
                                                        >
                                                            {confirming ===
                                                            order.id
                                                                ? "Confirming..."
                                                                : "Confirm & Reserve"}
                                                        </button>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                color:
                                                                    "#7a8494",
                                                                fontSize:
                                                                    "12px"
                                                            }}
                                                        >
                                                            No action
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default SalesOrders;