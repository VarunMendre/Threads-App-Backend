# 🧵 Threads Backend (GraphQL)

A scalable backend for a **Threads-like social media application** built using **GraphQL**, following clean architecture principles (Resolvers → Services → DAO → Database).

---

## 🚀 Tech Stack

* **Node.js** – Runtime
* **Apollo Server (GraphQL)** – API Layer
* **PostgreSQL** *(upcoming)* – Database
* **Prisma ORM** *(upcoming)* – Database Access
* **JWT** *(upcoming)* – Authentication
* **Nodemon** – Development

---

## 📁 Project Structure

```
src/
 ├── index.js          # Entry point (Apollo Server setup)
 ├── config/           # Environment & config files
 ├── schema/           # GraphQL type definitions
 ├── resolvers/        # GraphQL resolvers
 ├── services/         # Business logic layer
 ├── dao/              # Database access layer (Prisma)
 ├── utils/            # Utility functions
```

---

## 🧠 Architecture Overview

```
Client → GraphQL API → Resolvers → Services → DAO → Database
```

* **Resolvers** → Handle GraphQL requests
* **Services** → Business logic
* **DAO** → Direct DB interaction
* **Prisma** → ORM layer
* **PostgreSQL** → Database

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/threads-backend.git
cd threads-backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env
PORT=8000
```

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 🧪 Test GraphQL API

Open in browser:

```
http://localhost:8000/graphql
```

Run:

```graphql
query {
  hello
}
```

Expected response:

```json
{
  "data": {
    "hello": "Threads Backend Running 🚀"
  }
}
```

---

## 📌 Current Features (Phase 1)

* ✅ Apollo GraphQL Server setup
* ✅ Environment configuration
* ✅ Scalable folder structure
* ✅ Basic query (`hello`)

---

## 🔜 Upcoming Phases

* 🔹 Phase 2: PostgreSQL + Prisma setup
* 🔹 Phase 3: GraphQL schema design
* 🔹 Phase 4: DAO & Service layer implementation
* 🔹 Phase 5: Authentication (JWT)
* 🔹 Phase 6: Social features (Threads, Likes, Comments)
* 🔹 Phase 7: Production optimizations

---

## 🎯 Learning Goals

This project is built to:

* Master **GraphQL (Queries, Mutations, Resolvers)**
* Understand **Backend Architecture (LLD concepts)**
* Build a **production-ready Node.js backend**
* Learn **Prisma ORM + PostgreSQL**
* Implement **Authentication & Authorization**

---

## 🤝 Contributing

This is a personal learning project, but suggestions and improvements are always welcome!

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Varun Mendre**

---

⭐ If you find this project useful, consider giving it a star!
