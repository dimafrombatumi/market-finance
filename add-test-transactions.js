// Скрипт для добавления тестовых транзакций в Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestTransactions() {
  try {
    console.log('💰 Adding test transactions...');
    
    const transactions = [
      // Income transactions
      {
        type: 'income',
        category: 'Sales Revenue',
        description: 'Handmade ceramic mug sales',
        amount: 77.97,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Sold 3 ceramic mugs at craft fair'
      },
      {
        type: 'income',
        category: 'Other Income',
        description: 'Workshop teaching fee',
        amount: 200.00,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Pottery workshop for beginners'
      },
      {
        type: 'income',
        category: 'Sales Revenue',
        description: 'Wooden cutting board sales',
        amount: 90.00,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Sold 2 cutting boards online'
      },
      
      // Expense transactions
      {
        type: 'expense',
        category: 'Materials & Supplies',
        description: 'Clay and glaze materials',
        amount: 150.00,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Bulk order for ceramic production'
      },
      {
        type: 'expense',
        category: 'Rent & Utilities',
        description: 'Studio rent',
        amount: 800.00,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Monthly studio rent'
      },
      {
        type: 'expense',
        category: 'Marketing & Advertising',
        description: 'Social media advertising',
        amount: 75.00,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Facebook and Instagram ads'
      },
      {
        type: 'expense',
        category: 'Equipment & Tools',
        description: 'New pottery wheel',
        amount: 450.00,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Upgraded pottery wheel for better quality'
      },
      {
        type: 'expense',
        category: 'Transportation',
        description: 'Craft fair booth fee',
        amount: 120.00,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Local craft fair participation'
      },
      {
        type: 'expense',
        category: 'Professional Services',
        description: 'Business license renewal',
        amount: 85.00,
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Annual business license fee'
      },
      {
        type: 'expense',
        category: 'Materials & Supplies',
        description: 'Wood for cutting boards',
        amount: 95.00,
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Premium oak wood for cutting boards'
      }
    ];
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();
    
    if (error) {
      console.error('❌ Error inserting transactions:', error);
      console.log('\n🔧 RLS is blocking insertions. Please:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run: ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;');
      console.log('3. Run this script again');
      return;
    }
    
    console.log('✅ Transactions inserted successfully!');
    console.log(`Added ${data.length} transactions:`);
    
    // Group by type
    const incomeTransactions = data.filter(t => t.type === 'income');
    const expenseTransactions = data.filter(t => t.type === 'expense');
    
    console.log(`\n💰 Income transactions (${incomeTransactions.length}):`);
    incomeTransactions.forEach((transaction, index) => {
      console.log(`${index + 1}. ${transaction.description} - $${transaction.amount}`);
    });
    
    console.log(`\n💸 Expense transactions (${expenseTransactions.length}):`);
    expenseTransactions.forEach((transaction, index) => {
      console.log(`${index + 1}. ${transaction.description} - $${transaction.amount}`);
    });
    
    // Calculate totals
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netProfit = totalIncome - totalExpenses;
    
    console.log(`\n📊 Summary:`);
    console.log(`Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`Net Profit: $${netProfit.toFixed(2)}`);
    
    // Проверим, что транзакции добавились
    console.log('\n🔍 Verifying transactions...');
    const { data: allTransactions, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching transactions:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${allTransactions.length} transactions in database`);
    
    console.log('\n🎉 Transaction setup complete!');
    console.log('Now you can add transactions through the web interface.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

addTestTransactions();
