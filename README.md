# Store Rating Web Application

This is a **web application** where users can submit ratings for stores registered on the platform. Ratings range from **1 to 5**. The application uses a **single login system** for all users, and features are **role-based**, meaning users can only access functions allowed for their role.

---
Project Description

The Store Rating Web Application is a full-stack platform that allows users to submit ratings for stores registered on the platform. Ratings range from 1 to 5 and are linked to individual users and stores. The application uses a single login system with role-based access control, so different types of users have different levels of access and functionality.

Roles

System Administrator: Can manage users and stores, view dashboards, and apply filters on listings.

Normal User: Can sign up, log in, browse stores, submit ratings, and modify their ratings.

Store Owner: Can log in, view ratings submitted for their store, and see average store ratings.

Features

Secure authentication using email and password, with hashed passwords and JWT tokens for login sessions.

Authorization ensures users only access routes and features allowed for their role.

Users can submit, update, and view ratings for stores.

Admins can manage stores and users, view dashboards, and filter data.

Responsive frontend built with React.js for easy navigation and interaction.

Backend API built with Node.js and Express, connected to a MySQL database storing users, stores, and

in 2 lines

The Store Rating Web Application lets users submit and manage ratings (1–5) for registered stores with a single login system. Features are role-based, giving admins, normal users, and store owners different access and dashboards.

## **User Roles**

1. **System Administrator**  
2. **Normal User**  
3. **Store Owner**  

---

## **Functionalities**

### **System Administrator**
- Can add new stores, normal users, and admin users.
- Dashboard shows:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- Can add new users with:
  - Name, Email, Password, Address
- Can view all stores:
  - Name, Email, Address, Average Rating
- Can view all users:
  - Name, Email, Address, Role
  - Store Owner ratings included
- Can filter listings by Name, Email, Address, and Role
- Can view detailed information of all users
- Can log out

### **Normal User**
- Can sign up and log in
- Signup fields: Name, Email, Address, Password
- Can update password after login
- Can view all stores
- Can search stores by Name or Address
- Store listings show:
  - Store Name, Address, Overall Rating
  - User’s submitted rating
  - Options to submit or modify rating
- Can submit ratings (1–5) for stores
- Can log out

### **Store Owner**
- Can log in
- Can update password after login
- Dashboard shows:
  - List of users who submitted ratings for their store
  - Average rating of their store
- Can log out

---

## **Backend**

- Built with **Node.js** and **Express**
- **Authentication**
  - Users log in with **email and password**
  - Passwords are securely **hashed**
  - Uses **JWT (JSON Web Tokens)** for secure login sessions
- **Authorization**
  - Role-based access ensures users can only access allowed features
  - Admin-only APIs are protected from normal users
- **API Endpoints**
  - Users can sign up, log in, update passwords
  - Admins can manage users and stores
  - Users can submit ratings
  - Store owners can view ratings for their store
- **Security**
  - JWT tokens protect sensitive endpoints
  - Role checks prevent unauthorized access
  - Passwords are never stored in plain text

---
