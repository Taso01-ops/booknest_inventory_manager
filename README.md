# BookNest Inventory Manager

**University Assignment Full-stack project using React (frontend), Node.js + Express (backend), and MySQL (via phpMyAdmin).**

---

## Features

### **Inventory Management**
- **Create a New Book** – Add a new book to the inventory with details like title, ISBN, price, stock, etc.
- **Read All Books** – View all the books in the catalog with their details.
- **Update Book Details** – Edit details of a book (e.g., price, stock, publication year).
- **Delete a Book** – Remove a book from the inventory.
- **Search Books by Title** – Find books by partial title match.

### **Customer-Facing Features**
- **Customer Registration** – Register customers with details like name, email, phone, shipping address, and password.
- **Customer Login** – Login using email and password.
- **Browse Book Catalog** – View all available books (title, price, stock).
- **Search Books** – Filter books by title or price range.
- **Place Orders** – Select books, specify quantity, and place an order (with stock deduction).
- **View Order History** – Display past orders of the logged-in customer.

---

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js + Express, JWT Authentication
- **Database**: MySQL (via phpMyAdmin)

---

## Project Scope

### **Customer-Facing Features**
- The BookNest system is designed to simulate an online bookstore for customers to browse books, place orders, and view their order history.
- **Note**: If not implementing an admin panel, books must be manually inserted into the database using SQL `INSERT` statements.

---

## **Page Structure**

The system is implemented as a **Single-Page Application (SPA)** using **React Router** for different pages such as `/login`, `/register`, `/catalog`, and `/orders`.

---

## **Setup Instructions**

### 1. Clone the repository

```bash
git clone https://github.com/your-repository-url.git
cd booknest_inventory_manager

