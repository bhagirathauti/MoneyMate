# MoneyMate

## Overview
A Personal Finance Tracker for Students, is a web application designed to help students manage their daily expenses and monitor categorized spending. This project is tailored to encourage financial awareness and effective money management among students.

## Features

### Expense Logging
- Log daily expenses with details like amount, category, and date.
- Categories include **Food**, **Travel**, **Entertainment**, **Education**, and **Others**.

### Categorized Spending Charts
- Visual representation of expenses:
  - **Pie Chart** for overall expense distribution.

## Tech Stack

### Frontend
- **Angular** Framework used for building the frontend.
- **Angular Material** Provides UI components with a clean and modern design (used for buttons, forms, modals, etc.).
- **Chart.js** for expense visualizations.

### Backend
- **Node.js** for server-side logic.
- **Express.js** for API endpoints and routing.

### Database
- **MongoDB** for storing expense data and user categories.

## Installation

### Prerequisites
- **Node.js** installed
- **MongoDB** instance running

### Steps
1. Clone the repository:
2. Install dependencies simulataneously for frontend and backend both:
   ```bash
   cd moneymate-client
   npm install

   cd moneymate-server
   npm install
   ```
4. Start the server:
   ```bash
   // For frontend
   ng serve

   // For Backend
   npm start
   ```
5. Open the application in your browser at `http://localhost:4200`.

