const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
  console.error('❌ Пожалуйста, настройте переменные окружения REACT_APP_SUPABASE_URL и REACT_APP_SUPABASE_ANON_KEY');
  console.log('Создайте файл .env.local в корне проекта со следующим содержимым:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test instructors data
const instructors = [
  {
    name: 'Анна Петрова',
    email: 'anna.petrova@example.com',
    phone: '+7-999-123-4567',
    bio: 'Опытный преподаватель живописи с 10-летним стажем. Специализируется на акварели и масляной живописи.',
    specialties: ['Живопись', 'Акварель', 'Масляная живопись'],
    experience: 10,
    hourly_rate: 25.00,
    is_active: true
  },
  {
    name: 'Михаил Соколов',
    email: 'mikhail.sokolov@example.com',
    phone: '+7-999-234-5678',
    bio: 'Мастер по керамике и гончарному делу. Проводит мастер-классы по работе с глиной.',
    specialties: ['Керамика', 'Гончарное дело', 'Скульптура'],
    experience: 8,
    hourly_rate: 30.00,
    is_active: true
  },
  {
    name: 'Елена Кузнецова',
    email: 'elena.kuznetsova@example.com',
    phone: '+7-999-345-6789',
    bio: 'Шеф-повар с международным опытом. Специализируется на итальянской и французской кухне.',
    specialties: ['Кулинария', 'Итальянская кухня', 'Французская кухня'],
    experience: 15,
    hourly_rate: 35.00,
    is_active: true
  }
];

// Test workshops data
const workshops = [
  {
    title: 'Акварельная живопись для начинающих',
    description: 'Изучите основы акварельной живописи, техники работы с кистью и цветом. Создайте свою первую картину под руководством опытного преподавателя.',
    short_description: 'Основы акварельной живописи для новичков',
    category: 'art',
    skill_level: 'beginner',
    duration: 3,
    max_participants: 8,
    price: 50.00,
    materials_cost: 15.00,
    requirements: ['Базовые художественные принадлежности'],
    materials: ['Акварельные краски', 'Кисти', 'Бумага для акварели'],
    is_recurring: false,
    tags: ['живопись', 'акварель', 'начинающие'],
    status: 'published'
  },
  {
    title: 'Гончарное дело: создание керамических изделий',
    description: 'Научитесь работать с гончарным кругом, создавайте красивые керамические изделия. Изучите техники формования, декорирования и обжига.',
    short_description: 'Мастер-класс по гончарному делу',
    category: 'crafts',
    skill_level: 'intermediate',
    duration: 4,
    max_participants: 6,
    price: 75.00,
    materials_cost: 25.00,
    requirements: ['Опыт работы с глиной приветствуется'],
    materials: ['Глина', 'Гончарный круг', 'Инструменты для керамики'],
    is_recurring: false,
    tags: ['керамика', 'гончарное дело', 'рукоделие'],
    status: 'published'
  },
  {
    title: 'Итальянская паста от шеф-повара',
    description: 'Научитесь готовить настоящую итальянскую пасту с нуля. Изучите секреты приготовления теста, соусов и подачи блюд.',
    short_description: 'Мастер-класс по приготовлению итальянской пасты',
    category: 'cooking',
    skill_level: 'beginner',
    duration: 2,
    max_participants: 10,
    price: 60.00,
    materials_cost: 20.00,
    requirements: ['Базовые навыки готовки'],
    materials: ['Мука', 'Яйца', 'Свежие продукты'],
    is_recurring: true,
    recurring_pattern: 'weekly',
    tags: ['кулинария', 'итальянская кухня', 'паста'],
    status: 'published'
  }
];

// Test workshop schedules
const schedules = [
  {
    start_date: '2024-02-15',
    end_date: '2024-02-15',
    start_time: '10:00',
    end_time: '13:00',
    location: 'Студия "Краски"',
    room: 'Зал 1',
    max_participants: 8,
    current_participants: 0,
    status: 'scheduled',
    notes: 'Все материалы включены в стоимость'
  },
  {
    start_date: '2024-02-16',
    end_date: '2024-02-16',
    start_time: '14:00',
    end_time: '18:00',
    location: 'Мастерская "Глина"',
    room: 'Гончарная мастерская',
    max_participants: 6,
    current_participants: 0,
    status: 'scheduled',
    notes: 'Работаем с глиной, одежда может испачкаться'
  },
  {
    start_date: '2024-02-17',
    end_date: '2024-02-17',
    start_time: '11:00',
    end_time: '16:00',
    location: 'Кулинарная студия "Вкус"',
    room: 'Кухня 1',
    max_participants: 10,
    current_participants: 0,
    status: 'scheduled',
    notes: 'Дегустация включена'
  }
];

// Test workshop registrations
const registrations = [
  {
    customer_name: 'Иван Иванов',
    customer_email: 'ivan.ivanov@example.com',
    customer_phone: '+7-999-111-22-33',
    payment_method: 'card',
    status: 'confirmed',
    payment_status: 'paid',
    total_amount: 65.00,
    notes: 'Интересуется пейзажной живописью',
    special_requests: 'Левосторонний'
  },
  {
    customer_name: 'Мария Сидорова',
    customer_email: 'maria.sidorova@example.com',
    customer_phone: '+7-999-222-33-44',
    payment_method: 'cash',
    status: 'pending',
    payment_status: 'pending',
    total_amount: 100.00,
    notes: 'Первый раз на мастер-классе',
    special_requests: 'Вегетарианские материалы'
  },
  {
    customer_name: 'Алексей Петров',
    customer_email: 'alexey.petrov@example.com',
    customer_phone: '+7-999-333-44-55',
    payment_method: 'online',
    status: 'confirmed',
    payment_status: 'paid',
    total_amount: 80.00,
    notes: 'Опыт работы с глиной',
    special_requests: 'Дополнительные инструменты'
  }
];

async function addTestData() {
  try {
    console.log('Добавление тестовых данных...');

    // Add instructors
    console.log('Добавление преподавателей...');
    const { data: instructorData, error: instructorError } = await supabase
      .from('instructors')
      .insert(instructors)
      .select();

    if (instructorError) {
      console.error('Ошибка при добавлении преподавателей:', instructorError);
      return;
    }

    console.log(`Добавлено ${instructorData.length} преподавателей`);

    // Add workshops with instructor IDs
    console.log('Добавление мастер-классов...');
    const workshopsWithInstructors = workshops.map((workshop, index) => ({
      ...workshop,
      instructor_id: instructorData[index].id
    }));

    const { data: workshopData, error: workshopError } = await supabase
      .from('workshops')
      .insert(workshopsWithInstructors)
      .select();

    if (workshopError) {
      console.error('Ошибка при добавлении мастер-классов:', workshopError);
      return;
    }

    console.log(`Добавлено ${workshopData.length} мастер-классов`);

    // Add workshop schedules
    console.log('Добавление расписания мастер-классов...');
    const schedulesWithWorkshops = schedules.map((schedule, index) => ({
      ...schedule,
      workshop_id: workshopData[index].id
    }));

    const { data: scheduleData, error: scheduleError } = await supabase
      .from('workshop_schedules')
      .insert(schedulesWithWorkshops)
      .select();

    if (scheduleError) {
      console.error('Ошибка при добавлении расписания:', scheduleError);
      return;
    }

    console.log(`Добавлено ${scheduleData.length} расписаний`);

    // Add workshop registrations
    console.log('Добавление записей на мастер-классы...');
    const registrationsWithWorkshops = registrations.map((registration, index) => ({
      ...registration,
      workshop_id: workshopData[index].id,
      schedule_id: scheduleData[index].id,
      registration_date: new Date().toISOString()
    }));

    const { data: registrationData, error: registrationError } = await supabase
      .from('workshop_registrations')
      .insert(registrationsWithWorkshops)
      .select();

    if (registrationError) {
      console.error('Ошибка при добавлении записей:', registrationError);
      return;
    }

    console.log(`Добавлено ${registrationData.length} записей`);

    // Update current participants count
    console.log('Обновление количества участников...');
    for (let i = 0; i < scheduleData.length; i++) {
      await supabase
        .from('workshop_schedules')
        .update({ current_participants: 1 })
        .eq('id', scheduleData[i].id);
    }

    console.log('✅ Все тестовые данные успешно добавлены!');
    console.log('\nДобавлено:');
    console.log(`- ${instructorData.length} преподавателей`);
    console.log(`- ${workshopData.length} мастер-классов`);
    console.log(`- ${scheduleData.length} расписаний`);
    console.log(`- ${registrationData.length} записей`);

  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Run the script
addTestData();
