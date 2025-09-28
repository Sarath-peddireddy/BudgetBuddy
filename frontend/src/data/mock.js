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
      price: 8.50,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 2,
      name: "Lunch at Restaurant",
      price: 25.00,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 3,
      name: "Uber Ride",
      price: 15.75,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Yesterday's expenses
    {
      id: 4,
      name: "Grocery Shopping",
      price: 89.25,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 5,
      name: "Movie Tickets",
      price: 24.00,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 6,
      name: "Gas Station",
      price: 45.00,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Day before yesterday
    {
      id: 7,
      name: "Pharmacy",
      price: 12.99,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 8,
      name: "Online Subscription",
      price: 9.99,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // A week ago
    {
      id: 9,
      name: "Books",
      price: 35.50,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 10,
      name: "Dinner with Friends",
      price: 67.80,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    
    // Two weeks ago
    {
      id: 11,
      name: "Clothing",
      price: 125.00,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: getRandomColor()
    },
    {
      id: 12,
      name: "Internet Bill",
      price: 79.99,
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