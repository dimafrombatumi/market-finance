-- Simplified Workshop Management System Schema for Supabase
-- This file contains the essential database schema for workshop management and registrations

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Workshop Categories table
CREATE TABLE IF NOT EXISTS workshop_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
  icon VARCHAR(50), -- Icon name for UI
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  image_url TEXT,
  social_links JSONB DEFAULT '{}',
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES workshop_categories(id) ON DELETE SET NULL,
  skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  max_participants INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(20) CHECK (recurring_pattern IN ('weekly', 'monthly', 'custom')),
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_registrations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop schedules table
CREATE TABLE IF NOT EXISTS workshop_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  room VARCHAR(100),
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  status VARCHAR(20) CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  instructor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop registrations table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES workshop_schedules(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'pending',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'partial')) DEFAULT 'pending',
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'online', 'bank_transfer', 'other')) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  special_requests TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  dietary_restrictions TEXT,
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment tracking table
CREATE TABLE IF NOT EXISTS workshop_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_id VARCHAR(255),
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop reviews table
CREATE TABLE IF NOT EXISTS workshop_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'registration_confirmed', 'workshop_reminder', 'payment_required', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop waitlist table
CREATE TABLE IF NOT EXISTS workshop_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES workshop_schedules(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  position INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('waiting', 'notified', 'registered', 'cancelled')) DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshop_categories_name ON workshop_categories(name);
CREATE INDEX IF NOT EXISTS idx_workshop_categories_active ON workshop_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_instructors_active ON instructors(is_active);
CREATE INDEX IF NOT EXISTS idx_instructors_rating ON instructors(rating);

CREATE INDEX IF NOT EXISTS idx_workshops_instructor_id ON workshops(instructor_id);
CREATE INDEX IF NOT EXISTS idx_workshops_category_id ON workshops(category_id);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_skill_level ON workshops(skill_level);
CREATE INDEX IF NOT EXISTS idx_workshops_price ON workshops(price);
CREATE INDEX IF NOT EXISTS idx_workshops_rating ON workshops(rating);
CREATE INDEX IF NOT EXISTS idx_workshops_title_trgm ON workshops USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_workshop_schedules_workshop_id ON workshop_schedules(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_schedules_start_date ON workshop_schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_workshop_schedules_status ON workshop_schedules(status);

CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop_id ON workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_schedule_id ON workshop_registrations(schedule_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_customer_email ON workshop_registrations(customer_email);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_status ON workshop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_payment_status ON workshop_registrations(payment_status);

CREATE INDEX IF NOT EXISTS idx_workshop_payments_registration_id ON workshop_payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_workshop_payments_status ON workshop_payments(status);

CREATE INDEX IF NOT EXISTS idx_workshop_reviews_workshop_id ON workshop_reviews(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_reviews_rating ON workshop_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_workshop_waitlist_workshop_id ON workshop_waitlist(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_waitlist_schedule_id ON workshop_waitlist(schedule_id);
CREATE INDEX IF NOT EXISTS idx_workshop_waitlist_position ON workshop_waitlist(position);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_workshop_categories_updated_at BEFORE UPDATE ON workshop_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_schedules_updated_at BEFORE UPDATE ON workshop_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_registrations_updated_at BEFORE UPDATE ON workshop_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_reviews_updated_at BEFORE UPDATE ON workshop_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_waitlist_updated_at BEFORE UPDATE ON workshop_waitlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Simple function to update current_participants count
CREATE OR REPLACE FUNCTION update_workshop_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE workshop_schedules 
    SET current_participants = current_participants + 1
    WHERE id = NEW.schedule_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE workshop_schedules 
    SET current_participants = current_participants - 1
    WHERE id = OLD.schedule_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.schedule_id != NEW.schedule_id THEN
      -- Decrease count for old schedule
      UPDATE workshop_schedules 
      SET current_participants = current_participants - 1
      WHERE id = OLD.schedule_id;
      -- Increase count for new schedule
      UPDATE workshop_schedules 
      SET current_participants = current_participants + 1
      WHERE id = NEW.schedule_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update participant count
CREATE TRIGGER update_participants_count
  AFTER INSERT OR UPDATE OR DELETE ON workshop_registrations
  FOR EACH ROW EXECUTE FUNCTION update_workshop_participants_count();

-- Row Level Security (RLS) policies
ALTER TABLE workshop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_waitlist ENABLE ROW LEVEL SECURITY;

-- RLS policies for workshop_categories
CREATE POLICY "Categories are viewable by everyone" ON workshop_categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by authenticated users" ON workshop_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for instructors
CREATE POLICY "Instructors are viewable by everyone" ON instructors
  FOR SELECT USING (true);

CREATE POLICY "Instructors are manageable by authenticated users" ON instructors
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for workshops
CREATE POLICY "Workshops are viewable by everyone" ON workshops
  FOR SELECT USING (true);

CREATE POLICY "Workshops are manageable by authenticated users" ON workshops
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for workshop_schedules
CREATE POLICY "Workshop schedules are viewable by everyone" ON workshop_schedules
  FOR SELECT USING (true);

CREATE POLICY "Workshop schedules are manageable by authenticated users" ON workshop_schedules
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for workshop_registrations
CREATE POLICY "Workshop registrations are viewable by everyone" ON workshop_registrations
  FOR SELECT USING (true);

CREATE POLICY "Workshop registrations are insertable by everyone" ON workshop_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Workshop registrations are manageable by authenticated users" ON workshop_registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Workshop registrations are deletable by authenticated users" ON workshop_registrations
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for workshop_payments
CREATE POLICY "Payments are viewable by authenticated users" ON workshop_payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Payments are manageable by authenticated users" ON workshop_payments
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for workshop_reviews
CREATE POLICY "Reviews are viewable by everyone" ON workshop_reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Reviews are insertable by everyone" ON workshop_reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reviews are manageable by authenticated users" ON workshop_reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for notifications
CREATE POLICY "Notifications are viewable by owner" ON notifications
  FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Notifications are manageable by authenticated users" ON notifications
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for workshop_waitlist
CREATE POLICY "Waitlist is viewable by everyone" ON workshop_waitlist
  FOR SELECT USING (true);

CREATE POLICY "Waitlist is insertable by everyone" ON workshop_waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Waitlist is manageable by authenticated users" ON workshop_waitlist
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample categories
INSERT INTO workshop_categories (name, description, color, icon, sort_order) VALUES
('Искусство и творчество', 'Живопись, рисунок, скульптура и другие виды изобразительного искусства', '#EF4444', 'palette', 1),
('Ремесла и рукоделие', 'Керамика, гончарное дело, вязание, шитье и другие ремесла', '#F59E0B', 'hammer', 2),
('Кулинария', 'Приготовление пищи, выпечка, кондитерское дело', '#10B981', 'utensils', 3),
('Музыка и танцы', 'Игра на музыкальных инструментах, вокал, танцы', '#8B5CF6', 'music', 4),
('Языки и образование', 'Изучение иностранных языков, развитие навыков', '#3B82F6', 'book', 5),
('Технологии', 'Программирование, дизайн, цифровые технологии', '#6366F1', 'laptop', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert sample instructors
INSERT INTO instructors (name, email, phone, bio, specialties, experience, hourly_rate, is_active) VALUES
('Анна Петрова', 'anna.petrova@example.com', '+7-999-123-4567', 'Опытный преподаватель живописи с 10-летним стажем. Специализируется на акварели и масляной живописи.', ARRAY['Живопись', 'Рисование', 'Акварель', 'Масляная живопись'], 10, 25.00, true),
('Михаил Соколов', 'mikhail.sokolov@example.com', '+7-999-234-5678', 'Мастер по керамике и гончарному делу с 8-летним опытом. Работает с различными видами глины и техниками обжига.', ARRAY['Керамика', 'Гончарное дело', 'Скульптура', 'Обжиг'], 8, 30.00, true),
('Елена Кузнецова', 'elena.kuznetsova@example.com', '+7-999-345-6789', 'Шеф-повар и преподаватель кулинарии с 12-летним стажем. Эксперт по итальянской и французской кухне.', ARRAY['Кулинария', 'Выпечка', 'Кондитерское дело', 'Итальянская кухня'], 12, 35.00, true),
('Дмитрий Волков', 'dmitry.volkov@example.com', '+7-999-456-7890', 'Музыкант и преподаватель игры на гитаре. Опыт преподавания 6 лет.', ARRAY['Гитара', 'Музыкальная теория', 'Композиция'], 6, 20.00, true),
('Ольга Морозова', 'olga.morozova@example.com', '+7-999-567-8901', 'Преподаватель английского языка с международными сертификатами. Опыт 7 лет.', ARRAY['Английский язык', 'IELTS', 'TOEFL', 'Разговорная практика'], 7, 22.00, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample workshops
INSERT INTO workshops (title, description, short_description, instructor_id, category_id, skill_level, duration, max_participants, price, materials_cost, status, tags) VALUES
('Основы акварельной живописи', 'Изучите основы работы с акварелью, техники нанесения краски, смешивание цветов и создание красивых пейзажей. Подходит для начинающих.', 'Научитесь рисовать акварелью с нуля', 
 (SELECT id FROM instructors WHERE email = 'anna.petrova@example.com'),
 (SELECT id FROM workshop_categories WHERE name = 'Искусство и творчество'),
 'beginner', 3, 8, 50.00, 15.00, 'published', ARRAY['акварель', 'живопись', 'для начинающих']),

('Гончарное дело для начинающих', 'Освойте основы работы на гончарном круге, создание простых форм и обжиг керамики. Все материалы включены.', 'Создайте свою первую керамическую посуду',
 (SELECT id FROM instructors WHERE email = 'mikhail.sokolov@example.com'),
 (SELECT id FROM workshop_categories WHERE name = 'Ремесла и рукоделие'),
 'beginner', 4, 6, 75.00, 25.00, 'published', ARRAY['керамика', 'гончарное дело', 'ручная работа']),

('Итальянская кухня', 'Приготовьте традиционные итальянские блюда: пасту, пиццу, ризотто и десерты. Изучите секреты итальянской кухни.', 'Мастер-класс по итальянской кухне',
 (SELECT id FROM instructors WHERE email = 'elena.kuznetsova@example.com'),
 (SELECT id FROM workshop_categories WHERE name = 'Кулинария'),
 'intermediate', 5, 10, 60.00, 20.00, 'published', ARRAY['итальянская кухня', 'паста', 'пицца']),

('Игра на гитаре для начинающих', 'Изучите основы игры на гитаре: постановка рук, основные аккорды, простые мелодии. Гитары предоставляются.', 'Научитесь играть на гитаре',
 (SELECT id FROM instructors WHERE email = 'dmitry.volkov@example.com'),
 (SELECT id FROM workshop_categories WHERE name = 'Музыка и танцы'),
 'beginner', 2, 12, 40.00, 5.00, 'published', ARRAY['гитара', 'музыка', 'для начинающих']),

('Английский разговорный клуб', 'Практика разговорного английского языка в дружеской атмосфере. Обсуждение интересных тем и улучшение произношения.', 'Практика английского языка',
 (SELECT id FROM instructors WHERE email = 'olga.morozova@example.com'),
 (SELECT id FROM workshop_categories WHERE name = 'Языки и образование'),
 'intermediate', 1.5, 15, 30.00, 0.00, 'published', ARRAY['английский', 'разговорная практика', 'языки'])
ON CONFLICT DO NOTHING;

-- Insert sample workshop schedules
INSERT INTO workshop_schedules (workshop_id, start_date, end_date, start_time, end_time, location, max_participants) VALUES
((SELECT id FROM workshops WHERE title = 'Основы акварельной живописи'), '2024-02-15', '2024-02-15', '10:00', '13:00', 'Студия "Краски", ул. Творческая, 15', 8),
((SELECT id FROM workshops WHERE title = 'Гончарное дело для начинающих'), '2024-02-16', '2024-02-16', '14:00', '18:00', 'Мастерская "Глина", ул. Ремесленная, 8', 6),
((SELECT id FROM workshops WHERE title = 'Итальянская кухня'), '2024-02-17', '2024-02-17', '11:00', '16:00', 'Кулинарная студия "Вкус", ул. Гастрономическая, 22', 10),
((SELECT id FROM workshops WHERE title = 'Игра на гитаре для начинающих'), '2024-02-18', '2024-02-18', '19:00', '21:00', 'Музыкальная студия "Звук", ул. Мелодичная, 5', 12),
((SELECT id FROM workshops WHERE title = 'Английский разговорный клуб'), '2024-02-19', '2024-02-19', '18:30', '20:00', 'Языковой центр "Полиглот", ул. Лингвистическая, 12', 15)
ON CONFLICT DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW workshop_details AS
SELECT 
  w.*,
  i.name as instructor_name,
  i.email as instructor_email,
  i.phone as instructor_phone,
  i.bio as instructor_bio,
  i.image_url as instructor_image,
  c.name as category_name,
  c.color as category_color,
  c.icon as category_icon
FROM workshops w
LEFT JOIN instructors i ON w.instructor_id = i.id
LEFT JOIN workshop_categories c ON w.category_id = c.id;

CREATE OR REPLACE VIEW workshop_schedule_details AS
SELECT 
  ws.*,
  w.title as workshop_title,
  w.description as workshop_description,
  w.price as workshop_price,
  w.skill_level as workshop_skill_level,
  w.duration as workshop_duration,
  i.name as instructor_name,
  c.name as category_name
FROM workshop_schedules ws
LEFT JOIN workshops w ON ws.workshop_id = w.id
LEFT JOIN instructors i ON w.instructor_id = i.id
LEFT JOIN workshop_categories c ON w.category_id = c.id;

CREATE OR REPLACE VIEW registration_details AS
SELECT 
  wr.*,
  w.title as workshop_title,
  w.description as workshop_description,
  ws.start_date,
  ws.start_time,
  ws.end_time,
  ws.location,
  i.name as instructor_name,
  c.name as category_name
FROM workshop_registrations wr
LEFT JOIN workshops w ON wr.workshop_id = w.id
LEFT JOIN workshop_schedules ws ON wr.schedule_id = ws.id
LEFT JOIN instructors i ON w.instructor_id = i.id
LEFT JOIN workshop_categories c ON w.category_id = c.id;
