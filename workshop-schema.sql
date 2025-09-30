-- Workshop Management System Schema for Supabase

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
  category VARCHAR(100) NOT NULL,
  skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  max_participants INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  requirements TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(20) CHECK (recurring_pattern IN ('weekly', 'monthly', 'custom')),
  tags TEXT[] DEFAULT '{}',
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
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'online', 'other')) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshops_instructor_id ON workshops(instructor_id);
CREATE INDEX IF NOT EXISTS idx_workshops_category ON workshops(category);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshop_schedules_workshop_id ON workshop_schedules(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_schedules_start_date ON workshop_schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop_id ON workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_schedule_id ON workshop_registrations(schedule_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_customer_email ON workshop_registrations(customer_email);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_status ON workshop_registrations(status);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_schedules_updated_at BEFORE UPDATE ON workshop_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_registrations_updated_at BEFORE UPDATE ON workshop_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update current_participants count
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
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for instructors
CREATE POLICY "Instructors are viewable by everyone" ON instructors
  FOR SELECT USING (true);

CREATE POLICY "Instructors are insertable by authenticated users" ON instructors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Instructors are updatable by authenticated users" ON instructors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Instructors are deletable by authenticated users" ON instructors
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for workshops
CREATE POLICY "Workshops are viewable by everyone" ON workshops
  FOR SELECT USING (true);

CREATE POLICY "Workshops are insertable by authenticated users" ON workshops
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Workshops are updatable by authenticated users" ON workshops
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Workshops are deletable by authenticated users" ON workshops
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for workshop_schedules
CREATE POLICY "Workshop schedules are viewable by everyone" ON workshop_schedules
  FOR SELECT USING (true);

CREATE POLICY "Workshop schedules are insertable by authenticated users" ON workshop_schedules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Workshop schedules are updatable by authenticated users" ON workshop_schedules
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Workshop schedules are deletable by authenticated users" ON workshop_schedules
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for workshop_registrations
CREATE POLICY "Workshop registrations are viewable by everyone" ON workshop_registrations
  FOR SELECT USING (true);

CREATE POLICY "Workshop registrations are insertable by everyone" ON workshop_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Workshop registrations are updatable by authenticated users" ON workshop_registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Workshop registrations are deletable by authenticated users" ON workshop_registrations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Sample data for testing
INSERT INTO instructors (name, email, phone, bio, specialties, experience, hourly_rate, is_active) VALUES
('Анна Петрова', 'anna.petrova@example.com', '+7-999-123-4567', 'Опытный преподаватель живописи с 10-летним стажем', ARRAY['Живопись', 'Рисование', 'Акварель'], 10, 25.00, true),
('Михаил Соколов', 'mikhail.sokolov@example.com', '+7-999-234-5678', 'Мастер по керамике и гончарному делу', ARRAY['Керамика', 'Гончарное дело', 'Скульптура'], 8, 30.00, true),
('Елена Кузнецова', 'elena.kuznetsova@example.com', '+7-999-345-6789', 'Шеф-повар и преподаватель кулинарии', ARRAY['Кулинария', 'Выпечка', 'Кондитерское дело'], 12, 35.00, true);

INSERT INTO workshops (title, description, short_description, instructor_id, category, skill_level, duration, max_participants, price, materials_cost, status) VALUES
('Основы акварельной живописи', 'Изучите основы работы с акварелью, техники нанесения краски, смешивание цветов и создание красивых пейзажей.', 'Научитесь рисовать акварелью с нуля', (SELECT id FROM instructors WHERE email = 'anna.petrova@example.com'), 'art', 'beginner', 3, 8, 50.00, 15.00, 'published'),
('Гончарное дело для начинающих', 'Освойте основы работы на гончарном круге, создание простых форм и обжиг керамики.', 'Создайте свою первую керамическую посуду', (SELECT id FROM instructors WHERE email = 'mikhail.sokolov@example.com'), 'crafts', 'beginner', 4, 6, 75.00, 25.00, 'published'),
('Итальянская кухня', 'Приготовьте традиционные итальянские блюда: пасту, пиццу, ризотто и десерты.', 'Мастер-класс по итальянской кухне', (SELECT id FROM instructors WHERE email = 'elena.kuznetsova@example.com'), 'cooking', 'intermediate', 5, 10, 60.00, 20.00, 'published');

INSERT INTO workshop_schedules (workshop_id, start_date, end_date, start_time, end_time, location, max_participants) VALUES
((SELECT id FROM workshops WHERE title = 'Основы акварельной живописи'), '2024-02-15', '2024-02-15', '10:00', '13:00', 'Студия "Краски"', 8),
((SELECT id FROM workshops WHERE title = 'Гончарное дело для начинающих'), '2024-02-16', '2024-02-16', '14:00', '18:00', 'Мастерская "Глина"', 6),
((SELECT id FROM workshops WHERE title = 'Итальянская кухня'), '2024-02-17', '2024-02-17', '11:00', '16:00', 'Кулинарная студия "Вкус"', 10);
