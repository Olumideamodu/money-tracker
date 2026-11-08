# Personal Money Tracker 🇳🇬 (₦)

A clean, modern, and minimal personal finance tracker built purely with **vanilla HTML, CSS, and JavaScript**. Designed to help you track income and expenses in **Nigerian Naira (₦)** with zero external dependencies, zero backend, and 100% offline data persistence using browser `localStorage`.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Features

### 1. Financial Overview Dashboard
- **Total Balance**: Real-time net savings or deficit (`Income - Expenses`).
- **Total Income**: All recorded inflows formatted in Nigerian Naira (`₦`).
- **Total Expenses**: All recorded expenditures.
- **Transaction Count**: Total logged transactions.

### 2. Income & Expense Categories
- **Income Categories**: Salary, Freelance, Business, Photography, Gifts, Other income.
- **Expense Categories**: Food, Transportation, Rent, Bills and Utilities, Shopping, Health, Entertainment, Savings, Giving, Subscriptions, Other expenses.

### 3. Monthly Financial Breakdown & Budget Utilization
- Month-by-month financial review with navigation controls.
- Monthly Income, Monthly Expenses, and Monthly Remaining Balance.
- Budget utilization progress bar with threshold alerts (Green / Amber / Red).
- **Monthly Category Expense Breakdown**: Shows spending distribution and percentages across categories.

### 4. Transactions Management
- **Add Transactions**: Title, Amount, Type (Income / Expense), Category, Date, and optional Notes.
- **Edit Transactions**: Update any previously recorded entry.
- **Delete Transactions**: Confirmation dialog before permanent deletion.
- **Real-Time Recalculations**: Dashboard values immediately update on every mutation.

### 5. Multi-Criteria Search & Filter
- Search by keyword across titles, categories, and notes.
- Quick filter tabs: **All**, **Income**, **Expenses**.
- Category dropdown filter.
- Date range filtering (*From Date* and *To Date*).
- One-click filter reset.

### 6. Data Export & Offline Persistence
- **100% Offline**: Zero external CDNs or network calls. Works seamlessly anywhere.
- **Browser Persistence**: Transactions are securely saved in `localStorage`.
- **Export to CSV**: Download your transactions for Excel, Google Sheets, or backup anytime.
- **Print Friendly**: Built-in `@media print` styling for clean PDF export or printing.

---

## Project Structure

```
├── index.html       # Application markup and accessible modal dialogs
├── style.css        # Clean, modern design tokens, responsive layout, animations
├── script.js        # Data model, calculations, currency formatting, events
├── .gitignore       # Standard ignored local files
└── README.md        # Documentation
```

---

## Getting Started

No installation, build tools, or server setup required.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/<your-username>/money-tracker.git
   cd money-tracker
   ```
2. Open `index.html` in any modern web browser:
   - **macOS**: `open index.html`
   - **Windows**: `start index.html`
   - **Linux**: `xdg-open index.html`

---

## License

This project is open source and available under the [MIT License](LICENSE).
