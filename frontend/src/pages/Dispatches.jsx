import { useEffect, useState } from "react";
import api from "../services/api";

function Dispatches() {
    const [dispatches, setDispatches] = useState([]);
    const [salesOrders, setSalesOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [salesOrderId, setSalesOrderId] = useState("");
    const [trackingNumber, setTrackingNumber] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* ================================
       LOAD DISPATCHES
    ================================= */

    const loadDispatches = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/dispatches");

            console.log(
                "Dispatches API:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setDispatches(response.data);
            } else if (
                Array.isArray(
                    response.data.dispatches
                )
            ) {
                setDispatches(
                    response.data.dispatches
                );
            } else {
                setDispatches([]);
            }

        } catch (err) {
            console.error(err);

            setDispatches([]);

            setError(
                err.response?.data?.message ||
                "Failed to load dispatches."
            );
        } finally {
            setLoading(false);
        }
    };


    /* ================================
       LOAD SALES ORDERS
    ================================= */

    const loadSalesOrders = async () => {
        try {

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

            setSalesOrders(
                data.filter(
                    (order) =>
                        String(
                            order.status || ""
                        ).toUpperCase() ===
                        "CONFIRMED"
                )
            );

        } catch (err) {
            console.error(err);
            setSalesOrders([]);
        }
    };


    useEffect(() => {
        loadDispatches();
        loadSalesOrders();
    }, []);


    /* ================================
       PROCESS DISPATCH
    ================================= */

    const handleDispatch = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!salesOrderId) {
            setError(
                "Please select a confirmed Sales Order."
            );
            return;
        }

        if (!trackingNumber.trim()) {
            setError(
                "Please enter a tracking number."
            );
            return;
        }

        try {
            setProcessing(true);

            await api.post(
                "/dispatches",
                {
                    sales_order_id:
                        Number(salesOrderId),

                    tracking_number:
                        trackingNumber.trim()
                }
            );

            setSuccess(
                `Sales Order #${salesOrderId} dispatched successfully.`
            );

            setSalesOrderId("");
            setTrackingNumber("");

            setShowForm(false);

            await loadDispatches();
            await loadSalesOrders();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to process dispatch."
            );
        } finally {
            setProcessing(false);
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


    return (
        <div className="erp-page">

            <main className="erp-content">

                {/* HEADER */}

                <section className="page-header">

                    <div>

                        <span className="eyebrow">
                            LOGISTICS / DISPATCH
                        </span>

                        <h1>
                            Dispatch Management
                        </h1>

                        <p>
                            Process final deliveries for
                            confirmed Sales Orders.
                        </p>

                    </div>


                    <div className="stat-card">

                        <strong>
                            {dispatches.length}
                        </strong>

                        <span>
                            Total Dispatches
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


                {/* CREATE DISPATCH */}

                {!showForm && (

                    <section className="erp-card create-card">

                        <div>

                            <div className="card-icon">
                                🚚
                            </div>

                            <div>

                                <h2>
                                    Process New Dispatch
                                </h2>

                                <p>
                                    Select a confirmed Sales
                                    Order and enter its
                                    tracking number.
                                </p>

                            </div>

                        </div>


                        <button
                            className="primary-button"
                            onClick={() => {
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                                loadSalesOrders();
                            }}
                        >
                            + Process Dispatch
                        </button>

                    </section>
                )}


                {/* FORM */}

                {showForm && (

                    <section className="erp-card">

                        <div className="card-header">

                            <div>

                                <span className="eyebrow">
                                    NEW DISPATCH
                                </span>

                                <h2>
                                    Process Delivery
                                </h2>

                                <p>
                                    Only confirmed Sales
                                    Orders can be dispatched.
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
                            onSubmit={
                                handleDispatch
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Confirmed Sales Order *
                                </label>

                                <select
                                    value={
                                        salesOrderId
                                    }
                                    onChange={(e) =>
                                        setSalesOrderId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Sales Order
                                    </option>

                                    {salesOrders.map(
                                        (order) => (

                                            <option
                                                key={
                                                    order.id
                                                }
                                                value={
                                                    order.id
                                                }
                                            >
                                                Order #
                                                {order.id}
                                                {" - "}
                                                {order.company_name ||
                                                    order.customer_name ||
                                                    `Customer #${order.customer_id}`}
                                                {" - ₹"}
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
                                            </option>

                                        )
                                    )}

                                </select>


                                {salesOrders.length ===
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
                                        No confirmed Sales
                                        Orders are available
                                        for dispatch.
                                    </small>

                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Tracking Number *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        trackingNumber
                                    }
                                    onChange={(e) =>
                                        setTrackingNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: FR-2026-0001"
                                    required
                                />

                            </div>


                            <div className="dispatch-info">

                                <div className="dispatch-info-icon">
                                    🔒
                                </div>

                                <div>

                                    <strong>
                                        Inventory Reservation
                                    </strong>

                                    <p>
                                        This dispatch will mark
                                        the Sales Order as
                                        DISPATCHED and release
                                        its reserved inventory.
                                    </p>

                                </div>

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
                                        processing ||
                                        !salesOrderId ||
                                        !trackingNumber.trim()
                                    }
                                >
                                    {processing
                                        ? "Processing..."
                                        : "🚚 Process Dispatch"}
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
                                Dispatch History
                            </h2>

                            <p>
                                All completed deliveries.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={() => {
                                loadDispatches();
                                loadSalesOrders();
                            }}
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
                                Loading Dispatches...
                            </h3>

                        </div>

                    ) : dispatches.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🚚
                            </div>

                            <h3>
                                No Dispatches Found
                            </h3>

                            <p>
                                Confirm a Sales Order and
                                process its delivery.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            SALES ORDER
                                        </th>

                                        <th>
                                            TRACKING NUMBER
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            DISPATCH DATE
                                        </th>

                                        <th>
                                            CREATED
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {dispatches.map(
                                        (dispatch) => (

                                            <tr
                                                key={
                                                    dispatch.id
                                                }
                                            >

                                                <td>
                                                    <strong className="id-text">
                                                        #
                                                        {
                                                            dispatch.id
                                                        }
                                                    </strong>
                                                </td>


                                                <td>
                                                    <strong>
                                                        #
                                                        {
                                                            dispatch.sales_order_id ||
                                                            "-"
                                                        }
                                                    </strong>
                                                </td>


                                                <td>

                                                    <span className="tracking-number">
                                                        🚚{" "}
                                                        {
                                                            dispatch.tracking_number ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="status-badge dispatched">
                                                        {
                                                            dispatch.status ||
                                                            "DISPATCHED"
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {formatDate(
                                                        dispatch.dispatch_date
                                                    )}
                                                </td>


                                                <td>
                                                    {formatDate(
                                                        dispatch.created_at
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

export default Dispatches;