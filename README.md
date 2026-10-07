
# 🔍 Fundsroom ERP System

### Full-Stack Enterprise Resource Planning Application

Fundsroom ERP is a full-stack web application developed to manage the complete **customer, sales, inventory, and dispatch workflow** of an organization through a centralized ERP platform.

The system connects the complete business process:

**Customer → Enquiry → Quotation → Sales Order → Inventory Reservation → Dispatch**

The application is developed using **React.js, Node.js, Express.js, PostgreSQL, JWT, bcrypt, REST APIs, and Vite**.

---

## 🎯 Project Objective

The objective of Fundsroom ERP is to develop a centralized system that manages the complete business workflow from the initial customer enquiry to the final dispatch of products.

The system provides separate modules for:

1. **Customer Management** – maintaining customer and contact information.
2. **Enquiry Management** – recording customer requirements and requested products.
3. **Quotation Management** – preparing quotations with products, quantities, prices, and total amounts.
4. **Sales Order Management** – converting accepted quotations into Sales Orders.
5. **Inventory Management** – monitoring available and reserved product quantities.
6. **Inventory Reservation** – reserving stock when a Sales Order is confirmed.
7. **Dispatch Management** – processing confirmed orders and maintaining dispatch information.
8. **Authentication & Authorization** – controlling access according to user roles.

The project focuses on implementing a realistic ERP workflow where each business stage is connected with the next stage through REST APIs and PostgreSQL database relationships.

---

## ✨ Key Features

* 🔐 JWT-based Authentication
* 🔑 Role-Based Authorization
* 👥 Customer Management
* 📩 Customer Enquiry Management
* 📄 Quotation Management
* 🛒 Sales Order Management
* 📦 Inventory Management
* 🔒 Inventory Reservation
* 🚚 Dispatch Management
* 🔗 RESTful API Architecture
* 🗄️ PostgreSQL Database
* 🔄 Transaction-Based Inventory Processing
* 🔐 bcrypt Password Hashing
* 🧪 Postman API Testing
* ⚡ React-based Frontend
* 📊 Structured Business Workflow
* 🛡️ Protected Backend APIs

---

# 🔄 Complete Business Workflow

```text
Customer
   ↓
Customer Enquiry
   ↓
Quotation
   ↓
Accepted Quotation
   ↓
Sales Order
   ↓
Inventory Availability Check
   ↓
Inventory Reservation
   ↓
Sales Order Confirmation
   ↓
Dispatch
````

Each stage is connected through the backend business logic and relational database.

---

# 👥 User Roles

## 👨‍💼 ADMIN

The Admin manages important operational activities.

Admin can:

* View business records
* View inventory
* Confirm Sales Orders
* Reserve inventory
* Process dispatches
* Manage operational activities

Sales Order confirmation is restricted to the Admin role because confirmation directly affects inventory.

---

## 👩‍💼 SALES_USER

The Sales User handles customer and sales-related operations.

Sales User can:

* Create customers
* Create enquiries
* Create quotations
* Create Sales Orders
* View inventory availability
* Manage sales-related information

Restricted operations such as Sales Order confirmation are protected by backend role authorization.

---

# 🧠 How the ERP System Works

## 1️⃣ Customer Management

The workflow starts by creating a customer.

The system stores:

* Company Name
* Contact Person
* Email
* Phone Number
* Address
* Creation Date

Each customer receives a unique ID and can later be associated with enquiries, quotations, and Sales Orders.

---

## 2️⃣ Enquiry Management

A Sales User can create an enquiry based on customer requirements.

An enquiry contains:

* Customer
* Required products
* Product quantities
* Enquiry status
* Created-by user
* Creation date

A single enquiry can contain multiple products.

Example:

```text
Customer: ABC Industries

Enquiry:
Industrial Motor  → 5 units
Hydraulic Pump    → 2 units
Steel Valve       → 10 units
```

The enquiry and its products are stored using related PostgreSQL tables.

---

## 3️⃣ Quotation Management

The enquiry can be converted into a quotation.

A quotation contains:

* Customer
* Products
* Quantity
* Unit Price
* Total Price
* Total Amount
* Quotation Status
* Created-by User
* Creation Date

Example:

```text
Industrial Motor
Quantity: 5
Unit Price: ₹25,000
Total: ₹1,25,000
```

Multiple products can be included in a quotation.

---

## 4️⃣ Sales Order Management

After a quotation is accepted, it can be converted into a Sales Order.

The Sales Order maintains:

* Sales Order ID
* Quotation Reference
* Customer
* Products
* Quantities
* Unit Prices
* Total Amount
* Order Status

The initial order status is:

```text
PENDING_CONFIRMATION
```

The Sales Order must then be confirmed by an authorized Admin.

---

# 📦 Inventory Management

Inventory is one of the core modules of the ERP system.

The system maintains:

```text
Available Quantity
Reserved Quantity
```

For example:

```text
Industrial Motor

Available: 50
Reserved: 0
```

If an order requires 5 units and the Admin confirms the order:

```text
Available: 45
Reserved: 5
```

The 5 reserved units are no longer available for another Sales Order.

This helps prevent the same inventory from being allocated to multiple orders.

---

# 🔒 Inventory Reservation

When an Admin confirms a Sales Order, the backend performs an inventory availability check.

```text
Sales Order Confirmation
          ↓
Find Required Products
          ↓
Lock Inventory Records
          ↓
Check Available Quantity
          ↓
Is Stock Sufficient?
       ↙       ↘
     NO         YES
     ↓           ↓
Reject       Reserve Stock
Order            ↓
             Update Inventory
                  ↓
          Create Reservation
                  ↓
          Confirm Sales Order
```

If sufficient inventory is unavailable, the Sales Order is not confirmed.

Example:

```text
Available Stock: 10
Required Stock: 15

Result:
Insufficient inventory
Sales Order cannot be confirmed
```

---

# 🔐 Transaction-Safe Inventory Processing

Inventory confirmation is implemented using PostgreSQL transactions.

The backend performs the following operations as one transaction:

1. Start transaction.
2. Lock required inventory records.
3. Check available quantity.
4. Validate stock.
5. Decrease available quantity.
6. Increase reserved quantity.
7. Create inventory reservation records.
8. Update Sales Order status.
9. Commit transaction.

If any operation fails, the transaction is rolled back.

This prevents partial database updates and maintains inventory consistency.

---

# 🔒 PostgreSQL Row-Level Locking

The inventory confirmation process uses PostgreSQL:

```text
FOR UPDATE
```

This locks the selected inventory rows while the transaction is running.

It helps prevent conflicting inventory updates when multiple Sales Orders attempt to reserve the same product at the same time.

This is an important part of making the inventory workflow reliable in a multi-user ERP environment.

---

# 🚚 Dispatch Management

After a Sales Order has been confirmed and inventory has been reserved, the order can be dispatched.

The dispatch module maintains:

* Sales Order
* Dispatch Date
* Tracking Number
* Dispatch Status
* Creation Date

Example:

```text
Sales Order: SO-001
Tracking Number: FR-2026-0001
Status: DISPATCHED
```

The order lifecycle is:

```text
PENDING_CONFIRMATION
        ↓
CONFIRMED
        ↓
DISPATCHED
```

After dispatch, the reserved quantity is released from the reserved inventory.

---

# 📊 Inventory Example

The project uses sample industrial products for demonstrating the ERP workflow.

| Product          | Initial Available Stock |
| ---------------- | ----------------------: |
| Industrial Motor |                      50 |
| Hydraulic Pump   |                      30 |
| Steel Valve      |                     100 |

Example lifecycle:

```text
Industrial Motor

Initial:
Available = 50
Reserved  = 0

After Order Confirmation:
Available = 45
Reserved  = 5

After Dispatch:
Available = 45
Reserved  = 0
```

This demonstrates how inventory changes throughout the Sales Order lifecycle.

---

# 🔐 Authentication & Authorization

The application uses **JWT authentication** and **bcrypt password hashing**.

### Login Flow

```text
Email + Password
       ↓
Backend Validation
       ↓
User Lookup
       ↓
bcrypt Password Verification
       ↓
JWT Token Generation
       ↓
Authenticated API Requests
```

The JWT contains information such as:

* User ID
* Email
* Role

The token is used to authenticate protected API requests.

---

# 🔑 Role-Based Authorization

The system separates authentication from authorization.

**Authentication** verifies who the user is.

**Authorization** verifies what the user is allowed to do.

Example:

```text
SALES_USER
    ↓
Create Sales Order
    ↓
Allowed
```

```text
SALES_USER
    ↓
Confirm Sales Order
    ↓
Denied
```

```text
ADMIN
    ↓
Confirm Sales Order
    ↓
Allowed
```

Role authorization is enforced on the backend using middleware.

---

# 🗄️ Database

Fundsroom ERP uses **PostgreSQL** as its relational database.

The system contains 12 main tables:

| Table                    | Purpose                      |
| ------------------------ | ---------------------------- |
| `users`                  | User accounts and roles      |
| `customers`              | Customer information         |
| `products`               | Product details              |
| `inventory`              | Available and reserved stock |
| `enquiries`              | Customer enquiries           |
| `enquiry_items`          | Products in enquiries        |
| `quotations`             | Customer quotations          |
| `quotation_items`        | Products in quotations       |
| `sales_orders`           | Sales Orders                 |
| `sales_order_items`      | Products in Sales Orders     |
| `inventory_reservations` | Reserved inventory           |
| `dispatches`             | Dispatch information         |

---

# 🔗 Database Relationships

The major relationships are:

```text
Customer
   ↓
Enquiry
   ↓
Enquiry Items
   ↓
Products
```

```text
Customer
   ↓
Quotation
   ↓
Quotation Items
   ↓
Products
```

```text
Quotation
   ↓
Sales Order
   ↓
Sales Order Items
   ↓
Products
```

```text
Products
   ↓
Inventory
   ↓
Inventory Reservations
```

```text
Sales Order
   ↓
Dispatch
```

Primary keys and foreign keys maintain the relationships between different ERP entities.

---

# 🏗️ System Architecture

The application follows a client-server architecture.

```text
                   ┌──────────────────────┐
                   │    React Frontend    │
                   │       Vite           │
                   └──────────┬───────────┘
                              │
                              │ Axios / REST API
                              ↓
                   ┌──────────────────────┐
                   │   Express.js API     │
                   │    Node.js Backend   │
                   └──────────┬───────────┘
                              │
                              │ PostgreSQL Queries
                              ↓
                   ┌──────────────────────┐
                   │      PostgreSQL      │
                   │       Database       │
                   └──────────────────────┘
```

### Frontend

The React frontend handles:

* User interface
* Forms
* Navigation
* API communication
* Data display
* User interactions
* Error messages

### Backend

The Node.js and Express.js backend handles:

* REST APIs
* Business logic
* Authentication
* Authorization
* Validation
* Database operations
* Inventory processing
* Transactions

### Database

PostgreSQL handles:

* Persistent data
* Relationships
* Constraints
* Inventory records
* Business transactions

---

# 🌐 Frontend

The frontend is developed using **React.js and Vite**.

The application contains interfaces for:

* Login
* Dashboard
* Customers
* Enquiries
* Quotations
* Sales Orders
* Inventory
* Dispatches

Axios is used to communicate between the React application and backend APIs.

Authentication tokens are automatically attached to protected requests.

---

# ⚙️ Backend

The backend is developed using:

* Node.js
* Express.js
* PostgreSQL
* JWT
* bcryptjs

The backend is organized into:

* Routes
* Controllers
* Middleware
* Database configuration
* Services

This modular structure keeps authentication, business logic, authorization, and database operations organized.

---

# 🔗 REST API

The backend provides REST API modules for the major ERP operations.

| Module         | Endpoint            |
| -------------- | ------------------- |
| Authentication | `/api/auth`         |
| Customers      | `/api/customers`    |
| Enquiries      | `/api/enquiries`    |
| Quotations     | `/api/quotations`   |
| Sales Orders   | `/api/sales-orders` |
| Inventory      | `/api/inventory`    |
| Dispatches     | `/api/dispatches`   |

The APIs support operations such as:

* Create
* Retrieve
* Update
* Status management
* Sales Order confirmation
* Inventory reservation
* Dispatch processing

---

# 📁 Project Structure

```text
ERP-System/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* React Router
* Axios
* HTML5
* CSS3
* Vite

## Backend

* Node.js
* Express.js
* JavaScript
* REST APIs
* JWT
* bcryptjs

## Database

* PostgreSQL
* pgAdmin
* SQL

## Development & Testing

* Git
* GitHub
* Postman
* Visual Studio Code

---

# 🧪 API Testing

The backend APIs were tested using **Postman**.

Testing covered:

* User registration
* User login
* JWT authentication
* Role authorization
* Customer creation
* Enquiry creation
* Quotation creation
* Sales Order creation
* Sales Order confirmation
* Inventory availability
* Inventory reservation
* Insufficient stock validation
* Dispatch creation

Both successful and failure scenarios were tested to verify the application workflow.

---

# ⚠️ Error Handling

The system handles common application and business errors, including:

* Missing required fields
* Invalid login credentials
* Duplicate users
* Invalid roles
* Missing authentication token
* Invalid or expired JWT
* Unauthorized operations
* Insufficient inventory
* Invalid Sales Order status
* Database errors
* Invalid API requests

The backend returns appropriate HTTP status codes and messages, while the frontend displays relevant feedback to users.

---

# 🔒 Security

The application implements several security practices.

### Password Security

Passwords are hashed using bcrypt before being stored in PostgreSQL.

### JWT Authentication

JWT tokens are generated after successful login and used for protected requests.

### Role Authorization

Backend middleware verifies whether the authenticated user has permission to access restricted operations.

### Environment Variables

Sensitive configuration such as database credentials and JWT secrets are stored in environment variables.

### Parameterized SQL Queries

Database queries use parameterized values to reduce SQL injection risks.

### Protected APIs

Business operations require valid authentication where appropriate.

---

# 📈 End-to-End Example

A complete business transaction works as follows:

```text
Customer
"ABC Industries"
        ↓
Customer Enquiry
        ↓
Requests 5 Industrial Motors
        ↓
Quotation Created
        ↓
Quotation Accepted
        ↓
Sales Order Created
        ↓
Admin Confirms Order
        ↓
Inventory Checked
        ↓
50 Units Available
        ↓
5 Units Reserved
        ↓
Available = 45
Reserved = 5
        ↓
Order Dispatched
        ↓
Reserved = 0
        ↓
Sales Order Completed
```

This demonstrates how all major modules work together as one integrated ERP system.

---

# 📌 Key Technical Highlights

* Complete **Customer-to-Dispatch workflow**
* Full-stack **React + Node.js + Express.js + PostgreSQL architecture**
* JWT-based authentication
* bcrypt password hashing
* Role-based backend authorization
* Relational PostgreSQL database
* Primary and foreign key relationships
* RESTful API development
* Inventory availability validation
* Transaction-based inventory reservation
* PostgreSQL row-level locking using `FOR UPDATE`
* Insufficient stock validation
* Dispatch processing
* Postman API testing
* Git and GitHub version control

---

# 🚀 Future Enhancements

Possible future improvements include:

* 📊 Advanced dashboard analytics
* 📈 Sales performance reports
* 📦 Detailed inventory reports
* 🔎 Advanced search and filtering
* 📄 PDF quotation generation
* 📧 Email notifications
* 📝 Audit logs
* 🧪 Automated unit and integration testing
* 🐳 Docker containerization
* ☁️ Cloud deployment
* 📱 Improved mobile responsiveness
* 📊 Advanced business intelligence and reporting

---

# 🎓 Project Significance

Fundsroom ERP demonstrates practical implementation of full-stack software engineering concepts by combining frontend development, backend development, database management, authentication, authorization, business logic, inventory management, transaction processing, and API testing into one complete application.

The project goes beyond simple CRUD functionality by implementing a connected business workflow where an enquiry can lead to a quotation, an accepted quotation can become a Sales Order, the Sales Order can reserve inventory, and the confirmed order can finally be dispatched.

The inventory reservation and transaction mechanism provides an important real-world component by ensuring that stock remains consistent during order processing.

---

# 👩‍💻 Developer

## Rajeswaree Nath

**B.Tech – Computer Science & Technology**
**Nalanda Institute of Technology, Bhubaneswar | BPUT**

### Areas of Interest

* Software Engineering
* Full-Stack Development
* Java & Python
* Artificial Intelligence
* Machine Learning
* Backend Development
* Database Systems

---

# ⭐ Project Summary

**Fundsroom ERP System** is a full-stack ERP application designed to manage the complete business workflow from:

**Customer → Enquiry → Quotation → Sales Order → Inventory → Dispatch**

The project demonstrates practical experience with **React.js, Node.js, Express.js, PostgreSQL, REST APIs, JWT authentication, bcrypt, role-based authorization, relational database design, transaction management, inventory reservation, row-level locking, API testing, Git, and GitHub**.

The primary focus of the project is to build a realistic, secure, structured, and transaction-safe ERP workflow that connects customer management, sales operations, inventory management, and dispatch processing into one integrated application.

```
```
