// Скрипт для отключения RLS через Supabase API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableRLS() {
  try {
    console.log('Attempting to disable RLS...');
    
    // Попробуем выполнить SQL через rpc функцию
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE products DISABLE ROW LEVEL SECURITY;'
    });
    
    if (error) {
      console.log('RPC error:', error);
      
      // Попробуем другой подход - проверим, есть ли функция exec_sql
      console.log('Trying alternative approach...');
      
      // Попробуем выполнить простой запрос для проверки доступа
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.log('Test query error:', testError);
        console.log('RLS is blocking access. Please fix RLS policies manually.');
        console.log('See SUPABASE_RLS_FIX.md for instructions.');
      } else {
        console.log('Test query successful:', testData);
      }
    } else {
      console.log('✅ RLS disabled successfully');
    }
    
  } catch (error) {
    console.error('❌ Failed to disable RLS:', error);
  }
}

disableRLS();
