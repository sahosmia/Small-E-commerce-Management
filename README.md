# Small E-commerce Management

A modern Multi-Vendor E-commerce and POS platform built with **Laravel 12**, **React 19**, **Inertia.js v2**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. Two-Tier Product Architecture
- **Global Products (Admin):**
  - Admins maintain a central catalog of global products (`/admin/products`).
  - Set global base prices, SKU, thumbnail, description, and status.
  - Global products assigned to any shop cannot be deleted without first removing assignments or deactivating.
- **Shared Catalog & Shop Products (Shop Owner):**
  - Shop Owners browse the shared catalog (`/owner/catalog`) and add products to their own store.
  - Owners can customize pricing, description, and thumbnail specific to their store (`/owner/products`).
  - Owners can also create unique products directly for their store.
- **Customer Storefront:**
  - Public shop storefront accessible at `/shop/{slug}` and `/shops/{shop:slug}/products`.
  - Only active products belonging to active shops are displayed to visitors.

### 2. Multi-Shop & Role Management
- **Role-Based Access Control:**
  - `Admin` (Role 1): Full control over users, shops, status toggling, and global catalog.
  - `ShopOwner` (Role 2): Manages their assigned shop, inventory, custom pricing, and storefront details.
- **User Management:**
  - Admin-only user management (`/users`) with role assignment and active/inactive status toggles.
  - Shop owners can manage their own profile credentials.

### 3. Modern User Interface
- React 19 components with Inertia.js.
- Responsive sidebar navigation with collapsible modes and defensive context fallback.
- Clean light theme design.

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js (v20+ or v22+) & npm
- SQLite / MySQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahosmia/Small-E-commerce-Management.git
   cd Small-E-commerce-Management
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Migration & Seeding:**
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

6. **Build Frontend Assets:**
   ```bash
   npm run build
   ```

7. **Start the Laravel Application:**
   ```bash
   php artisan serve
   ```

Access the application in your browser at `http://127.0.0.1:8000`.

---

## 🔑 Default Credentials

After running `php artisan db:seed`:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `password` |
| **Shop Owner** | `owner@gmail.com` | `password` |

---

## 🧪 Testing

Run PHP test suites:
```bash
php artisan test
```

Run code formatting:
```bash
./vendor/bin/pint
```
