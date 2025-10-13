# Health & Taste Restaurant 🍽️

A sophisticated restaurant reservation system that allows customers to view the menu, select specific tables, and make reservations with an intuitive user experience.

## 🌐 Live Application

**Main Site**: [https://health-and-taste.up.railway.app](https://health-and-taste.up.railway.app)

## 📋 Features

### Customer Features
- **Interactive Menu**: Browse breakfast, lunch, and dinner menus with beautiful food imagery
- **Table Selection**: Choose your preferred table from an interactive restaurant layout
- **Smart Reservations**: Dynamic hour selection based on current time and availability
- **Visual Feedback**: Busy tables are highlighted in red to show availability
- **Responsive Design**: Mobile-friendly interface for all devices
- **Gallery**: View restaurant ambiance and food photos

### Reservation Management
- **Reservation Confirmation**: Users receive a reservation number upon booking
- **Edit Reservations**: Modify reservation details using your reservation number
- **Real-time Validation**: Prevents double-bookings and validates table capacity

## 🔗 Important Links

### Admin Access
- **Admin Login**: [https://health-and-taste.up.railway.app/adminLog](https://health-and-taste.up.railway.app/adminLog)
- Manage all reservations and restaurant operations

### Edit Reservations
- **Edit Portal**: [https://health-and-taste.up.railway.app/edit](https://health-and-taste.up.railway.app/edit)
- **Requirements**: You must have your reservation number to modify your booking

## 📧 Email Notifications

**Current Status**: Email functionality is temporarily disabled due to domain ownership requirements. 

- Users will receive their reservation number on the confirmation page
- Please save your reservation number for future reference
- Email notifications will be restored once domain configuration is complete

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, vanilla JavaScript, CSS3
- **Styling**: Bootstrap 5, custom CSS
- **Deployment**: Railway Platform
- **Authentication**: Passport.js for admin access

## 🚀 Key Features

### Smart Table Management
- Visual table layout with real-time availability
- Automatic validation for party size vs table capacity
- Busy table detection based on date/time conflicts

### Dynamic Hour Selection
- Shows only remaining hours for same-day reservations
- Full hour range for future date bookings
- Restaurant hours: 12:00 PM - 11:00 PM

### Responsive Design
- Mobile-optimized hamburger menu
- Flexible grid layouts for all screen sizes
- Touch-friendly table selection interface

## 📱 Pages & Navigation

- **Home** (`/`) - Landing page with restaurant overview
- **Menu** (`/menu`) - Full menu with breakfast, lunch, dinner sections
- **Gallery** (`/gallery`) - Restaurant and food photography
- **Location** (`/location`) - Contact and location information
- **Reservations** (`/form`) - Make a new reservation
- **Tables** (`/tables`) - Interactive table selection
- **Edit** (`/edit`) - Modify existing reservations

## 🎯 Project Inspiration

<!-- This project was born after a cruise famous for its food in the caribbean.
Because the experience is everything, and its not always about the food but the location and THE VIEW.

Did you know?
19% of adults want to pick their exact table when making a reservation.
National Household Survey 2020 -->

This application addresses the growing demand for personalized dining experiences, allowing customers to choose their preferred seating location just like they should on a luxury cruise ship.

## 🔧 Development & Deployment

The application is continuously deployed on Railway with automated CI/CD pipeline. All features are production-ready and optimized for performance.

---

*For support or inquiries, please contact the restaurant directly or use the admin portal for assistance.*
