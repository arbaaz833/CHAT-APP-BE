# 🔐 Node.js JWT Auth API

A secure, scalable backend boilerplate built with **Node.js**, **Express**, **JWT**, **Mongoose**, and **Joi**. Designed with clean architecture to separate concerns between controllers, models, routes, and validations.

## 🚀 Features

- 🔐 **JWT Authentication**
  - Token generation with proper secrets from env variables along with appropriate expiry
  - Renewal of access token through refesh token validation 
  - Secure password storage after hashing
  - Authorization of protected endpoints via middleware
- 📚 **Clean Architecture**
  - Separation of concerns: `controllers`, `models`, `routes`, `validations`
- ✅ **Input Validation with Joi**
  - Secure and extensible schema validations
- 🧠 **MongoDB with Mongoose**
  - Well-structured schema and query logic
- 📦 **Environment-Based Configs**
  - Easily configurable using `.env`
- 💬 **Consistent API Response Format**
  - Strict response format followed across endpoint
  - Proper error and response codes

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **Mongoose**
- **Joi**
- **JWT (jsonwebtoken)**
- **dotenv**

## 📁 Status

<a href="https://jwt-auth-be-production.up.railway.app/status" target="_blank" rel="noopener noreferrer">Check status</a>


