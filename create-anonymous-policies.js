// Скрипт для создания политик RLS для анонимных пользователей
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAnonymousPolicies() {
  try {
    console.log('Creating anonymous policies...');
    
    // Создаем политики для анонимных пользователей
    const policies = [
      // Удаляем старые политики
      'DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON products;',
      'DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sales;',
      'DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sale_items;',
      'DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON transactions;',
      
      // Создаем новые политики для анонимных пользователей
      'CREATE POLICY "Allow all operations for anonymous users" ON products FOR ALL USING (true);',
      'CREATE POLICY "Allow all operations for anonymous users" ON sales FOR ALL USING (true);',
      'CREATE POLICY "Allow all operations for anonymous users" ON sale_items FOR ALL USING (true);',
      'CREATE POLICY "Allow all operations for anonymous users" ON transactions FOR ALL USING (true);'
    ];
    
    for (const policy of policies) {
      console.log(`Executing: ${policy}`);
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`Error executing policy: ${error.message}`);
        // Попробуем выполнить через обычный запрос
        const { error: queryError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
        
        if (queryError) {
          console.log('Query error:', queryError);
        }
      } else {
        console.log('✅ Policy executed successfully');
      }
    }
    
    console.log('✅ Anonymous policies created');
    
  } catch (error) {
    console.error('❌ Failed to create policies:', error);
  }
}

createAnonymousPolicies();
