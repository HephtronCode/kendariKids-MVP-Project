# KendariKids - A Modern School Management System (MVP)

![KendariKids Demo](./readme-assets/demo.png) 
<!-- You will need to create a `readme-assets` folder and add a screenshot of your app named `demo.png` for this image to show up -->

**KendariKids** is the Minimum Viable Product (MVP) for a modern, responsive, and user-friendly school management system designed for schools in Africa, from nursery through secondary levels. Built on the MERN stack with a cutting-edge frontend, it provides a seamless and intuitive experience for administrators, teachers, and parents.

---

## ✨ Features

-   **Role-Based Access Control:** Secure, distinct dashboards and permissions for different user roles (Teacher, Parent, etc.).
-   **JWT Authentication:** Robust and secure user authentication using JSON Web Tokens.
-   **Class Management:** An intuitive interface for teachers to create and manage their classes.
-   **Attendance Tracking:** A real-time attendance system allowing teachers to mark student presence, which parents can monitor.
-   **Assignment Management:** Teachers can create and list assignments for their classes.
-   **Fully Responsive UI:** A mobile-first design that looks beautiful on all devices, from phones to desktops.
-   **Light & Dark Mode:** A theme switcher for user comfort and preference.

---

## 🛠️ Tech Stack

This project is a full-stack MERN application.

-   **Frontend:**
    -   **Framework:** React 18 (with Vite)
    -   **Styling:** Tailwind CSS (v4 Alpha)
    -   **Component Library:** shadcn/ui
    -   **Routing:** React Router v6
    -   **API Communication:** Axios
-   **Backend:**
    -   **Runtime:** Node.js
    -   **Framework:** Express.js
    -   **Database:** MongoDB
    -   **ODM:** Mongoose
-   **Authentication:**
    -   **Strategy:** JSON Web Tokens (JWT)
    -   **Password Hashing:** bcrypt.js

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or newer recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (recommended).

### Local Development Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/kendarikids-mvp.git
    cd kendarikids-mvp
    ```

2.  **Setup the Backend Server**
    -   Navigate to the server directory:
        ```bash
        cd server
        ```
    -   Install the dependencies:
        ```bash
        npm install
        ```
    -   Create a `.env` file in the `/server` directory and add the following environment variables. **Do not commit this file to Git.**
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=a_very_strong_and_long_secret_key_for_kendarikids
        ```
    -   Start the development server:
        ```bash
        npm run dev
        ```
        The server will be running on `http://localhost:5000`.

3.  **Setup the Frontend Client**
    -   From the root directory, navigate to the client directory:
        ```bash
        cd client
        ```
    -   Install the dependencies:
        ```bash
        npm install
        ```
    -   Start the client development server:
        ```bash
        npm run dev
        ```
        The client application will be running on `http://localhost:5173`.

---

## 🚢 Deployment

This application is designed to be easily deployable on modern hosting platforms.

-   **Backend (Server):**
    -   **Recommended Host:** [Render](https://render.com/)
    -   **Configuration:**
        -   **Root Directory:** `server`
        -   **Build Command:** `npm install`
        -   **Start Command:** `npm start`
        -   **Database:** Connect to a production MongoDB Atlas cluster.
        -   Remember to add your production environment variables in Render's dashboard.

-   **Frontend (Client):**
    -   **Recommended Host:** [Vercel](https://vercel.com/)
    -   **Configuration:**
        -   **Root Directory:** `client`
        -   Vercel will automatically detect the Vite framework and configure the build settings.
    -   **Important:** Before deploying, update all API URLs in the `client/src/api/` service files to point to your live backend URL from Render.

---

