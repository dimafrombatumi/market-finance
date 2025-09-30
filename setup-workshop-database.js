const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function setupWorkshopDatabase() {
  try {
    console.log('🚀 Настройка базы данных для мастер-классов...');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'workshop-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Найдено ${statements.length} SQL запросов для выполнения`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Выполнение запроса ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // If exec_sql doesn't exist, try direct query
            if (error.message.includes('function exec_sql')) {
              console.log('⚠️  exec_sql функция недоступна, пропускаем создание схемы');
              console.log('📋 Пожалуйста, выполните SQL схему вручную в Supabase Dashboard');
              break;
            } else {
              console.warn(`⚠️  Предупреждение при выполнении запроса ${i + 1}:`, error.message);
            }
          } else {
            console.log(`✅ Запрос ${i + 1} выполнен успешно`);
          }
        } catch (err) {
          console.warn(`⚠️  Ошибка при выполнении запроса ${i + 1}:`, err.message);
        }
      }
    }

    // Test database connection
    console.log('🔍 Проверка подключения к базе данных...');
    
    // Test instructors table
    const { data: instructors, error: instructorsError } = await supabase
      .from('instructors')
      .select('count')
      .limit(1);

    if (instructorsError) {
      console.error('❌ Ошибка при проверке таблицы instructors:', instructorsError.message);
      console.log('📋 Убедитесь, что схема базы данных применена корректно');
      return;
    }

    // Test workshops table
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('count')
      .limit(1);

    if (workshopsError) {
      console.error('❌ Ошибка при проверке таблицы workshops:', workshopsError.message);
      return;
    }

    // Test workshop_schedules table
    const { data: schedules, error: schedulesError } = await supabase
      .from('workshop_schedules')
      .select('count')
      .limit(1);

    if (schedulesError) {
      console.error('❌ Ошибка при проверке таблицы workshop_schedules:', schedulesError.message);
      return;
    }

    // Test workshop_registrations table
    const { data: registrations, error: registrationsError } = await supabase
      .from('workshop_registrations')
      .select('count')
      .limit(1);

    if (registrationsError) {
      console.error('❌ Ошибка при проверке таблицы workshop_registrations:', registrationsError.message);
      return;
    }

    console.log('✅ Все таблицы доступны!');

    // Check if we have test data
    const { data: instructorCount } = await supabase
      .from('instructors')
      .select('*', { count: 'exact', head: true });

    const { data: workshopCount } = await supabase
      .from('workshops')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Статистика базы данных:`);
    console.log(`   - Преподаватели: ${instructorCount?.length || 0}`);
    console.log(`   - Мастер-классы: ${workshopCount?.length || 0}`);

    if ((instructorCount?.length || 0) === 0) {
      console.log('📝 Добавление тестовых данных...');
      
      // Add test instructors
      const { data: newInstructors, error: instructorInsertError } = await supabase
        .from('instructors')
        .insert([
          {
            name: 'Анна Петрова',
            email: 'anna.petrova@example.com',
            phone: '+7-999-123-4567',
            bio: 'Опытный преподаватель живописи с 10-летним стажем',
            specialties: ['Живопись', 'Рисование', 'Акварель'],
            experience: 10,
            hourly_rate: 25.00,
            is_active: true
          },
          {
            name: 'Михаил Соколов',
            email: 'mikhail.sokolov@example.com',
            phone: '+7-999-234-5678',
            bio: 'Мастер по керамике и гончарному делу',
            specialties: ['Керамика', 'Гончарное дело', 'Скульптура'],
            experience: 8,
            hourly_rate: 30.00,
            is_active: true
          },
          {
            name: 'Елена Кузнецова',
            email: 'elena.kuznetsova@example.com',
            phone: '+7-999-345-6789',
            bio: 'Шеф-повар и преподаватель кулинарии',
            specialties: ['Кулинария', 'Выпечка', 'Кондитерское дело'],
            experience: 12,
            hourly_rate: 35.00,
            is_active: true
          }
        ])
        .select();

      if (instructorInsertError) {
        console.error('❌ Ошибка при добавлении преподавателей:', instructorInsertError.message);
        return;
      }

      console.log(`✅ Добавлено ${newInstructors.length} преподавателей`);

      // Add test workshops
      const { data: newWorkshops, error: workshopInsertError } = await supabase
        .from('workshops')
        .insert([
          {
            title: 'Основы акварельной живописи',
            description: 'Изучите основы работы с акварелью, техники нанесения краски, смешивание цветов и создание красивых пейзажей.',
            short_description: 'Научитесь рисовать акварелью с нуля',
            instructor_id: newInstructors[0].id,
            category: 'art',
            skill_level: 'beginner',
            duration: 3,
            max_participants: 8,
            price: 50.00,
            materials_cost: 15.00,
            status: 'published',
            tags: ['живопись', 'акварель', 'начинающие']
          },
          {
            title: 'Гончарное дело для начинающих',
            description: 'Освойте основы работы на гончарном круге, создание простых форм и обжиг керамики.',
            short_description: 'Создайте свою первую керамическую посуду',
            instructor_id: newInstructors[1].id,
            category: 'crafts',
            skill_level: 'beginner',
            duration: 4,
            max_participants: 6,
            price: 75.00,
            materials_cost: 25.00,
            status: 'published',
            tags: ['керамика', 'гончарное дело', 'рукоделие']
          },
          {
            title: 'Итальянская кухня',
            description: 'Приготовьте традиционные итальянские блюда: пасту, пиццу, ризотто и десерты.',
            short_description: 'Мастер-класс по итальянской кухне',
            instructor_id: newInstructors[2].id,
            category: 'cooking',
            skill_level: 'intermediate',
            duration: 5,
            max_participants: 10,
            price: 60.00,
            materials_cost: 20.00,
            status: 'published',
            tags: ['кулинария', 'итальянская кухня', 'паста']
          }
        ])
        .select();

      if (workshopInsertError) {
        console.error('❌ Ошибка при добавлении мастер-классов:', workshopInsertError.message);
        return;
      }

      console.log(`✅ Добавлено ${newWorkshops.length} мастер-классов`);

      // Add test schedules
      const { data: newSchedules, error: scheduleInsertError } = await supabase
        .from('workshop_schedules')
        .insert([
          {
            workshop_id: newWorkshops[0].id,
            start_date: '2024-02-15',
            end_date: '2024-02-15',
            start_time: '10:00',
            end_time: '13:00',
            location: 'Студия "Краски"',
            max_participants: 8,
            current_participants: 0
          },
          {
            workshop_id: newWorkshops[1].id,
            start_date: '2024-02-16',
            end_date: '2024-02-16',
            start_time: '14:00',
            end_time: '18:00',
            location: 'Мастерская "Глина"',
            max_participants: 6,
            current_participants: 0
          },
          {
            workshop_id: newWorkshops[2].id,
            start_date: '2024-02-17',
            end_date: '2024-02-17',
            start_time: '11:00',
            end_time: '16:00',
            location: 'Кулинарная студия "Вкус"',
            max_participants: 10,
            current_participants: 0
          }
        ])
        .select();

      if (scheduleInsertError) {
        console.error('❌ Ошибка при добавлении расписаний:', scheduleInsertError.message);
        return;
      }

      console.log(`✅ Добавлено ${newSchedules.length} расписаний`);

      // Add test registrations
      const { data: newRegistrations, error: registrationInsertError } = await supabase
        .from('workshop_registrations')
        .insert([
          {
            workshop_id: newWorkshops[0].id,
            schedule_id: newSchedules[0].id,
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
            workshop_id: newWorkshops[1].id,
            schedule_id: newSchedules[1].id,
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
            workshop_id: newWorkshops[2].id,
            schedule_id: newSchedules[2].id,
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
        ])
        .select();

      if (registrationInsertError) {
        console.error('❌ Ошибка при добавлении записей:', registrationInsertError.message);
        return;
      }

      console.log(`✅ Добавлено ${newRegistrations.length} записей`);

      // Update participant counts
      for (let i = 0; i < newSchedules.length; i++) {
        await supabase
          .from('workshop_schedules')
          .update({ current_participants: 1 })
          .eq('id', newSchedules[i].id);
      }

      console.log('✅ Обновлены счетчики участников');
    }

    console.log('\n🎉 Настройка базы данных завершена успешно!');
    console.log('\n📋 Следующие шаги:');
    console.log('1. Убедитесь, что переменные окружения настроены в .env.local');
    console.log('2. Запустите приложение: npm start');
    console.log('3. Перейдите на страницы мастер-классов и записей');

  } catch (error) {
    console.error('❌ Ошибка при настройке базы данных:', error);
  }
}

// Run the setup
setupWorkshopDatabase();
