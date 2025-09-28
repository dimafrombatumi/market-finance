// Скрипт для добавления данных через REST API
const fetch = require('node-fetch').default;

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

async function insertViaREST() {
  try {
    console.log('Trying to insert data via REST API...');
    
    const product = {
      name: 'Test Product REST',
      description: 'A test product added via REST API',
      price: 19.99,
      cost: 10.00,
      category: 'Test',
      stock_quantity: 10,
      min_stock_level: 2
    };
    
    const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(product)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Product inserted successfully via REST:', data);
    } else {
      console.error('❌ REST API error:', data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
    }
    
  } catch (error) {
    console.error('❌ Failed to insert via REST:', error);
  }
}

insertViaREST();
