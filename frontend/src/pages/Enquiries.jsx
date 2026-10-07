import { useEffect, useState } from "react";
import api from "../services/api";

function Enquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [customerId, setCustomerId] = useState("");

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1
        }
    ]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* =====================================================
       LOAD ENQUIRIES
    ===================================================== */

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/enquiries");

            console.log(
                "Enquiries API:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setEnquiries(response.data);
            } else if (
                Array.isArray(response.data.enquiries)
            ) {
                setEnquiries(
                    response.data.enquiries
                );
            } else {
                setEnquiries([]);

                setError(
                    "Invalid enquiry data received from server."
                );
            }

        } catch (err) {
            console.error(
                "Load enquiries error:",
                err
            );

            setEnquiries([]);

            setError(
                err.response?.data?.message ||
                "Failed to load enquiries."
            );
        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       LOAD CUSTOMERS
    ===================================================== */

    const loadCustomers = async () => {
        try {
            const response =
                await api.get("/customers");

            console.log(
                "Customers API:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else if (
                Array.isArray(response.data.customers)
            ) {
                setCustomers(
                    response.data.customers
                );
            } else {
                setCustomers([]);
            }

        } catch (err) {
            console.error(
                "Load customers error:",
                err
            );

            setCustomers([]);
        }
    };


    /* =====================================================
       LOAD PRODUCTS / INVENTORY
    ===================================================== */

    const loadProducts = async () => {
        try {
            const response =
                await api.get("/inventory");

            console.log(
                "Inventory API:",
                response.data
            );

            let data = [];

            if (Array.isArray(response.data)) {
                data = response.data;
            } else if (
                Array.isArray(response.data.inventory)
            ) {
                data = response.data.inventory;
            }

            setProducts(data);

        } catch (err) {
            console.error(
                "Load products error:",
                err
            );

            setProducts([]);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        loadEnquiries();
        loadCustomers();
        loadProducts();
    }, []);


    /* =====================================================
       ADD NEW ITEM
    ===================================================== */

    const addItem = () => {
        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1
            }
        ]);
    };


    /* =====================================================
       REMOVE ITEM
    ===================================================== */

    const removeItem = (index) => {

        if (items.length === 1) {
            return;
        }

        setItems(
            items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    /* =====================================================
       CHANGE ITEM
    ===================================================== */

    const handleItemChange = (
        index,
        field,
        value
    ) => {

        const updatedItems = [...items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        setItems(updatedItems);
    };


    /* =====================================================
       CREATE ENQUIRY
    ===================================================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!customerId) {
            setError(
                "Please select a customer."
            );

            return;
        }

        const validItems = items.filter(
            (item) =>
                item.product_id &&
                Number(item.quantity) > 0
        );

        if (validItems.length === 0) {
            setError(
                "Please add at least one product."
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                customer_id: Number(customerId),

                items: validItems.map((item) => ({
                    product_id:
                        Number(item.product_id),

                    quantity:
                        Number(item.quantity)
                }))
            };

            console.log(
                "Creating enquiry:",
                payload
            );

            await api.post(
                "/enquiries",
                payload
            );

            setSuccess(
                "Customer enquiry created successfully!"
            );

            setCustomerId("");

            setItems([
                {
                    product_id: "",
                    quantity: 1
                }
            ]);

            setShowForm(false);

            await loadEnquiries();

        } catch (err) {
            console.error(
                "Create enquiry error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create enquiry."
            );
        } finally {
            setSaving(false);
        }
    };


    /* =====================================================
       CANCEL FORM
    ===================================================== */

    const handleCancel = () => {

        setShowForm(false);

        setCustomerId("");

        setItems([
            {
                product_id: "",
                quantity: 1
            }
        ]);

        setError("");
    };


    /* =====================================================
       CUSTOMER NAME
    ===================================================== */

    const getCustomerName = (
        enquiry
    ) => {

        if (enquiry.company_name) {
            return enquiry.company_name;
        }

        if (enquiry.customer_name) {
            return enquiry.customer_name;
        }

        const customer = customers.find(
            (item) =>
                Number(item.id) ===
                Number(enquiry.customer_id)
        );

        return (
            customer?.company_name ||
            `Customer #${enquiry.customer_id || "-"}`
        );
    };


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    /* =====================================================
       RESET SUCCESS MESSAGE
    ===================================================== */

    const handleOpenForm = () => {

        setShowForm(true);

        setError("");
        setSuccess("");

        loadCustomers();
        loadProducts();
    };


    return (
        <div className="erp-page">

            <main className="erp-content">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="page-header">

                    <div>

                        <span className="eyebrow">
                            SALES / ENQUIRIES
                        </span>

                        <h1>
                            Customer Enquiries
                        </h1>

                        <p>
                            Create and manage customer
                            enquiries.
                        </p>

                    </div>


                    <div className="stat-card">

                        <strong>
                            {enquiries.length}
                        </strong>

                        <span>
                            Total Enquiries
                        </span>

                    </div>

                </section>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {success && (
                    <div className="success-message">
                        ✓ {success}
                    </div>
                )}


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (
                    <div className="error-box">
                        ⚠ {error}
                    </div>
                )}


                {/* =================================================
                    CREATE ENQUIRY INTRO
                ================================================= */}

                {!showForm && (

                    <section className="erp-card create-card">

                        <div>

                            <div className="card-icon">
                                📩
                            </div>

                            <div>

                                <h2>
                                    Create New Enquiry
                                </h2>

                                <p>
                                    Select a customer and add
                                    products for the enquiry.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleOpenForm}
                        >
                            + Create Enquiry
                        </button>

                    </section>

                )}


                {/* =================================================
                    CREATE FORM
                ================================================= */}

                {showForm && (

                    <section className="erp-card">

                        <div className="card-header">

                            <div>

                                <span className="eyebrow">
                                    NEW ENQUIRY
                                </span>

                                <h2>
                                    Create Customer Enquiry
                                </h2>

                                <p>
                                    Select the customer and
                                    products requested.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            {/* CUSTOMER */}

                            <div className="form-group">

                                <label>
                                    Customer *
                                </label>

                                <select
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Customer
                                    </option>

                                    {customers.map(
                                        (customer) => (

                                            <option
                                                key={
                                                    customer.id
                                                }
                                                value={
                                                    customer.id
                                                }
                                            >
                                                {customer.company_name}
                                            </option>

                                        )
                                    )}

                                </select>

                                {customers.length === 0 && (
                                    <small
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "7px",
                                            color:
                                                "#dc2626"
                                        }}
                                    >
                                        No customers found.
                                        Please create a customer
                                        first.
                                    </small>
                                )}

                            </div>


                            {/* PRODUCTS */}

                            <div
                                style={{
                                    marginTop: "28px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "space-between",
                                        marginBottom:
                                            "15px"
                                    }}
                                >

                                    <div>

                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize:
                                                    "16px"
                                            }}
                                        >
                                            Requested Products
                                        </h3>

                                        <p
                                            style={{
                                                margin:
                                                    "5px 0 0"
                                            }}
                                        >
                                            Add the products
                                            requested by the
                                            customer.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={addItem}
                                    >
                                        + Add Product
                                    </button>

                                </div>


                                {/* ITEM HEADER */}

                                <div
                                    className="enquiry-item-header"
                                >
                                    <span>
                                        PRODUCT
                                    </span>

                                    <span>
                                        QUANTITY
                                    </span>

                                    <span>
                                        ACTION
                                    </span>
                                </div>


                                {/* ITEMS */}

                                {items.map(
                                    (item, index) => (

                                        <div
                                            className="enquiry-item-row"
                                            key={index}
                                        >

                                            <select
                                                value={
                                                    item.product_id
                                                }
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "product_id",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {products.map(
                                                    (product) => (

                                                        <option
                                                            key={
                                                                product.product_id ||
                                                                product.id
                                                            }
                                                            value={
                                                                product.product_id ||
                                                                product.id
                                                            }
                                                        >
                                                            {product.product_name ||
                                                                product.name ||
                                                                `Product #${
                                                                    product.product_id ||
                                                                    product.id
                                                                }`}
                                                        </option>

                                                    )
                                                )}

                                            </select>


                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    item.quantity
                                                }
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />


                                            <button
                                                type="button"
                                                className="remove-item-button"
                                                onClick={() =>
                                                    removeItem(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    items.length ===
                                                    1
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* FORM ACTIONS */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "12px",
                                    marginTop: "30px",
                                    paddingTop:
                                        "20px",
                                    borderTop:
                                        "1px solid #edf0f4"
                                }}
                            >

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleCancel
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        saving ||
                                        customers.length ===
                                            0 ||
                                        products.length ===
                                            0
                                    }
                                >
                                    {saving
                                        ? "Creating..."
                                        : "✓ Create Enquiry"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* =================================================
                    ENQUIRY LIST
                ================================================= */}

                <section className="erp-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Enquiry List
                            </h2>

                            <p>
                                All customer enquiries.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="secondary-button"
                            onClick={loadEnquiries}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading Enquiries...
                            </h3>

                            <p>
                                Please wait while we
                                fetch enquiry records.
                            </p>

                        </div>

                    ) : enquiries.length === 0 ? (

                        /* =================================================
                            EMPTY
                        ================================================= */

                        <div className="empty-state">

                            <div className="empty-icon">
                                📩
                            </div>

                            <h3>
                                No Enquiries Found
                            </h3>

                            <p>
                                Create your first customer
                                enquiry to get started.
                            </p>

                            {!showForm && (
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleOpenForm
                                    }
                                >
                                    + Create Enquiry
                                </button>
                            )}

                        </div>

                    ) : (

                        /* =================================================
                            TABLE
                        ================================================= */

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            CUSTOMER
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            CREATED BY
                                        </th>

                                        <th>
                                            DATE
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {enquiries.map(
                                        (enquiry) => (

                                            <tr
                                                key={
                                                    enquiry.id
                                                }
                                            >

                                                <td>

                                                    <strong
                                                        style={{
                                                            color:
                                                                "#2563eb"
                                                        }}
                                                    >
                                                        #
                                                        {
                                                            enquiry.id
                                                        }
                                                    </strong>

                                                </td>


                                                <td>

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "10px"
                                                        }}
                                                    >

                                                        <div
                                                            className="table-avatar"
                                                        >
                                                            {getCustomerName(
                                                                enquiry
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block"
                                                                }}
                                                            >
                                                                {getCustomerName(
                                                                    enquiry
                                                                )}
                                                            </strong>

                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    color:
                                                                        "#8a94a4"
                                                                }}
                                                            >
                                                                Customer #
                                                                {
                                                                    enquiry.customer_id ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`status-badge ${
                                                            String(
                                                                enquiry.status ||
                                                                "NEW"
                                                            ).toLowerCase()
                                                        }`}
                                                    >
                                                        {
                                                            enquiry.status ||
                                                            "NEW"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {enquiry.created_by_name ||
                                                        enquiry.created_by ||
                                                        `User #${
                                                            enquiry.created_by_id ||
                                                            "-"
                                                        }`}

                                                </td>


                                                <td>

                                                    {formatDate(
                                                        enquiry.created_at
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

export default Enquiries;