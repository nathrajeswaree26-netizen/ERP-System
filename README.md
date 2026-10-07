🚀 Fundsroom ERP System
Full-Stack Enterprise Resource Planning Application

Fundsroom ERP is a full-stack web application designed to manage the complete sales, customer, inventory, and dispatch workflow of an organization from a centralized platform.

The system connects the complete business process:

Customer → Enquiry → Quotation → Sales Order → Inventory Reservation → Dispatch

The application is developed using React.js, Node.js, Express.js, PostgreSQL, JWT, bcrypt, REST APIs, and Vite.

🎯 Project Objective

The objective of Fundsroom ERP is to develop a centralized ERP system that simplifies and connects different stages of the business sales process.

The system focuses on:

Customer Management – maintain customer and contact information.
Enquiry Management – record customer requirements and requested products.
Quotation Management – prepare quotations with products, quantities, prices, and totals.
Sales Order Management – convert accepted quotations into Sales Orders.
Inventory Management – monitor available and reserved stock.
Inventory Reservation – reserve stock when a Sales Order is confirmed.
Dispatch Management – process confirmed orders and maintain dispatch information.
Authentication & Authorization – control system access based on user roles.

The project demonstrates how a complete business workflow can be implemented using a modern full-stack web architecture.

✨ Key Features
🔐 JWT-based Authentication
🔑 Role-Based Authorization
👥 Customer Management
📩 Customer Enquiry Management
📄 Quotation Management
🛒 Sales Order Management
📦 Inventory Management
🔒 Inventory Reservation
🚚 Dispatch Management
🔗 RESTful API Architecture
🗄️ PostgreSQL Relational Database
🔄 Transaction-Based Inventory Processing
🔐 bcrypt Password Hashing
🧪 Postman API Testing
⚡ React-based Interactive Interface
📊 Structured Business Workflow
🔄 How Fundsroom ERP Works

The system follows a complete business workflow.

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

Each stage is connected with the next stage through database relationships and backend APIs.

🧠 Complete Business Process
1. Customer Management

The workflow starts with creating a customer.

The system stores important customer information such as:

Company Name
Contact Person
Email
Phone Number
Address
Creation Date

Each customer receives a unique database ID that is used by other modules.

Customers can later be associated with:

Enquiries → Quotations → Sales Orders

2. Enquiry Management

After creating a customer, a Sales User can create an enquiry based on the customer's requirements.

An enquiry contains:

Customer
Required products
Product quantities
Enquiry status
Created-by user
Creation date

A single enquiry can contain multiple products.

Example:

Customer: ABC Industries

Enquiry:
    Industrial Motor     → 5 units
    Hydraulic Pump       → 2 units
    Steel Valve          → 10 units

The enquiry information is stored in PostgreSQL using separate enquiry and enquiry-item records.

3. Quotation Management

The enquiry can be converted into a quotation.

The quotation contains the commercial information required for the customer.

Each quotation can contain:

Customer
Products
Quantity
Unit Price
Total Price
Total Amount
Quotation Status
Created-by User
Creation Date

For example:

Industrial Motor
Quantity: 5
Unit Price: ₹25,000
Total: ₹1,25,000

The quotation can contain multiple quotation items.

4. Sales Order Management

When a quotation is accepted, it can be converted into a Sales Order.

The Sales Order maintains:

Sales Order ID
Quotation Reference
Customer
Products
Quantities
Unit Prices
Total Amount
Order Status

The initial status of the order is:

PENDING_CONFIRMATION

The order must then be confirmed by an authorized Admin.

📦 Inventory Management

Inventory is one of the important components of the ERP system.

The inventory module maintains two important quantities:

Available Quantity
Reserved Quantity

For example:

Industrial Motor

Available: 50
Reserved: 0

If a Sales Order requires 5 units and is confirmed:

Available: 45
Reserved: 5

The 5 reserved units are no longer available for another order.

This helps prevent multiple orders from using the same stock.

🔒 Inventory Reservation Process

When an Admin confirms a Sales Order, the backend performs an inventory verification process.

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

If sufficient inventory is not available, the order is not confirmed.

Example:

Available Stock: 10
Required Stock: 15

Result:
Insufficient inventory
Sales Order cannot be confirmed
🔐 PostgreSQL Transaction Management

Inventory operations are performed using PostgreSQL transactions.

The confirmation process performs multiple database operations together:

Begin transaction.
Lock inventory records.
Check available quantity.
Update available quantity.
Update reserved quantity.
Create inventory reservation records.
Update Sales Order status.
Commit transaction.

If any operation fails, the transaction is rolled back.

This prevents situations where one part of the inventory operation succeeds while another part fails.

🔒 Row-Level Locking

The inventory confirmation process uses PostgreSQL row-level locking through:

FOR UPDATE

This locks the relevant inventory record while the transaction is being processed.

It helps protect inventory from inconsistent updates when multiple requests attempt to reserve the same product simultaneously.

This is particularly important in an ERP system where multiple Sales Orders may require the same inventory.

🚚 Dispatch Management

After an order has been confirmed and inventory has been reserved, the order can be dispatched.

The dispatch module maintains:

Sales Order
Dispatch Date
Tracking Number
Dispatch Status
Creation Date

Example:

Sales Order: SO-001
Tracking Number: FR-2026-0001
Status: DISPATCHED

During dispatch, the system processes the reserved inventory and updates the Sales Order status.

The final workflow becomes:

PENDING_CONFIRMATION
        ↓
CONFIRMED
        ↓
DISPATCHED
👥 User Roles

The system supports two primary user roles.

👨‍💼 ADMIN

The Admin has access to restricted operational activities.

Admin can:

View business records
View inventory
Confirm Sales Orders
Reserve inventory
Process dispatches
Perform administrative operations
👩‍💼 SALES_USER

The Sales User handles customer and sales activities.

Sales User can:

Create customers
Create enquiries
Create quotations
Create Sales Orders
View inventory availability
Manage sales-related information

Restricted operations such as Sales Order confirmation are protected by backend role authorization.

🔐 Authentication & Authorization

The application implements authentication using JWT (JSON Web Token).

Login Process
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

The JWT contains information such as:

User ID
Email
Role

The token is then used to access protected APIs.

🔑 Role-Based Authorization

Authentication and authorization are handled separately.

Authentication verifies the identity of the user.

Authorization verifies whether the user has permission to perform an operation.

For example:

SALES_USER
    ↓
Create Sales Order
    ↓
Allowed

But:

SALES_USER
    ↓
Confirm Sales Order
    ↓
Denied

Whereas:

ADMIN
    ↓
Confirm Sales Order
    ↓
Allowed

This authorization is enforced on the backend through middleware.

🗄️ Database Design

Fundsroom ERP uses PostgreSQL as its primary database.

The database contains 12 main tables.

Table	Purpose
users	User accounts and roles
customers	Customer information
products	Product details
inventory	Available and reserved stock
enquiries	Customer enquiries
enquiry_items	Products in enquiries
quotations	Customer quotations
quotation_items	Products in quotations
sales_orders	Sales Orders
sales_order_items	Products in Sales Orders
inventory_reservations	Reserved inventory
dispatches	Dispatch information
🔗 Database Relationships

The major relationships are structured as:

Customer
   ↓
Enquiry
   ↓
Enquiry Items
   ↓
Products
Customer
   ↓
Quotation
   ↓
Quotation Items
   ↓
Products
Quotation
   ↓
Sales Order
   ↓
Sales Order Items
   ↓
Products
Products
   ↓
Inventory
   ↓
Inventory Reservations
Sales Order
   ↓
Dispatch

Primary keys and foreign keys maintain relationships between these entities.

🏗️ System Architecture

The application follows a client-server architecture.

                   ┌──────────────────────┐
                   │    React Frontend    │
                   │      Vite            │
                   └──────────┬───────────┘
                              │
                              │ Axios / REST API
                              ▼
                   ┌──────────────────────┐
                   │   Express.js API     │
                   │    Node.js Backend   │
                   └──────────┬───────────┘
                              │
                              │ PostgreSQL Queries
                              ▼
                   ┌──────────────────────┐
                   │      PostgreSQL      │
                   │       Database      │
                   └──────────────────────┘

The frontend handles user interaction and presentation.

The backend handles:

Business logic
Authentication
Authorization
Validation
API requests
Database operations
Inventory transactions

PostgreSQL handles persistent storage and relational data management.

🌐 Frontend

The frontend is developed using React.js and Vite.

The application provides separate interfaces for:

Login
Dashboard
Customers
Enquiries
Quotations
Sales Orders
Inventory
Dispatches

The frontend communicates with the backend using Axios.

JWT authentication tokens are automatically attached to protected API requests.

⚙️ Backend

The backend is developed using:

Node.js
Express.js
PostgreSQL
JWT
bcryptjs

The backend follows a modular structure with:

Routes
Controllers
Middleware
Database configuration
Services

This structure separates responsibilities and makes the backend easier to maintain.

🔗 REST API

The backend exposes RESTful API modules.

Module	Endpoint
Authentication	/api/auth
Customers	/api/customers
Enquiries	/api/enquiries
Quotations	/api/quotations
Sales Orders	/api/sales-orders
Inventory	/api/inventory
Dispatches	/api/dispatches

The APIs support operations such as:

Create
Read
Update
Status management
Confirmation
Reservation
Dispatch processing
📂 Project Structure
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
🛠️ Technology Stack
Frontend
React.js
JavaScript
React Router
Axios
HTML5
CSS3
Vite
Backend
Node.js
Express.js
JavaScript
REST APIs
JWT
bcryptjs
Database
PostgreSQL
pgAdmin
SQL
Testing & Development
Postman
Git
GitHub
Visual Studio Code
🧪 API Testing

The backend APIs were tested using Postman.

The testing process covered:

User registration
User login
JWT authentication
Role authorization
Customer creation
Enquiry creation
Quotation creation
Sales Order creation
Sales Order confirmation
Inventory availability
Inventory reservation
Insufficient stock validation
Dispatch creation

Both successful and failure scenarios were tested.

⚠️ Error Handling

The backend handles different types of application errors.

Examples include:

Missing required fields
Invalid credentials
Duplicate users
Invalid roles
Unauthorized access
Invalid or expired JWT
Insufficient inventory
Invalid Sales Order status
Database errors
Invalid API requests

The frontend displays appropriate error messages based on backend responses.

🔒 Security Implementation

The application implements multiple security mechanisms.

Password Hashing

Passwords are hashed using bcrypt before being stored in PostgreSQL.

JWT Authentication

JWT tokens are generated after successful authentication and used for protected API requests.

Role Authorization

Backend middleware validates whether the authenticated user has the required role.

Environment Variables

Database credentials and JWT secrets are maintained through environment variables rather than being hardcoded into the application.

Parameterized Queries

PostgreSQL parameterized queries are used for database operations.

Protected APIs

Business APIs require valid authentication tokens.

📊 Sample Inventory

The project uses sample industrial products for demonstrating the ERP workflow.

Product	Initial Stock
Industrial Motor	50
Hydraulic Pump	30
Steel Valve	100

Example inventory lifecycle:

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
💻 Local Development
Prerequisites

The following software is required:

Node.js
npm
PostgreSQL
pgAdmin
Git
Visual Studio Code
Database

Create the PostgreSQL database:

erp_db

Configure the database connection and JWT secret using the backend environment variables.

Backend

The backend runs on:

http://localhost:5000

The backend provides the REST API used by the React frontend.

Frontend

The React development server runs on:

http://localhost:5173

The frontend communicates with the backend through the REST API.

🚀 Deployment Architecture

The project is structured so that the frontend and backend can be deployed independently.

React Frontend
      ↓
Frontend Hosting
      ↓
Express / Node.js Backend
      ↓
PostgreSQL Database

Environment variables can be configured separately for development and production environments.

📌 Key Technical Highlights
1. Full-Stack Development

The project combines frontend, backend, database, authentication, and business logic into one complete application.

2. End-to-End Business Workflow

The application connects the complete process from customer enquiry to dispatch.

3. Secure Authentication

JWT and bcrypt are used for secure authentication and password management.

4. Role-Based Access

Different users receive different permissions according to their roles.

5. Inventory Reservation

Inventory is reserved only after successful Sales Order confirmation.

6. Transaction Management

Inventory-related operations are executed using PostgreSQL transactions.

7. Row-Level Locking

FOR UPDATE is used to prevent conflicting inventory updates.

8. REST API Architecture

The frontend and backend communicate through structured REST APIs.

9. Relational Database

PostgreSQL maintains structured relationships between customers, products, orders, inventory, and dispatches.

10. API Testing

Postman was used to test and validate backend functionality.

📈 Example End-to-End Scenario

A typical business transaction in the system works as follows:

Customer
"ABC Industries"
        ↓
Creates Enquiry
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

This demonstrates how different ERP modules work together as one integrated workflow.

🔮 Future Enhancements

The system can be extended with:

📊 Advanced dashboard analytics
📈 Sales reports
📦 Inventory reports
🔎 Advanced search and filtering
📄 PDF quotation generation
📧 Email notifications
📝 Audit logs
🧪 Automated unit and integration testing
🐳 Docker containerization
☁️ Cloud deployment
📱 Improved mobile responsiveness
📊 Business intelligence and reporting
🎓 Project Significance

Fundsroom ERP demonstrates practical implementation of full-stack software engineering concepts.

The project combines:

Frontend Development
Backend Development
REST API Development
Database Design
Authentication
Authorization
Business Logic
Transaction Management
Inventory Management
API Testing
Version Control

Rather than implementing each feature independently, the project connects them into a complete business workflow.

👩‍💻 Developer
Rajeswaree Nath

B.Tech – Computer Science & Technology

Nalanda Institute of Technology, Bhubaneswar
BPUT

Areas of Interest
Software Engineering
Full-Stack Development
Java & Python
Artificial Intelligence
Machine Learning
Backend Development
Database Systems
⭐ Project Summary

Fundsroom ERP System is a full-stack ERP application that manages the complete workflow from Customer Enquiry to Product Dispatch.

The system provides a centralized platform for managing:

Customers → Enquiries → Quotations → Sales Orders → Inventory → Dispatches

It demonstrates practical use of React.js, Node.js, Express.js, PostgreSQL, REST APIs, JWT authentication, bcrypt, role-based authorization, database relationships, PostgreSQL transactions, inventory reservation, and API testing.

The project focuses on building a realistic, secure, and transaction-safe ERP workflow rather than implementing isolated CRUD operations.
