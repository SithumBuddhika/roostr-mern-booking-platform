# Roostr – MERN Room Booking Platform 🐓🏡

![Roostr Logo](./src/assets/logo.png)

Roostr is a full-stack **Airbnb-style room booking platform** built with the **MERN stack**. Guests can browse stays, search available rooms, check pricing, submit booking requests, and share reviews, while hosts can create listings, manage availability, track bookings, and view analytics from a dedicated host dashboard.

This project is part of my portfolio as a **Software Engineering undergraduate at SLIIT**, showcasing full-stack development, responsive UI design, REST API integration, authentication, booking logic, and deployment experience.

---

## 🔗 Links

- **Live Demo:** https://roostr-mern-booking-platform.vercel.app/
- **GitHub Repository:** https://github.com/SithumBuddhika/roostr-mern-booking-platform
- **Figma Design:** https://www.figma.com/design/GSkaUyjHk4TIFkMhdQri7v/Roostr-Website?node-id=0-1&t=8yTHahoXjhXnvRqr-1

---

## 🎨 Design Inspiration

Roostr’s UI is inspired by Airbnb’s product design, especially the home screen, room details page, booking flow, and clean card-based layouts.

All components, layouts, and assets were recreated by me from scratch for learning and portfolio purposes. Airbnb was used only as a visual reference, not as a source of code.

I also used **Figma** to plan and refine most of the screens before implementing them with **React** and **Tailwind CSS**.

---

## ✨ Recent Updates

- Improved **mobile responsiveness** across key screens and prepared mobile screenshot documentation.
- Added a **Reviews & Feedback** system for room listings.
- Added support for guest review submission with ratings and comments.
- Updated room rating/review count after feedback submission.
- Added host-side review support, including host replies to reviews.
- Improved responsive room image/gallery experience for mobile users.
- Polished UI spacing, layout behavior, and navigation for smaller screens.
- Deployed the live demo frontend on **Vercel**.
- Connected deployed API requests to the backend service through Vercel rewrites.
- Added deployment support files such as `vercel.json` and `api/index.js`.

---

## 🧾 Table of Contents

- [Features](#-features)
  - [Guest Experience](#guest-experience)
  - [Reviews & Feedback](#reviews--feedback)
  - [Host Experience](#host-experience)
  - [Booking & Payment Flow](#booking--payment-flow)
  - [Authentication & Security](#authentication--security)
  - [Responsive Design](#responsive-design)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Running the Project Locally](#-running-the-project-locally)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [About the Developer](#-about-the-developer)

---

## ✨ Features

### Guest Experience

- **Home screen with curated listings**
  - Airbnb-inspired listing cards.
  - Displays room title, location, image, price, and quick details.
  - Listings are powered by backend data.

- **Search & filtering**
  - Search by destination, check-in/check-out dates, and number of guests.
  - Search state is shared through `SearchContext`.
  - Search results respect real booking availability from MongoDB.

- **Room details page**
  - Large room image gallery with dynamic images from the backend.
  - Room title, location, property type, guest capacity, beds, and baths.
  - Detailed room description from the room document.
  - Amenity icons grouped into categories such as bathroom, bedroom, kitchen, entertainment, safety, outdoor, and services.
  - “Show all amenities” modal for viewing the complete amenity list.

- **Guest selector**
  - Supports adults, children, infants, and pets.
  - Live guest count update with plus/minus controls.
  - Generates readable guest summaries like `2 guests, 1 infant, 1 pet`.

---

### Reviews & Feedback

- Guests can submit reviews for room listings.
- Reviews include:
  - Star rating
  - Written feedback/comment
  - User details
  - Created date
- Room ratings and review counts are updated based on submitted reviews.
- Hosts can view reviews for their rooms.
- Hosts can reply to guest reviews.
- Review data is stored in MongoDB using a dedicated `Review` model.

---

### Host Experience

- **Become a host**
  - Authenticated users can switch to host mode.
  - Host-only routes are protected using JWT and middleware.

- **Add new room listing**
  - Multi-step listing form connected to MongoDB.
  - Captures room details such as:
    - Title, headline, property type, city, and country
    - Guest capacity, beds, and baths
    - Highlights and amenities
    - Description and host details
    - Pricing
    - Cover image and gallery images

- **Room editing**
  - Hosts can update room information after creating a listing.
  - Supports editing room details, amenities, highlights, and pricing.

- **Host dashboard & analytics**
  - Dedicated host dashboard for tracking room performance.
  - Displays total bookings, revenue, occupancy-related data, and room-level metrics.
  - Uses charts and tables for a cleaner analytics view.

- **Past bookings view**
  - Hosts can view previous bookings, guest information, booking dates, and room details.

---

### Booking & Payment Flow

- **Availability calendar**
  - Loads existing bookings for each room.
  - Blocks already booked dates.
  - Prevents invalid or overlapping booking ranges.
  - Only allows valid `check-in < check-out` date selection.

- **Dynamic price calculation**
  - Uses the room’s nightly price.
  - Calculates total nights using Day.js.
  - Displays the final total before booking confirmation.

- **3-step payment/request flow**
  - Step 1: Add payment details using a demo payment form.
  - Step 2: Write an optional message to the host.
  - Step 3: Review booking details before submitting.

- **Finish booking page**
  - Shows a thank-you message after booking.
  - Generates a unique reservation code.
  - Displays final trip summary with dates, guests, room image, and total price.
  - Generates a PDF booking receipt/ticket for the guest.

> Note: The payment flow is a demo/mock payment experience. No real payment gateway is connected yet.

---

### Authentication & Security

- JWT-based authentication.
- User registration and login.
- Protected backend routes using Express middleware.
- Role-based access for guest and host actions.
- Host-only access for listing management, dashboard analytics, pricing, and booking data.
- CORS configuration for local development and deployed environments.

---

### Responsive Design

- Improved mobile layouts for the main user-facing pages.
- Better room details layout on small screens.
- Mobile-friendly image/gallery behavior.
- Responsive navigation and spacing improvements.
- Better usability across desktop, tablet, and mobile screen sizes.

---

## 🛠 Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Context API
- Axios
- Day.js
- Framer Motion
- Recharts
- jsPDF
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- Cloudinary
- cookie-parser
- serverless-http

### Deployment

- Vercel for the live frontend deployment
- Render for the deployed backend API
- Vercel rewrite rules for forwarding `/api/*` and `/uploads/*` requests to the backend
- MongoDB Atlas for database hosting

---

## 📂 Project Structure

> High-level overview of the main folders and files.

```txt
roostr-mern-booking-platform/
├── api/
│   └── index.js                  # Serverless entry/helper for deployment support
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── hostAnalyticsController.js
│   │   ├── roomController.js
│   │   ├── roomMetaController.js
│   │   ├── searchController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Room.js
│   │   ├── RoomMeta.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── hostAnalyticsRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── roomMetaRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── searchRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── app.js                    # Express app used locally + serverless
│   ├── server.js                 # Local backend server entry
│   └── package.json
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AmenitiesModal.jsx
│   │   ├── BurgerMenu.jsx
│   │   ├── Calendar.jsx
│   │   ├── Footer.jsx
│   │   ├── JustNav.jsx
│   │   ├── Navbar.jsx
│   │   ├── NoSearchNav.jsx
│   │   ├── SearchRibbon.jsx
│   │   ├── SuccessModal.jsx
│   │   ├── SuccessModalForFinish.jsx
│   │   ├── Who.jsx
│   │   └── suggestdesination.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SearchContext.jsx
│   │
│   ├── pages/
│   │   ├── AddNewRoom.jsx
│   │   ├── BecomeHost.jsx
│   │   ├── FinishBooking.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── HostDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── Profile.jsx
│   │   ├── RoomDetails.jsx
│   │   └── Signup.jsx
│   │
│   ├── Screenshots/
│   │   ├── mobile/                # Mobile-view screenshots for responsive UI showcase
│   │   └── ...                    # Desktop screenshots and receipt preview
│   ├── api.js
│   ├── App.js
│   ├── index.css
│   └── index.js
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 🔐 Environment Variables

### Backend – `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

CORS_ORIGIN=http://localhost:3000,https://roostr-mern-booking-platform.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend – optional `.env` at project root

The project mainly uses relative `/api` routes so the deployed frontend can forward requests using the rewrite rules in `vercel.json`.

If you later switch to a separate backend URL, you can add:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/SithumBuddhika/roostr-mern-booking-platform.git
cd roostr-mern-booking-platform
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Create the backend `.env` file

Create a `.env` file inside the `backend` folder and add the required environment variables.

### 5. Start the backend server

```bash
cd backend
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### 6. Start the frontend

Open a new terminal:

```bash
npm start
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## 🖼 Screenshots

The project includes desktop screenshots and a separate mobile screenshot set to showcase the responsive UI improvements.

> Recommended mobile screenshot folder: `src/Screenshots/mobile/`

### Desktop View

<h4 align="center">Home & Search</h4>

<p align="center">
  <img src="src/Screenshots/Home-Screenpng.png" alt="Home screen" width="48%" />
</p>

<p align="center">
  <img src="src/Screenshots/Search1.png" alt="Search Destination" width="48%" />
  <img src="src/Screenshots/Search2.png" alt="Search Dates" width="48%" />
  <img src="src/Screenshots/Search3.png" alt="Search" width="48%" />
</p>

<h4 align="center">Room Details & Amenities</h4>

<p align="center">
  <img src="src/Screenshots/Room-Details.png" alt="Room details" width="48%" />
  <br />
  <img src="src/Screenshots/amenities-modal.png" alt="Amenities Modal" width="48%" />
</p>

<h4 align="center">Booking & Payment</h4>

<p align="center">
  <img src="src/Screenshots/pricing.png" alt="Booking" width="48%" />
  <img src="src/Screenshots/booking1.png" alt="Booking modal" width="26%" />
</p>

<p align="center">
  <img src="src/Screenshots/Payment1.png" alt="Payment Step 1" width="48%" />
  <img src="src/Screenshots/Payment2.png" alt="Payment Step 2" width="48%" />
</p>

<p align="center">
  <img src="src/Screenshots/Payment3.png" alt="Payment Step 3" width="48%" />
  <img src="src/Screenshots/Payment4.png" alt="Thank You After Payment" width="48%" />
</p>

<h4 align="center">Become a Host</h4>

<p align="center">
  <img src="src/Screenshots/become-host.png" alt="Become Host" width="48%" />
</p>

<h4 align="center">Host Dashboard</h4>

<p align="center">
  <img src="src/Screenshots/dashboard-1.png" alt="Host Dashboard" width="48%" />
  <img src="src/Screenshots/dashboard-2.png" alt="Host Dashboard Analytics" width="48%" />
</p>

<h4 align="center">Room & Price Management</h4>

<p align="center">
  <img src="src/Screenshots/roomdetails-edit-1.png" alt="Price Management" width="48%" />
  <img src="src/Screenshots/roomdetails-edit-2.png" alt="Room Management" width="48%" />
</p>

<h4 align="center">Profile, Past Bookings & Receipt</h4>

<p align="center">
  <img src="src/Screenshots/past-bookings.png" alt="Recent Booking" width="48%" />
  <img src="src/Screenshots/booking-receipt.png" alt="Receipt PDF" width="48%" />
</p>

<h4 align="center">Authentication & Menu</h4>

<p align="center">
  <img src="src/Screenshots/sign-in.png" alt="Sign-in" width="48%" />
  <img src="src/Screenshots/sign-up.png" alt="Sign-up" width="48%" />
</p>

<p align="center">
  <img src="src/Screenshots/menu.png" alt="Menu" width="48%" />
  <img src="src/Screenshots/logout.png" alt="Logout" width="48%" />
</p>

### Mobile Responsive View

### Mobile View

#### Home, Search & Room Details

<p align="center">
  <img src="src/Screenshots/mobile-home.png" alt="Mobile Home" width="220" />
  <img src="src/Screenshots/mobile-search.png" alt="Mobile Search" width="217" />
  <img src="src/Screenshots/mobile-room-details.jpg" alt="Mobile Room Details" width="220" />
</p>

#### Reviews, Booking & Payment

<p align="center">
  <img src="src/Screenshots/mobile-reviews.png" alt="Mobile Reviews" width="220" height="452" />
  <img src="src/Screenshots/mobile-booking.png" alt="Mobile Booking" width="220" height="452" />
  <img src="src/Screenshots/mobile-payment.jpg" alt="Mobile Payment" width="220" height="452" />
</p>

#### Profile, Past Trips & Menu

<p align="center">
  <img src="src/Screenshots/mobile-profile.png" alt="Mobile Profile" width="220" />
  <img src="src/Screenshots/mobile-past-trips.png" alt="Mobile Past Trips" width="220" />
  <img src="src/Screenshots/mobile-menu.png" alt="Mobile Menu" width="220" height="448" />
</p>

#### Host Dashboard Mobile View

<p align="center">
  <img src="src/Screenshots/mobile-dahsboard.jpg" alt="Mobile Dashboard" width="222" />
  <img src="src/Screenshots/mobile-dashboard-room-edit.png" alt="Mobile Dashboard Room Edit" width="220" height="452" />
  <img src="src/Screenshots/mobile-dashboard-reviews-feedback-reply-section.png" alt="Mobile Dashboard Room Edit" width="220" height="452" />
</p>

#### Host Dashboard Mobile View Add New Room

<p align="center">
  <img src="src/Screenshots/mobile-dahsboard-newroomadd1.png" alt="Mobile Dashboard" width="220" height="452" />
  <img src="src/Screenshots/mobile-dahsboard-newroomadd2.png" alt="Mobile Dashboard" width="220" />
  <img src="src/Screenshots/mobile-dahsboard-newroomadd3.png" alt="Mobile Dashboard" width="220" />
</p>

---

## 🚀 Future Improvements

- Add advanced filtering by price range, amenities, ratings, and city.
- Add real payment gateway integration such as Stripe or PayPal.
- Build an in-app messaging system between hosts and guests.
- Add an admin panel to manage users, listings, bookings, and reviews.
- Add email notifications for bookings, confirmations, and cancellations.
- Improve host review management with moderation/reporting features.
- Add more automated testing for backend APIs and frontend flows.
- Improve accessibility, loading states, and performance optimization.
- Add seasonal pricing, weekend pricing, and long-stay discounts.

---

## 👨‍💻 About the Developer

- **Name:** Sithum Buddhika Jayalal
- **Role:** Full-stack Developer / Software Engineering Undergraduate
- **Focus Areas:** MERN stack development, REST APIs, UI/UX design, responsive frontend development, and full-stack deployment
- **Institute:** Sri Lanka Institute of Information Technology (SLIIT)

---

## 📬 Contact

- **Email:** [officialsithumbuddhika@gmail.com](mailto:officialsithumbuddhika@gmail.com)
- **LinkedIn:** [Sithum Buddhika Jayalal](https://www.linkedin.com/in/sithum-buddhika-jayalal-827860341)

---

## ⭐ Project Status

Roostr is currently live as a portfolio project and continues to be improved with better responsiveness, user experience, reviews, booking features, and host-side functionality.
