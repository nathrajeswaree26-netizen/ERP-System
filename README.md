🚀 Fundsroom ERP System
Full-Stack Enterprise Resource Planning System

React.js • Node.js • Express.js • PostgreSQL • JWT

📌 About the Project

Fundsroom ERP is a full-stack Enterprise Resource Planning (ERP) application developed to manage a complete business workflow from customer enquiry to final product dispatch.

The project was developed as a technical case study to demonstrate how a real-world enterprise application can connect customer management, sales processing, inventory management, authentication, authorization, and dispatch operations in a single system.

Complete Business Workflow

Customer → Enquiry → Quotation → Sales Order → Inventory Reservation → Dispatch

🎯 Project Objective

The main objective of Fundsroom ERP is to provide a centralized platform for managing business operations efficiently and securely.

The system is designed to:

Manage customer information
Create and manage customer enquiries
Prepare quotations
Convert accepted quotations into Sales Orders
Check product availability before order confirmation
Reserve inventory for confirmed orders
Process product dispatches
Maintain accurate inventory records
Provide secure role-based access
Maintain consistency of business data using database transactions
🏢 Business Problem

In a traditional business process, customer details, enquiries, quotations, orders, inventory, and dispatch information may be managed separately.

This can lead to:

Manual errors
Duplicate information
Inventory inconsistencies
Difficulty tracking orders
Unauthorized access
Poor visibility of the complete business process

Fundsroom ERP addresses these problems by connecting all major business operations through a single centralized application.

🔄 Complete Business Workflow

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

↓

Inventory Updated

👥 User Roles
👑 ADMIN

The Admin has access to important operational activities such as:

View business records
View inventory
Confirm Sales Orders
Reserve inventory
Process dispatches
Manage inventory-related operations
👨‍💼 SALES USER

The Sales User can:

Create customers
Create enquiries
Create quotations
View inventory availability
Create Sales Orders from accepted quotations

Role-based permissions are enforced on the backend to ensure that users cannot perform unauthorized operations.

✨ Key Features
🔐 Authentication
User registration
User login
JWT-based authentication
Password hashing using bcrypt
Protected API routes
Role-based authorization
Secure session handling
👥 Customer Management
Create customers
View customer records
Store company information
Store contact person details
Maintain customer address and contact information
📩 Enquiry Management
Create customer enquiries
Select customers
Add multiple products
Specify product quantities
View enquiry records
📄 Quotation Management
Create quotations
Add multiple quotation items
Set product quantities
Set unit prices
Calculate quotation totals
Manage quotation status
Convert accepted quotations into Sales Orders
🛒 Sales Order Management
Create Sales Orders from accepted quotations
View Sales Orders
Track order status
Confirm Sales Orders
Validate inventory before confirmation
📦 Inventory Management
View product inventory
Track available quantity
Track reserved quantity
Reserve stock for confirmed orders
Prevent orders when sufficient inventory is unavailable
🚚 Dispatch Management
Process confirmed Sales Orders
Enter tracking numbers
Create dispatch records
Release reserved inventory
Update order status to DISPATCHED
🖥️ Application Screenshots
🔐 Login Page

The login page provides secure access to the ERP system using the user's email and password.

[Insert Login Screenshot Here]

📊 Dashboard

The dashboard provides access to the major ERP modules including Customers, Enquiries, Quotations, Sales Orders, Inventory, and Dispatches.

[Insert Dashboard Screenshot Here]

👥 Customer Management

The Customer module allows users to create and view customer information.

[Insert Customer Screenshot Here]

📩 Enquiry Management

The Enquiry module allows Sales Users to create enquiries and add required products and quantities.

[Insert Enquiry Screenshot Here]

📄 Quotation Management

The Quotation module allows users to prepare quotations based on customer requirements and calculate the total quotation amount.

[Insert Quotation Screenshot Here]

🛒 Sales Order Management

Accepted quotations can be converted into Sales Orders. Admin users can confirm orders after validating inventory.

[Insert Sales Order Screenshot Here]

📦 Inventory Management

The Inventory module displays available and reserved product quantities.

[Insert Inventory Screenshot Here]

🚚 Dispatch Management

The Dispatch module allows Admin users to process confirmed orders and add tracking information.

[Insert Dispatch Screenshot Here]

🏗️ System Architecture

Fundsroom ERP follows a three-layer architecture:

Frontend

React.js

Handles:

User interface
Navigation
Forms
API communication
User interactions
Backend

Node.js + Express.js

Handles:

REST APIs
Business logic
Authentication
Authorization
Database operations
Transactions
Database

PostgreSQL

Stores:

Users
Customers
Products
Inventory
Enquiries
Quotations
Sales Orders
Reservations
Dispatches
Architecture Flow

React.js Frontend

↓

Axios / REST API

↓

Node.js + Express.js Backend

↓

PostgreSQL Database

🛠️ Technology Stack
Technology	Purpose
React.js	Frontend development
React Router	Frontend navigation
Axios	API communication
Node.js	Backend runtime
Express.js	REST API development
PostgreSQL	Relational database
JWT	Authentication
bcryptjs	Password hashing
Postman	API testing
pgAdmin	Database management
Vite	Frontend build tool
Git	Version control
GitHub	Source code repository
🗄️ Database Design

The application uses PostgreSQL as the main relational database.

The system contains 12 main tables:

Users
Customers
Products
Inventory
Enquiries
Enquiry Items
Quotations
Quotation Items
Sales Orders
Sales Order Items
Inventory Reservations
Dispatches
Main Data Relationship

Users

→ Enquiries
→ Quotations

Customers

→ Enquiries
→ Quotations
→ Sales Orders

Products

→ Inventory
→ Enquiry Items
→ Quotation Items
→ Sales Order Items
→ Inventory Reservations

Enquiries

→ Quotations

Quotations

→ Sales Orders

Sales Orders

→ Inventory Reservations
→ Dispatches

Foreign keys are used to maintain relationships and data consistency between tables.

🔐 Authentication Flow

The application uses JWT-based authentication.

Login Process

User enters Email and Password

↓

Backend validates credentials

↓

Password verified using bcrypt

↓

JWT token generated

↓

Token returned to frontend

↓

Frontend sends token with protected requests

↓

Backend verifies JWT

↓

Backend checks user role

↓

Request is allowed or rejected

Protected APIs use:

Authorization: Bearer JWT Token

🛡️ Role-Based Authorization

Authentication determines who the user is.

Authorization determines what the user is allowed to do.

The backend uses authorization middleware to control access to protected operations.

For example:

SALES_USER

Can create customers, enquiries, quotations, and Sales Orders.

ADMIN

Can confirm Sales Orders and process dispatches.

Unauthorized requests are rejected by the backend.

This ensures that security is not dependent only on frontend restrictions.

📦 Inventory Reservation System

Inventory reservation is one of the most important technical features of the project.

When an Admin confirms a Sales Order, the system performs the inventory operation inside a PostgreSQL transaction.

Inventory Process

Admin confirms Sales Order

↓

Start PostgreSQL Transaction

↓

Lock Inventory Row using FOR UPDATE

↓

Check Available Quantity

↓

Is sufficient stock available?

If YES:

Reserve Stock

↓

Decrease Available Quantity

↓

Increase Reserved Quantity

↓

Create Inventory Reservation

↓

Update Sales Order

↓

Commit Transaction

If NO:

Reject Sales Order Confirmation

↓

Rollback Transaction

The system therefore prevents an order from being confirmed when sufficient inventory is not available.

🔒 Why FOR UPDATE is Used

PostgreSQL FOR UPDATE is used to lock the selected inventory row during the transaction.

This is important when multiple users may attempt to process orders at the same time.

Without proper locking, two orders could potentially reserve the same available inventory.

Using FOR UPDATE helps ensure that inventory remains accurate and consistent.

📊 Example Inventory Flow

Suppose the system has:

Industrial Motor

Available Quantity: 50

Reserved Quantity: 0

A Sales Order requests:

5 Industrial Motors

After confirmation:

Available Quantity: 45

Reserved Quantity: 5

After dispatch:

Available Quantity: 45

Reserved Quantity: 0

This allows the system to track both available and temporarily reserved stock.

🚚 Dispatch Workflow

Only confirmed Sales Orders can be dispatched.

Dispatch Process

Confirmed Sales Order

↓

Select Sales Order

↓

Enter Tracking Number

↓

Start Transaction

↓

Create Dispatch Record

↓

Release Reserved Quantity

↓

Update Sales Order Status

↓

DISPATCHED

This ensures that the order lifecycle is properly maintained from confirmation to final dispatch.

🔗 REST API Structure
Authentication
POST /api/auth/register
POST /api/auth/login
Customers
GET /api/customers
POST /api/customers
Enquiries
GET /api/enquiries
POST /api/enquiries
Quotations
GET /api/quotations
POST /api/quotations
PATCH /api/quotations/:id/status
Sales Orders
GET /api/sales-orders
POST /api/sales-orders
GET /api/sales-orders/:id
PATCH /api/sales-orders/:id/confirm
Inventory
GET /api/inventory
Dispatches
GET /api/dispatches
POST /api/dispatches
📁 Project Structure

The project is organized into separate frontend and backend applications.

Backend

The backend contains:

Configuration
Controllers
Routes
Authentication middleware
Role middleware
Database connection
Server configuration
Frontend

The frontend contains:

React pages
Components
API services
Routing
Application styling

This separation keeps the application modular and easier to maintain.

🧪 Testing

Postman was used to test the backend APIs.

The following scenarios were tested:

Authentication Testing
User registration
User login
Invalid credentials
JWT authentication
Invalid token
Expired token
Authorization Testing
Admin access
Sales User access
Unauthorized role access
Protected API access
Business Workflow Testing
Customer creation
Enquiry creation
Quotation creation
Quotation status update
Sales Order creation
Sales Order confirmation
Inventory reservation
Dispatch creation
Inventory Testing
Sufficient inventory
Insufficient inventory
Inventory reservation
Reserved quantity update
Inventory release after dispatch
🔒 Security Features

The application implements several security mechanisms:

JWT authentication
bcrypt password hashing
Backend role authorization
Protected API routes
Parameterized SQL queries
Environment variables
PostgreSQL transactions
Inventory row locking
Server-side permission validation

Database passwords and JWT secrets are stored in environment variables and are not committed to GitHub.

⚙️ Installation and Setup
Requirements

Before running the project, install:

Node.js
npm
PostgreSQL
pgAdmin
Git
Database Setup

Create a PostgreSQL database named:

erp_db

Make sure PostgreSQL is running on:

localhost:5432

Create the required tables and insert the required product and inventory data.

Backend Setup

Navigate to the backend directory.

Install the required dependencies.

Create a .env file containing:

Server port
PostgreSQL host
PostgreSQL port
Database name
Database username
Database password
JWT secret

Start the backend server.

Backend URL:

http://localhost:5000

Frontend Setup

Navigate to the frontend directory.

Install the required dependencies.

Start the React development server.

Frontend URL:

http://localhost:5173

📈 Project Development Process

The project was developed in multiple stages.

Phase 1 – Requirement Analysis

The business workflow and user roles were identified.

Phase 2 – Database Design

The PostgreSQL database structure and relationships were designed.

Phase 3 – Backend Development

REST APIs and business logic were implemented using Node.js and Express.js.

Phase 4 – Authentication

JWT authentication and bcrypt password hashing were implemented.

Phase 5 – Authorization

Role-based access control was implemented using backend middleware.

Phase 6 – Inventory Management

Inventory availability, reservation, and transaction handling were implemented.

Phase 7 – Frontend Development

React pages and API integration were developed.

Phase 8 – API Testing

Backend APIs were tested using Postman.

Phase 9 – Integration

Frontend, backend, and PostgreSQL database were integrated.

Phase 10 – Version Control

The complete project was managed using Git and pushed to GitHub.

🎓 Learning Outcomes

This project provided practical experience in:

Full-stack web development
React.js
Node.js
Express.js
PostgreSQL
REST API development
JWT authentication
bcrypt password hashing
Role-based authorization
SQL and relational database design
Database transactions
PostgreSQL row locking
Inventory management
API testing
Git and GitHub
Frontend-backend integration
🚀 Future Enhancements

The following features can be added in future versions:

Dashboard analytics
Advanced search and filtering
Pagination
PDF quotation generation
Email notifications
Inventory reports
Sales reports
Audit logs
Automated unit testing
Integration testing
Docker deployment
Cloud deployment
Advanced user management
🏆 Project Outcome

Fundsroom ERP successfully demonstrates a complete enterprise business workflow in one full-stack application.

The system connects:

Customer Management

↓

Enquiry Management

↓

Quotation Management

↓

Sales Order Management

↓

Inventory Reservation

↓

Dispatch Management

The project demonstrates the practical integration of frontend development, backend development, relational database management, authentication, authorization, transaction processing, and inventory management.

⭐ Project Highlights
Area	Implementation
Frontend	React.js
Backend	Node.js + Express.js
Database	PostgreSQL
Authentication	JWT
Password Security	bcryptjs
Authorization	Role-Based Access
API Communication	Axios
Inventory	Reservation System
Concurrency Control	PostgreSQL FOR UPDATE
Transactions	PostgreSQL Transactions
API Testing	Postman
Database Tool	pgAdmin
Version Control	Git + GitHub
👩‍💻 Developer
Rajeswaree Nath

B.Tech – Computer Science & Technology

Nalanda Institute of Technology, Bhubaneswar

Biju Patnaik University of Technology (BPUT)

GitHub

https://github.com/nathrajeswaree26-netizen

Project Repository

https://github.com/nathrajeswaree26-netizen/ERP-System

📌 Final Project Summary

Fundsroom ERP is a complete full-stack ERP solution that manages the business process from the initial customer enquiry to final dispatch.

The project demonstrates practical implementation of:

React.js + Node.js + Express.js + PostgreSQL + JWT + REST APIs + Role-Based Authorization + Database Transactions + Inventory Reservation

It was developed as a technical case study to demonstrate real-world full-stack development and enterprise application concepts.
