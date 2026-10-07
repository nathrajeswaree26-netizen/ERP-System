import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Inventory() {
    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");


    /* ================================
       LOAD INVENTORY
    ================================= */

    const loadInventory = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/inventory");

            console.log(
                "Inventory API:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setInventory(response.data);
            } else if (
                Array.isArray(response.data.inventory)
            ) {
                setInventory(
                    response.data.inventory
                );
            } else {
                setInventory([]);

                setError(
                    "Invalid inventory data received."
                );
            }

        } catch (err) {
            console.error(err);

            setInventory([]);

            setError(
                err.response?.data?.message ||
                "Failed to load inventory."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadInventory();
    }, []);


    /* ================================
       NORMALIZE VALUES
    ================================= */

    const getAvailable = (item) =>
        Number(
            item.available_quantity ??
            item.available ??
            0
        );

    const getReserved = (item) =>
        Number(
            item.reserved_quantity ??
            item.reserved ??
            0
        );

    const getProductName = (item) =>
        item.product_name ||
        item.name ||
        `Product #${item.product_id || item.id}`;


    /* ================================
       STATISTICS
    ================================= */

    const totalAvailable =
        inventory.reduce(
            (sum, item) =>
                sum + getAvailable(item),
            0
        );

    const totalReserved =
        inventory.reduce(
            (sum, item) =>
                sum + getReserved(item),
            0
        );

    const lowStockCount =
        inventory.filter(
            (item) =>
                getAvailable(item) > 0 &&
                getAvailable(item) <= 10
        ).length;

    const outOfStockCount =
        inventory.filter(
            (item) =>
                getAvailable(item) === 0
        ).length;


    /* ================================
       FILTER
    ================================= */

    const filteredInventory =
        useMemo(() => {

            const text =
                search.trim().toLowerCase();

            return inventory.filter(
                (item) => {

                    const productName =
                        getProductName(item)
                            .toLowerCase();

                    const matchesSearch =
                        !text ||
                        productName.includes(
                            text
                        );

                    const available =
                        getAvailable(item);

                    let matchesFilter = true;

                    if (filter === "LOW") {
                        matchesFilter =
                            available > 0 &&
                            available <= 10;
                    }

                    if (filter === "OUT") {
                        matchesFilter =
                            available === 0;
                    }

                    if (filter === "AVAILABLE") {
                        matchesFilter =
                            available > 10;
                    }

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );

        }, [inventory, search, filter]);


    /* ================================
       STATUS
    ================================= */

    const getStockStatus = (available) => {

        if (available === 0) {
            return {
                label: "OUT OF STOCK",
                className: "out"
            };
        }

        if (available <= 10) {
            return {
                label: "LOW STOCK",
                className: "low"
            };
        }

        return {
            label: "AVAILABLE",
            className: "available"
        };
    };


    return (
        <div className="erp-page">

            <main className="erp-content">

                {/* HEADER */}

                <section className="page-header">

                    <div>

                        <span className="eyebrow">
                            OPERATIONS / INVENTORY
                        </span>

                        <h1>
                            Inventory Management
                        </h1>

                        <p>
                            Monitor available and reserved
                            inventory for your products.
                        </p>

                    </div>


                    <button
                        className="secondary-button"
                        onClick={loadInventory}
                        disabled={loading}
                    >
                        ↻ Refresh
                    </button>

                </section>


                {error && (
                    <div className="error-box">
                        ⚠ {error}
                    </div>
                )}


                {/* STATISTICS */}

                <section className="inventory-stats">

                    <div className="inventory-stat-card">

                        <div className="inventory-stat-icon">
                            📦
                        </div>

                        <div>
                            <span>
                                Available Stock
                            </span>

                            <strong>
                                {totalAvailable}
                            </strong>
                        </div>

                    </div>


                    <div className="inventory-stat-card">

                        <div className="inventory-stat-icon reserved">
                            🔒
                        </div>

                        <div>
                            <span>
                                Reserved Stock
                            </span>

                            <strong>
                                {totalReserved}
                            </strong>
                        </div>

                    </div>


                    <div className="inventory-stat-card">

                        <div className="inventory-stat-icon warning">
                            ⚠
                        </div>

                        <div>
                            <span>
                                Low Stock Items
                            </span>

                            <strong>
                                {lowStockCount}
                            </strong>
                        </div>

                    </div>


                    <div className="inventory-stat-card">

                        <div className="inventory-stat-icon danger">
                            !
                        </div>

                        <div>
                            <span>
                                Out of Stock
                            </span>

                            <strong>
                                {outOfStockCount}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* INVENTORY TABLE */}

                <section className="erp-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Product Inventory
                            </h2>

                            <p>
                                Current stock availability
                                and reservations.
                            </p>

                        </div>


                        <div className="list-actions">

                            <input
                                className="table-search"
                                placeholder="🔍 Search products..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />


                            <select
                                className="filter-select"
                                value={filter}
                                onChange={(e) =>
                                    setFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Stock
                                </option>

                                <option value="AVAILABLE">
                                    Available
                                </option>

                                <option value="LOW">
                                    Low Stock
                                </option>

                                <option value="OUT">
                                    Out of Stock
                                </option>

                            </select>

                        </div>

                    </div>


                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading Inventory...
                            </h3>

                        </div>

                    ) : filteredInventory.length ===
                      0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📦
                            </div>

                            <h3>
                                No Inventory Found
                            </h3>

                            <p>
                                No products match the
                                selected filter.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="erp-table">

                                <thead>

                                    <tr>
                                        <th>
                                            PRODUCT
                                        </th>

                                        <th>
                                            AVAILABLE
                                        </th>

                                        <th>
                                            RESERVED
                                        </th>

                                        <th>
                                            TOTAL STOCK
                                        </th>

                                        <th>
                                            STATUS
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredInventory.map(
                                        (item) => {

                                            const available =
                                                getAvailable(
                                                    item
                                                );

                                            const reserved =
                                                getReserved(
                                                    item
                                                );

                                            const total =
                                                available +
                                                reserved;

                                            const status =
                                                getStockStatus(
                                                    available
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.id ||
                                                        item.product_id
                                                    }
                                                >

                                                    <td>

                                                        <div className="product-cell">

                                                            <div className="product-icon">
                                                                📦
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {getProductName(
                                                                        item
                                                                    )}
                                                                </strong>

                                                                <span>
                                                                    Product #
                                                                    {
                                                                        item.product_id ||
                                                                        item.id
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <strong
                                                            className={
                                                                available ===
                                                                0
                                                                    ? "stock-danger"
                                                                    : available <=
                                                                      10
                                                                    ? "stock-warning"
                                                                    : "stock-good"
                                                            }
                                                        >
                                                            {
                                                                available
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span className="reserved-number">
                                                            {
                                                                reserved
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {total}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`stock-status ${status.className}`}
                                                        >
                                                            {
                                                                status.label
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        }
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

export default Inventory;