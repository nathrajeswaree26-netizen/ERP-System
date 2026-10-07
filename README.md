# Fundsroom ERP System

## About the Project

Fundsroom ERP is a full-stack Enterprise Resource Planning system developed as a technical case study for managing a complete business sales and inventory workflow.

The project was developed to understand and implement how a real-world business application works from the initial customer enquiry to the final product dispatch.


✨ Key Features
🔐 Authentication & Authorization
JWT-based authentication
Secure password hashing using bcrypt
Role-based access control
ADMIN and SALES_USER roles
Protected frontend routes
Protected backend APIs
👥 Customer Management
Create customers
View customer records
Store company and contact information
📩 Enquiry Management
Create customer enquiries
Add multiple products to an enquiry
Specify product quantities
View enquiry details
📄 Quotation Management
Create quotations
Add multiple quotation items
Calculate quotation totals
Manage quotation status
Convert accepted quotations into Sales Orders
🛒 Sales Order Management
Create Sales Orders from accepted quotations
View Sales Orders
ADMIN-only Sales Order confirmation
Validate inventory before confirmation
📦 Inventory Management
View available inventory
Track reserved inventory
Reserve stock during Sales Order confirmation
Prevent confirmation when stock is insufficient
🚚 Dispatch Management
Process confirmed Sales Orders
Add tracking numbers
Record dispatch details
Release reserved inventory after dispatch
👤 User Roles
Role	Permissions
ADMIN	View records, manage inventory, confirm Sales Orders, process dispatches
SALES_USER	Manage customers, enquiries, quotations, Sales Orders and view inventory
🏗️ System Architecture
┌───────────────────────────────┐
│        React Frontend         │
│                               │
│  Login │ Dashboard │ Modules  │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express.js     │
│                               │
│ Controllers │ Routes          │
│ Middleware  │ JWT Auth        │
│ Business Logic                │
└───────────────┬───────────────┘
                │
                │ SQL
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
│                               │
│ Users │ Customers │ Products  │
│ Orders │ Inventory │ Dispatch │
└───────────────────────────────┘
🛠️ Technology Stack
Layer	Technologies
Frontend	React.js, React Router, Axios, HTML5, CSS3
Backend	Node.js, Express.js, REST API
Database	PostgreSQL
Authentication	JWT, bcryptjs
API Testing	Postman
Database Tool	pgAdmin
Build Tool	Vite
Version Control	Git, GitHub

🗄️ Database Design

The application uses PostgreSQL with the following tables:

users
customers
products
inventory
enquiries
enquiry_items
quotations
quotation_items
sales_orders
sales_order_items
inventory_reservations
dispatches
🔗 Entity Workflow
Customer
   │
   ▼
Enquiry
   │
   ▼
Quotation
   │
   ▼
Sales Order
   │
   ▼
Inventory Reservation
   │
   ▼
Dispatch
🔐 Authentication Flow
        User Login
            │
            ▼
     Email + Password
            │
            ▼
     bcrypt Verification
            │
            ▼
       JWT Generated
            │
            ▼
      Frontend Storage
            │
            ▼
   Authorization Header
            │
            ▼
      JWT Verification
            │
            ▼
    Role Authorization
            │
            ▼
       API Access
📦 Inventory Reservation Logic

Inventory consistency is maintained using a PostgreSQL transaction during Sales Order confirmation.

Confirmation Process
Confirm Sales Order
        │
        ▼
Start Transaction
        │
        ▼
Lock Inventory Row
     (FOR UPDATE)
        │
        ▼
Check Available Stock
        │
   ┌────┴────┐
   │         │
Enough     Insufficient
Stock        Stock
   │           │
   ▼           ▼
Reserve      Reject
Stock        Order
   │
   ▼
Create Reservation
   │
   ▼
Update Order Status
   │
   ▼
COMMIT

This prevents inconsistent inventory updates when multiple users attempt to reserve the same stock.

🚚 Dispatch Workflow
CONFIRMED
    │
    ▼
Select Sales Order
    │
    ▼
Enter Tracking Number
    │
    ▼
Create Dispatch
    │
    ▼
Release Reserved Stock
    │
    ▼
DISPATCHED
