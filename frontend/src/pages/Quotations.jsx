import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Quotations() {
    const [quotations, setQuotations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");

    const [customerId, setCustomerId] = useState("");

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            unit_price: 0
        }
    ]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* ================================
       LOAD QUOTATIONS
    ================================= */

    const loadQuotations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/quotations");

            console.log("Quotations API:", response.data);

            if (Array.isArray(response.data)) {
                setQuotations(response.data);
            } else if (
                Array.isArray(response.data.quotations)
            ) {
                setQuotations(response.data.quotations);
            } else {
                setQuotations([]);
                setError(
                    "Invalid quotation data received."
                );
            }
        } catch (err) {
            console.error(err);

            setQuotations([]);

            setError(
                err.response?.data?.message ||
                "Failed to load quotations."
            );
        } finally {
            setLoading(false);
        }
    };


    /* ================================
       LOAD CUSTOMERS
    ================================= */

    const loadCustomers = async () => {
        try {
            const response =
                await api.get("/customers");

            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else if (
                Array.isArray(response.data.customers)
            ) {
                setCustomers(response.data.customers);
            } else {
                setCustomers([]);
            }
        } catch (err) {
            console.error(err);
            setCustomers([]);
        }
    };


    /* ================================
       LOAD INVENTORY / PRODUCTS
    ================================= */

    const loadProducts = async () => {
        try {
            const response =
                await api.get("/inventory");

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
            console.error(err);
            setProducts([]);
        }
    };


    useEffect(() => {
        loadQuotations();
        loadCustomers();
        loadProducts();
    }, []);


    /* ================================
       ADD ITEM
    ================================= */

    const addItem = () => {
        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1,
                unit_price: 0
            }
        ]);
    };


    /* ================================
       REMOVE ITEM
    ================================= */

    const removeItem = (index) => {
        if (items.length === 1) return;

        setItems(
            items.filter(
                (_, i) => i !== index
            )
        );
    };


    /* ================================
       ITEM CHANGE
    ================================= */

    const handleItemChange = (
        index,
        field,
        value
    ) => {
        const updated = [...items];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        if (field === "product_id") {
            const product = products.find(
                (p) =>
                    Number(
                        p.product_id || p.id
                    ) === Number(value)
            );

            if (product) {
                updated[index].unit_price =
                    Number(
                        product.price ||
                        product.unit_price ||
                        0
                    );
            }
        }

        setItems(updated);
    };


    /* ================================
       TOTAL
    ================================= */

    const totalAmount = items.reduce(
        (total, item) =>
            total +
            Number(item.quantity || 0) *
            Number(item.unit_price || 0),
        0
    );


    /* ================================
       CREATE QUOTATION
    ================================= */

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

                total_amount: Number(
                    totalAmount.toFixed(2)
                ),

                items: validItems.map(
                    (item) => ({
                        product_id:
                            Number(
                                item.product_id
                            ),

                        quantity:
                            Number(
                                item.quantity
                            ),

                        unit_price:
                            Number(
                                item.unit_price
                            ),

                        total_price:
                            Number(
                                item.quantity
                            ) *
                            Number(
                                item.unit_price
                            )
                    })
                )
            };

            console.log(
                "Creating quotation:",
                payload
            );

            await api.post(
                "/quotations",
                payload
            );

            setSuccess(
                "Quotation created successfully!"
            );

            setCustomerId("");

            setItems([
                {
                    product_id: "",
                    quantity: 1,
                    unit_price: 0
                }
            ]);

            setShowForm(false);

            await loadQuotations();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create quotation."
            );
        } finally {
            setSaving(false);
        }
    };


    /* ================================
       STATUS UPDATE
    ================================= */

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            setError("");
            setSuccess("");

            await api.patch(
                `/quotations/${id}/status`,
                { status }
            );

            setSuccess(
                `Quotation #${id} marked as ${status}.`
            );

            await loadQuotations();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update quotation status."
            );
        }
    };


    /* ================================
       FILTER
    ================================= */

    const filteredQuotations =
        useMemo(() => {
            const text =
                search
                    .trim()
                    .toLowerCase();

            if (!text) {
                return quotations;
            }

            return quotations.filter(
                (quotation) =>
                    String(
                        quotation.id || ""
                    )
                        .toLowerCase()
                        .includes(text) ||
                    String(
                        quotation.company_name ||
                        quotation.customer_name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(text) ||
                    String(
                        quotation.status || ""
                    )
                        .toLowerCase()
                        .includes(text)
            );
        }, [quotations, search]);


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


    const getCustomerName = (quotation) => {
        return (
            quotation.company_name ||
            quotation.customer_name ||
            `Customer #${quotation.customer_id || "-"}`
        );
    };


    return (
        <div className="erp-page">

            <main className="erp-content">

                {/* HEADER */}

                <section className="page-header">

                    <div>
                        <span className="eyebrow">
                            SALES / QUOTATIONS
                        </span>

                        <h1>
                            Quotations
                        </h1>

                        <p>
                            Prepare and manage customer
                            quotations.
                        </p>
                    </div>

                    <div className="stat-card">
                        <strong>
                            {quotations.length}
                        </strong>

                        <span>
                            Total Quotations
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
                                📄
                            </div>

                            <div>
                                <h2>
                                    Create New Quotation
                                </h2>

                                <p>
                                    Prepare pricing for a
                                    customer enquiry.
                                </p>
                            </div>
                        </div>

                        <button
                            className="primary-button"
                            onClick={() => {
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                                loadCustomers();
                                loadProducts();
                            }}
                        >
                            + Create Quotation
                        </button>

                    </section>
                )}


                {/* FORM */}

                {showForm && (
                    <section className="erp-card">

                        <div className="card-header">

                            <div>
                                <span className="eyebrow">
                                    NEW QUOTATION
                                </span>

                                <h2>
                                    Create Customer Quotation
                                </h2>

                                <p>
                                    Select products and set
                                    their prices.
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
                            onSubmit={handleSubmit}
                        >

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
                                                {
                                                    customer.company_name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>


                            <div
                                className="quotation-items-section"
                            >

                                <div className="card-header">

                                    <div>
                                        <h3>
                                            Quotation Items
                                        </h3>

                                        <p>
                                            Add products,
                                            quantities and
                                            unit prices.
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


                                <div className="quotation-item-header">

                                    <span>
                                        PRODUCT
                                    </span>

                                    <span>
                                        QTY
                                    </span>

                                    <span>
                                        UNIT PRICE
                                    </span>

                                    <span>
                                        TOTAL
                                    </span>

                                    <span>
                                        ACTION
                                    </span>

                                </div>


                                {items.map(
                                    (item, index) => (

                                        <div
                                            className="quotation-item-row"
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
                                                            {
                                                                product.product_name ||
                                                                product.name ||
                                                                `Product #${
                                                                    product.product_id ||
                                                                    product.id
                                                                }`
                                                            }
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


                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    item.unit_price
                                                }
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "unit_price",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />


                                            <strong>
                                                ₹
                                                {(
                                                    Number(
                                                        item.quantity
                                                    ) *
                                                    Number(
                                                        item.unit_price
                                                    )
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2
                                                    }
                                                )}
                                            </strong>


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


                            {/* TOTAL */}

                            <div className="quotation-total-box">

                                <span>
                                    Grand Total
                                </span>

                                <strong>
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits:
                                                2
                                        }
                                    )}
                                </strong>

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
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Creating..."
                                        : "✓ Create Quotation"}
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
                                Quotation List
                            </h2>

                            <p>
                                All customer quotations.
                            </p>
                        </div>

                        <div className="list-actions">

                            <input
                                className="table-search"
                                placeholder="🔍 Search quotations..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                className="secondary-button"
                                onClick={
                                    loadQuotations
                                }
                                disabled={loading}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                    </div>


                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading Quotations...
                            </h3>

                        </div>

                    ) : filteredQuotations.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📄
                            </div>

                            <h3>
                                No Quotations Found
                            </h3>

                            <p>
                                Create a quotation to
                                continue the sales workflow.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>CUSTOMER</th>
                                        <th>STATUS</th>
                                        <th>TOTAL</th>
                                        <th>CREATED BY</th>
                                        <th>DATE</th>
                                        <th>ACTION</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredQuotations.map(
                                        (quotation) => (

                                            <tr
                                                key={
                                                    quotation.id
                                                }
                                            >

                                                <td>
                                                    <strong className="id-text">
                                                        #
                                                        {
                                                            quotation.id
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {getCustomerName(
                                                            quotation
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status-badge ${String(
                                                            quotation.status ||
                                                            "DRAFT"
                                                        ).toLowerCase()}`}
                                                    >
                                                        {
                                                            quotation.status ||
                                                            "DRAFT"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        ₹
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
                                                    </strong>
                                                </td>

                                                <td>
                                                    {quotation.created_by_name ||
                                                        quotation.created_by ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        quotation.created_at
                                                    )}
                                                </td>

                                                <td>

                                                    <div className="action-buttons">

                                                        {String(
                                                            quotation.status
                                                        ).toUpperCase() ===
                                                            "DRAFT" && (
                                                            <button
                                                                className="small-success-button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        quotation.id,
                                                                        "ACCEPTED"
                                                                    )
                                                                }
                                                            >
                                                                Accept
                                                            </button>
                                                        )}

                                                        {String(
                                                            quotation.status
                                                        ).toUpperCase() ===
                                                            "DRAFT" && (
                                                            <button
                                                                className="small-danger-button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        quotation.id,
                                                                        "REJECTED"
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>
                                                        )}

                                                    </div>

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

export default Quotations;