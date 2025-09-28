-- Market Finance Database Schema for Supabase
-- This file contains the complete database schema for the market finance application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
    category VARCHAR(100) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock_level INTEGER NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
    sku VARCHAR(100) UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'online', 'other')),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sale items table (many-to-many relationship between sales and products)
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL, -- Denormalized for performance
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (for income and expenses)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'sale')),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reference_id UUID, -- Reference to sale_id for sale transactions
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_email);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create transaction when sale is completed
CREATE OR REPLACE FUNCTION create_sale_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create transaction for completed sales
    IF NEW.status = 'completed' THEN
        INSERT INTO transactions (type, category, description, amount, reference_id, date)
        VALUES ('sale', 'Sales Revenue', 'Sale #' || NEW.id, NEW.total_amount, NEW.id, NEW.sale_date);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create transaction when sale is completed
CREATE TRIGGER create_sale_transaction_trigger
    AFTER INSERT OR UPDATE ON sales
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION create_sale_transaction();

-- Function to update product stock when sale is completed
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Only update stock for completed sales
    IF NEW.status = 'completed' THEN
        -- Decrease stock for each item in the sale
        FOR item IN 
            SELECT product_id, quantity 
            FROM sale_items 
            WHERE sale_id = NEW.id
        LOOP
            UPDATE products 
            SET stock_quantity = stock_quantity - item.quantity,
                updated_at = NOW()
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update product stock when sale is completed
CREATE TRIGGER update_product_stock_trigger
    AFTER INSERT OR UPDATE ON sales
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_product_stock();

-- Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (you can customize this based on your auth requirements)
CREATE POLICY "Allow all operations for authenticated users" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON sales
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON sale_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON transactions
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data (optional - remove in production)
INSERT INTO products (id, name, description, price, cost, category, stock_quantity, min_stock_level, sku, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Handmade Ceramic Mug', 'Beautiful handcrafted ceramic mug with unique glaze', 25.99, 12.50, 'Kitchen & Dining', 15, 5, 'MUG-001', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Wooden Cutting Board', 'Premium oak cutting board with natural finish', 45.00, 22.00, 'Kitchen & Dining', 8, 3, 'WB-002', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Handwoven Scarf', 'Soft wool scarf in earth tones', 35.50, 18.00, 'Clothing', 2, 5, 'SC-003', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, type, category, description, amount, date, notes) VALUES
    ('550e8400-e29b-41d4-a716-446655440101', 'expense', 'Materials & Supplies', 'Clay and glaze materials', 150.00, NOW() - INTERVAL '2 days', 'Bulk order for ceramic production'),
    ('550e8400-e29b-41d4-a716-446655440102', 'expense', 'Rent & Utilities', 'Studio rent', 800.00, NOW() - INTERVAL '3 days', ''),
    ('550e8400-e29b-41d4-a716-446655440103', 'income', 'Other Income', 'Workshop teaching fee', 200.00, NOW() - INTERVAL '4 days', '')
ON CONFLICT (id) DO NOTHING;
