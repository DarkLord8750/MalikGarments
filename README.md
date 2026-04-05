# Malik Garments Wholesale

A modern, high-performance wholesale e-commerce platform designed for Malik Garments. Built with React, Vite, Supabase, and TailwindCSS.

![Project Banner](public/logo.png) *<!-- Replace with actual banner if available -->*

## 🚀 Features

### for Customers
- **Dynamic Catalog**: Browse products with advanced filtering (category, price, brand, material, etc.).
- **Rich Product Details**: 
  - High-quality image gallery with zoom.
  - **YouTube Video Integration**: Watch product videos directly in the gallery.
  - Detailed specifications (fabric, size, weight, etc.).
- **Enquiry System**: Add items to an enquiry bag and send orders directly via **WhatsApp** with a single click.
- **SEO Optimized**: Dynamic meta tags and keywords for every product and category for better search engine visibility.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

### for Admins
- **Dashboard**: Real-time overview of products, enquiries, and stock status.
- **Product Management**: Create, edit, and delete products with image uploads.
  - **SEO Control**: Manually add custom SEO keywords per product.
  - **Video Support**: Add YouTube video links to products.
- **Category Management**: Organize products into categories with custom images and SEO keywords.
- **Enquiry Management**: Track and manage customer enquiries.
- **Activity Logs**: Audit trail of all admin actions.
- **Settings**: Configure site-wide settings (contact info, social links).

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management**: React Context API
- **Routing**: React Router v7

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/malikgarments-wholesale.git
    cd malikgarments-wholesale
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**:
    - Run the SQL scripts in your Supabase SQL Editor in the following order:
        1.  `database.sql` (Core schema)
        2.  `migration_add_keywords.sql` (Adds SEO keywords support)
        3.  `migration_add_video.sql` (Adds YouTube video support)

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.

## 📂 Project Structure

```
malikgarments-wholesale/
├── components/          # Reusable UI components (Layout, SEO, etc.)
├── context/             # React Context (StoreContext, AuthContext)
├── pages/               # Application pages
│   ├── admin/           # Admin panel pages (Dashboard, Products, etc.)
│   └── customer/        # Public pages (Home, Catalog, ProductDetail)
├── services/            # API services (Supabase client)
├── utils/               # Helper functions and constants
├── types.ts             # TypeScript type definitions
├── database.sql         # Main database schema
└── README.md            # Project documentation
```

## 🔐 Admin Access
To access the admin panel, navigate to `/login`. You must have an account created in the `auth.users` table of your Supabase instance.

## 📄 License
This project is proprietary software custom-built for Malik Garments.
