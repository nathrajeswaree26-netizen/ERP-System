# 🚀 Fundsroom ERP System

## Full-Stack Enterprise Resource Planning Application

Fundsroom ERP is a full-stack web application developed to manage a complete business sales and inventory workflow in a single system.

The application connects **Customers, Enquiries, Quotations, Sales Orders, Inventory, and Dispatches**, while providing secure authentication and role-based access for different users.

### 🔄 Main Workflow

**Customer → Enquiry → Quotation → Sales Order → Inventory Reservation → Dispatch**

---

# 🖥️ Application Screenshots

## 🔐 Login

Secure login using email and password with JWT-based authentication.

![Login](docs/screenshots/login.png)

## 📊 Dashboard

Central dashboard providing access to the major ERP modules.

![Dashboard](docs/screenshots/dashboard.png)

## 👥 Customers

Create and manage customer information such as company name, contact person, email, phone, and address.

![Customers](docs/screenshots/customers.png)

## 📩 Enquiries

Create customer enquiries and add the required products and quantities.

![Enquiries](docs/screenshots/enquiries.png)

## 📄 Quotations

Create quotations based on customer requirements, products, quantities, and prices.

![Quotations](docs/screenshots/quotations.png)

## 🛒 Sales Orders

Convert accepted quotations into Sales Orders and manage their confirmation status.

![Sales Orders](docs/screenshots/sales-orders.png)

## 📦 Inventory

View available and reserved quantities for each product.

![Inventory](docs/screenshots/inventory.png)

## 🚚 Dispatches

Process confirmed Sales Orders and maintain dispatch and tracking information.

![Dispatches](docs/screenshots/dispatches.png)

---

# 🔄 Business Workflow

### 1. Customer

Customer details are created and stored in the system.

↓

### 2. Enquiry

The Sales User creates an enquiry by selecting the customer and required products.

↓

### 3. Quotation

A quotation is prepared with product quantities, unit prices, and total amount.

↓

### 4. Sales Order

An accepted quotation can be converted into a Sales Order.

↓

### 5. Inventory Reservation

When an Admin confirms the Sales Order, the system checks whether sufficient stock is available.

If stock is available, the required quantity is reserved.

↓

### 6. Dispatch

After confirmation, the order can be dispatched with dispatch and tracking details.

---

# 👥 User Roles

## ADMIN

Admin users can:

- View system records
- View inventory
- Confirm Sales Orders
- Reserve inventory
- Process dispatches
- Manage operational activities

## SALES_USER

Sales users can:

- Create customers
- Create enquiries
- Create quotations
- Create Sales Orders
- View inventory availability

---

# ✨ Main Features

- 🔐 JWT Authentication
- 🔑 Role-Based Authorization
- 👥 Customer Management
- 📩 Enquiry Management
- 📄 Quotation Management
- 🛒 Sales Order Management
- 📦 Inventory Management
- 🔒 Inventory Reservation
- 🚚 Dispatch Management
- 🔗 REST API Integration
- 🗄️ PostgreSQL Database
- 🧪 Postman API Testing
- 📱 Responsive React Interface

---

# 📦 Inventory Management

The system maintains both **available stock** and **reserved stock**.

For example:

**Before Sales Order Confirmation**

Industrial Motor  
Available: **50**  
Reserved: **0**

**After Reserving 5 Units**

Industrial Motor  
Available: **45**  
Reserved: **5**

**After Dispatch**

Industrial Motor  
Available: **45**  
Reserved: **0**

This ensures that stock is not incorrectly allocated to multiple Sales Orders.

The Sales Order confirmation process uses a **PostgreSQL transaction with row locking (`FOR UPDATE`)** to safely check and reserve inventory.

---

# 🗄️ Database

The application uses **PostgreSQL** as its relational database.

## Main Tables

| Table | Purpose |
|---|---|
| `users` | Stores users and their roles |
| `customers` | Stores customer information |
| `products` | Stores product details |
| `inventory` | Maintains available and reserved stock |
| `enquiries` | Stores customer enquiries |
| `enquiry_items` | Stores products in enquiries |
| `quotations` | Stores quotations |
| `quotation_items` | Stores quotation products |
| `sales_orders` | Stores Sales Orders |
| `sales_order_items` | Stores Sales Order products |
| `inventory_reservations` | Tracks reserved inventory |
| `dispatches` | Stores dispatch information |

## Database Schema

![Database Schema](docs/images/database-schema.png)

---

# 🏗️ System Architecture

![System Architecture](docs/images/system-architecture.png)

### Frontend

**React.js**

↓

### API Communication

**Axios + REST APIs**

↓

### Backend

**Node.js + Express.js**

↓

### Database

**PostgreSQL**

---

# 🛠️ Technology Stack

| Technology | Usage |
|---|---|
| React.js | Frontend development |
| React Router | Page navigation |
| Axios | API communication |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Postman | API testing |
| pgAdmin | Database management |
| Vite | Frontend development |
| Git | Version control |
| GitHub | Source code management |

---


├── .gitignore
└── README.md
