import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { mockExpenses } from '../data/mock';
import ExpenseCard from './ExpenseCard';
import AddExpenseForm from './AddExpenseForm';
import ExpenseHistory from './ExpenseHistory';

const ExpenseGlow = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    // Load mock data on component mount
    setExpenses(mockExpenses);
  }, []);

  useEffect(() => {
    // Calculate total when expenses change
    const total = expenses.reduce((sum, expense) => sum + expense.price, 0);
    setTotalExpense(total);
    
    // Animate total counter
    const duration = 1000;
    const start = animatedTotal;
    const increment = (total - start) / (duration / 16);
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= total) || (increment < 0 && current <= total)) {
        setAnimatedTotal(total);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.round(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [expenses]);

  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      date: new Date().toISOString().split('T')[0],
      color: getRandomColor()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowAddForm(false);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const getRandomColor = () => {
    const colors = ['#F1A9A0', '#A9CCE3', '#F9E79F', '#82E0AA', '#BB8FCE', '#F8C471', '#85C1E9', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const todayExpenses = expenses.filter(expense => {
    const today = new Date().toISOString().split('T')[0];
    return expense.date === today;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            ExpenseGlow ✨
          </h1>
          <p className="text-slate-600 text-lg">Track. Visualize. Simplify.</p>
        </div>

        {/* Total Expense Card */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-600 mb-1">Total Expenses - {getCurrentMonthName()}</p>
                <p className="text-3xl font-bold text-teal-800">
                  ${animatedTotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-slate-700">Today's Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {todayExpenses.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No expenses added today. Start tracking!</p>
                  ) : (
                    todayExpenses.map((expense) => (
                      <ExpenseCard 
                        key={expense.id} 
                        expense={expense} 
                        onDelete={deleteExpense}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-slate-700">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {expenses.slice(0, 10).map((expense) => (
                    <ExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onDelete={deleteExpense}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <ExpenseHistory expenses={expenses} onDelete={deleteExpense} />
          </TabsContent>
        </Tabs>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Add Expense Modal */}
        {showAddForm && (
          <AddExpenseForm 
            onAdd={addExpense}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseGlow;