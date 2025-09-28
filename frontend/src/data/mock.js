// Mock data for ExpenseGlow app
// This will be replaced with real backend data later

const getRandomColor = () => {
  const colors = ['#F1A9A0', '#A9CCE3', '#F9E79F', '#82E0AA', '#BB8FCE', '#F8C471', '#85C1E9', '#F7DC6F'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateMockExpenses = () => {
  const expenses = [
    // Today's expenses
    {
      id: 1,
      name: "Coffee & Pastry",
      price: 250,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 2,
      name: "Lunch at Restaurant",
      price: 480,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 3,
      name: "Auto Rickshaw",
      price: 120,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Yesterday's expenses
    {
      id: 4,
      name: "Grocery Shopping",
      price: 1850,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 5,
      name: "Movie Tickets",
      price: 600,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 6,
      name: "Petrol Fill-up",
      price: 2200,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Day before yesterday
    {
      id: 7,
      name: "Pharmacy",
      price: 380,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 8,
      name: "Netflix Subscription",
      price: 649,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // A week ago
    {
      id: 9,
      name: "Books from Amazon",
      price: 1200,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 10,
      name: "Dinner with Friends",
      price: 1800,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Two weeks ago
    {
      id: 11,
      name: "Clothing Shopping",
      price: 3500,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 12,
      name: "Internet Bill",
      price: 999,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    }
  ];
  
  return expenses;
};

export const mockExpenses = generateMockExpenses();

// Mock API functions (to be replaced with real backend calls)
export const mockApi = {
  getExpenses: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockExpenses;
  },
  
  addExpense: async (expenseData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    };
    
    mockExpenses.unshift(newExpense);
    return newExpense;
  },
  
  deleteExpense: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockExpenses.findIndex(expense => expense.id === id);
    if (index > -1) {
      mockExpenses.splice(index, 1);
      return true;
    }
    return false;
  }
};