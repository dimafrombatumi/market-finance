# Handmade Store Inventory & Sales Management System

A comprehensive web-based inventory and sales management system built specifically for handmade goods stores. This application provides a clean, modern interface for managing products, recording sales, tracking expenses and income, and generating detailed financial reports.

## Features

### 📦 Product Management
- Add, edit, and delete products
- Track product details (name, description, category, price, cost)
- Manage inventory levels with stock quantity tracking
- Set minimum stock level alerts
- Low stock notifications in the dashboard
- Search and filter products by name, description, or category

### 💰 Sales Management
- Create and record sales transactions
- Multi-product sales with quantity management
- Automatic inventory updates when sales are recorded
- Customer information tracking (optional)
- Multiple payment method support (cash, card, online, other)
- Real-time sales total calculation
- Transaction history with detailed sale information

### 📊 Financial Tracking
- Track expenses and income separately from sales
- Categorized expense management
- Income recording for non-sale revenue
- Transaction editing and deletion
- Comprehensive transaction history

### 📈 Reports & Analytics
- Interactive dashboard with key metrics
- Revenue vs Expenses trend analysis
- Expense breakdown by category (pie chart)
- Top products by revenue analysis
- Date range filtering for all reports
- Summary cards with total revenue, expenses, profit, and sales count
- Visual charts using Recharts library

### 🎨 Modern UI/UX
- Clean, responsive design built with styled-components
- Intuitive navigation with sidebar menu
- Modern card-based layouts
- Interactive forms with validation
- Real-time notifications and alerts
- Hover effects and smooth transitions
- Mobile-friendly responsive design

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components for modern CSS-in-JS
- **Routing**: React Router DOM for navigation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Context API with useReducer
- **Data Persistence**: Browser localStorage
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Header, Sidebar, Layout)
│   ├── products/        # Product-related components
│   ├── sales/           # Sales-related components
│   └── expenses/        # Expense/income components
├── contexts/            # React Context providers
│   └── DataContext.tsx  # Main data management context
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── ProductsPage.tsx # Product management
│   ├── SalesPage.tsx    # Sales management
│   ├── ExpensesPage.tsx # Expense/income tracking
│   └── ReportsPage.tsx  # Reports and analytics
├── types/               # TypeScript type definitions
│   └── index.ts         # All application types
└── utils/               # Utility functions
```

## Usage Guide

### Managing Products

1. **Adding Products**
   - Click "Add Product" button
   - Fill in product details (name, description, category, prices, stock)
   - Set minimum stock level for alerts
   - Save the product

2. **Editing Products**
   - Click the edit icon on any product card
   - Modify the desired fields
   - Save changes

3. **Stock Management**
   - Stock levels automatically decrease when sales are made
   - Low stock alerts appear in the dashboard
   - Manually update stock levels by editing products

### Recording Sales

1. **Creating a Sale**
   - Click "New Sale" button
   - Select products and quantities
   - Add customer information (optional)
   - Choose payment method
   - Complete the sale

2. **Sale Features**
   - Real-time total calculation
   - Quantity controls with stock validation
   - Customer information tracking
   - Payment method selection
   - Optional notes

### Financial Tracking

1. **Adding Expenses/Income**
   - Click "Add Transaction" button
   - Select transaction type (expense or income)
   - Choose appropriate category
   - Enter description and amount
   - Set transaction date

2. **Categories**
   - **Expenses**: Materials, Equipment, Marketing, Shipping, etc.
   - **Income**: Custom Orders, Workshops, Consultation, etc.

### Viewing Reports

1. **Dashboard Overview**
   - Key financial metrics
   - Recent transactions
   - Low stock alerts
   - Quick insights

2. **Detailed Reports**
   - Filter by date range
   - Revenue vs expenses trends
   - Expense category breakdown
   - Top performing products
   - Interactive charts and graphs

## Data Storage

The application uses browser localStorage for data persistence. This means:
- Data is stored locally in your browser
- No server or database required
- Data persists between browser sessions
- Data is specific to the browser/device used

### Backup Considerations
Since data is stored locally, consider:
- Regular exports of important data
- Using the same browser/device for consistency
- Browser data backup for important information

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository.

## Future Enhancements

- Export data to CSV/Excel
- Print receipts and reports
- Barcode scanning integration
- Multi-store support
- Cloud data synchronization
- Advanced inventory forecasting
- Customer management system
- Discount and promotion management
- Integration with payment processors