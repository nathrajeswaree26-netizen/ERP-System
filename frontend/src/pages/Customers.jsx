import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: ""
    });


    /* =========================================
       LOAD CUSTOMERS
    ========================================= */

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/customers");

            console.log("Customers API:", response.data);

            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else if (
                Array.isArray(response.data.customers)
            ) {
                setCustomers(response.data.customers);
            } else {
                setCustomers([]);
                setError(
                    "Invalid customer data received from server."
                );
            }

        } catch (err) {
            console.error(
                "Load customers error:",
                err
            );

            setCustomers([]);

            setError(
                err.response?.data?.message ||
                "Failed to load customers."
            );
        } finally {
            setLoading(false);
        }
    };


    /* =========================================
       LOAD ON PAGE OPEN
    ========================================= */

    useEffect(() => {
        loadCustomers();
    }, []);


    /* =========================================
       FORM CHANGE
    ========================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };


    /* =========================================
       CREATE CUSTOMER
    ========================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.company_name.trim()) {
            setError("Company name is required.");
            return;
        }

        if (!form.contact_person.trim()) {
            setError("Contact person is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                company_name:
                    form.company_name.trim(),

                contact_person:
                    form.contact_person.trim(),

                email:
                    form.email.trim(),

                phone:
                    form.phone.trim(),

                address:
                    form.address.trim()
            };

            await api.post(
                "/customers",
                payload
            );

            setSuccess(
                "Customer created successfully!"
            );

            setForm({
                company_name: "",
                contact_person: "",
                email: "",
                phone: "",
                address: ""
            });

            await loadCustomers();

            setShowForm(false);

        } catch (err) {
            console.error(
                "Create customer error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create customer."
            );
        } finally {
            setSaving(false);
        }
    };


    /* =========================================
       FILTER CUSTOMERS
    ========================================= */

    const filteredCustomers = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return customers;
        }

        return customers.filter((customer) => {

            return (
                String(
                    customer.company_name || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    customer.contact_person || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    customer.email || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    customer.phone || ""
                )
                    .toLowerCase()
                    .includes(searchText)
            );

        });

    }, [customers, search]);


    /* =========================================
       CANCEL FORM
    ========================================= */

    const handleCancel = () => {

        setShowForm(false);

        setForm({
            company_name: "",
            contact_person: "",
            email: "",
            phone: "",
            address: ""
        });

        setError("");
    };


    /* =========================================
       FORMAT DATE
    ========================================= */

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


    return (
        <div className="erp-page">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="erp-content">

                <div className="page-header">

                    <div>

                        <span className="eyebrow">
                            CUSTOMER MANAGEMENT
                        </span>

                        <h1>
                            Customers
                        </h1>

                        <p>
                            Manage customer information
                            and business contacts.
                        </p>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >

                        <div
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e5e9f0",
                                borderRadius: "10px",
                                padding: "10px 18px",
                                textAlign: "center",
                                minWidth: "110px"
                            }}
                        >

                            <strong
                                style={{
                                    display: "block",
                                    fontSize: "22px",
                                    color: "#2563eb"
                                }}
                            >
                                {customers.length}
                            </strong>

                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "#7a8494"
                                }}
                            >
                                Total Customers
                            </span>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SUCCESS / ERROR
                ===================================== */}

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


                {/* =====================================
                    ADD CUSTOMER BUTTON
                ===================================== */}

                {!showForm && (

                    <section
                        className="erp-card"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "20px",
                            background:
                                "linear-gradient(135deg, #ffffff, #f8faff)"
                        }}
                    >

                        <div>

                            <h2>
                                Customer Directory
                            </h2>

                            <p>
                                Add a new customer to your
                                business database.
                            </p>

                        </div>

                        <button
                            className="primary-button"
                            onClick={() => {
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            + Add Customer
                        </button>

                    </section>

                )}


                {/* =====================================
                    ADD CUSTOMER FORM
                ===================================== */}

                {showForm && (

                    <section className="erp-card">

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                marginBottom: "25px"
                            }}
                        >

                            <div>

                                <span className="eyebrow">
                                    NEW CUSTOMER
                                </span>

                                <h2
                                    style={{
                                        marginTop: "5px"
                                    }}
                                >
                                    Add Customer
                                </h2>

                                <p>
                                    Enter the customer
                                    information below.
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

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, minmax(0, 1fr))",
                                    gap: "20px"
                                }}
                            >

                                {/* Company */}

                                <div className="form-group">

                                    <label>
                                        Company Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="company_name"
                                        value={
                                            form.company_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter company name"
                                        required
                                    />

                                </div>


                                {/* Contact */}

                                <div className="form-group">

                                    <label>
                                        Contact Person *
                                    </label>

                                    <input
                                        type="text"
                                        name="contact_person"
                                        value={
                                            form.contact_person
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter contact person"
                                        required
                                    />

                                </div>


                                {/* Email */}

                                <div className="form-group">

                                    <label>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="company@example.com"
                                    />

                                </div>


                                {/* Phone */}

                                <div className="form-group">

                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter phone number"
                                    />

                                </div>

                            </div>


                            {/* Address */}

                            <div className="form-group">

                                <label>
                                    Business Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter complete business address"
                                    rows="3"
                                />

                            </div>


                            {/* FORM ACTIONS */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "12px",
                                    marginTop: "10px"
                                }}
                            >

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving Customer..."
                                        : "✓ Save Customer"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* =====================================
                    CUSTOMER LIST
                ===================================== */}

                <section className="erp-card">

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "20px",
                            marginBottom: "22px"
                        }}
                    >

                        <div>

                            <h2>
                                Customer List
                            </h2>

                            <p>
                                All registered customers
                                in the system.
                            </p>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            {/* SEARCH */}

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="🔍 Search customers..."
                                style={{
                                    width: "240px",
                                    padding:
                                        "10px 13px",
                                    border:
                                        "1px solid #d9dee7",
                                    borderRadius: "8px",
                                    outline: "none",
                                    fontSize: "13px"
                                }}
                            />


                            {/* REFRESH */}

                            <button
                                className="secondary-button"
                                onClick={
                                    loadCustomers
                                }
                                disabled={loading}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                    </div>


                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading ? (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "12px"
                                }}
                            >
                                ⏳
                            </div>

                            <h3>
                                Loading Customers...
                            </h3>

                            <p>
                                Please wait while we
                                fetch customer records.
                            </p>

                        </div>

                    ) : filteredCustomers.length === 0 ? (

                        /* =================================
                           EMPTY
                        ================================= */

                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px"
                            }}
                        >

                            <div
                                style={{
                                    width: "65px",
                                    height: "65px",
                                    margin:
                                        "0 auto 15px",
                                    borderRadius: "50%",
                                    background: "#eef4ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    fontSize: "28px"
                                }}
                            >
                                👥
                            </div>

                            <h3>
                                {search
                                    ? "No Customers Found"
                                    : "No Customers Yet"}
                            </h3>

                            <p>
                                {search
                                    ? "Try searching with a different name or email."
                                    : "Add your first customer to get started."}
                            </p>

                            {!search && !showForm && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        setShowForm(true)
                                    }
                                >
                                    + Add First Customer
                                </button>
                            )}

                        </div>

                    ) : (

                        /* =================================
                           TABLE
                        ================================= */

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>

                                        <th>
                                            CUSTOMER
                                        </th>

                                        <th>
                                            CONTACT PERSON
                                        </th>

                                        <th>
                                            EMAIL
                                        </th>

                                        <th>
                                            PHONE
                                        </th>

                                        <th>
                                            ADDRESS
                                        </th>

                                        <th>
                                            CREATED
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredCustomers.map(
                                        (customer) => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                            >

                                                {/* Customer */}

                                                <td>

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "11px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                width:
                                                                    "38px",
                                                                height:
                                                                    "38px",
                                                                borderRadius:
                                                                    "9px",
                                                                background:
                                                                    "#eef4ff",
                                                                color:
                                                                    "#2563eb",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                fontWeight:
                                                                    "700"
                                                            }}
                                                        >
                                                            {(
                                                                customer.company_name ||
                                                                "C"
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
                                                                        "block",
                                                                    color:
                                                                        "#172033"
                                                                }}
                                                            >
                                                                {
                                                                    customer.company_name
                                                                }
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
                                                                    customer.id
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Contact */}

                                                <td>

                                                    <span
                                                        style={{
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {
                                                            customer.contact_person ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* Email */}

                                                <td>

                                                    {customer.email ? (

                                                        <a
                                                            href={`mailto:${customer.email}`}
                                                            style={{
                                                                color:
                                                                    "#2563eb",
                                                                textDecoration:
                                                                    "none"
                                                            }}
                                                        >
                                                            {
                                                                customer.email
                                                            }
                                                        </a>

                                                    ) : (
                                                        "-"
                                                    )}

                                                </td>


                                                {/* Phone */}

                                                <td>

                                                    {customer.phone ? (

                                                        <a
                                                            href={`tel:${customer.phone}`}
                                                            style={{
                                                                color:
                                                                    "#374151",
                                                                textDecoration:
                                                                    "none"
                                                            }}
                                                        >
                                                            📞{" "}
                                                            {
                                                                customer.phone
                                                            }
                                                        </a>

                                                    ) : (
                                                        "-"
                                                    )}

                                                </td>


                                                {/* Address */}

                                                <td>

                                                    <span
                                                        style={{
                                                            display:
                                                                "block",
                                                            maxWidth:
                                                                "220px",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis"
                                                        }}
                                                        title={
                                                            customer.address ||
                                                            ""
                                                        }
                                                    >
                                                        {
                                                            customer.address ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* Created */}

                                                <td>

                                                    {formatDate(
                                                        customer.created_at
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

            </div>

        </div>
    );
}

export default Customers;