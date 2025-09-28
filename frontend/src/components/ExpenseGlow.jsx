import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, TrendingUp, Calendar, DollarSign, Settings, AlertTriangle } from 'lucide-react';
import { mockExpenses } from '../data/mock';
import ExpenseCard from './ExpenseCard';
import AddExpenseForm from './AddExpenseForm';
import ExpenseHistory from './ExpenseHistory';
import MonthlyLimitModal from './MonthlyLimitModal';
import { useToast } from '../hooks/use-toast';

const ExpenseGlow = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyLimit, setMonthlyLimit] = useState(15000); // Default ₹15,000
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data on component mount
    setExpenses(mockExpenses);
  }, []);

  useEffect(() => {
    // Calculate total when expenses change
    const currentMonthExpenses = getCurrentMonthExpenses();
    const total = currentMonthExpenses.reduce((sum, expense) => sum + expense.price, 0);
    setTotalExpense(total);
    
    // Check monthly limit warning
    checkMonthlyLimitWarning(total);
    
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
  }, [expenses, selectedDate, monthlyLimit]);

  const getCurrentMonthExpenses = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  };

  const checkMonthlyLimitWarning = (currentTotal) => {
    const warningThreshold = monthlyLimit * 0.8; // 80% of limit
    const criticalThreshold = monthlyLimit * 0.95; // 95% of limit
    
    if (currentTotal >= criticalThreshold && currentTotal < monthlyLimit) {
      const remaining = monthlyLimit - currentTotal;
      toast({
        title: "⚠️ Critical: Monthly Limit Nearly Reached!",
        description: `Only ₹${remaining.toFixed(0)} remaining of your ₹${monthlyLimit} limit!`,
        variant: "destructive"
      });
    } else if (currentTotal >= warningThreshold && currentTotal < criticalThreshold) {
      const remaining = monthlyLimit - currentTotal;
      toast({
        title: "⚠️ Warning: Approaching Monthly Limit",
        description: `₹${remaining.toFixed(0)} remaining of your ₹${monthlyLimit} monthly limit.`,
      });
    } else if (currentTotal >= monthlyLimit) {
      const exceeded = currentTotal - monthlyLimit;
      toast({
        title: "🚨 Monthly Limit Exceeded!",
        description: `You've exceeded your limit by ₹${exceeded.toFixed(0)}. Consider reviewing your expenses.`,
        variant: "destructive"
      });
    }
  };

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

  const updateMonthlyLimit = (newLimit) => {
    setMonthlyLimit(newLimit);
    setShowLimitModal(false);
    toast({
      title: "Monthly Limit Updated",
      description: `New monthly limit set to ₹${newLimit.toLocaleString()}`
    });
  };

  const getRandomColor = () => {
    const colors = ['#F1A9A0', '#A9CCE3', '#F9E79F', '#82E0AA', '#BB8FCE', '#F8C471', '#85C1E9', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCurrentMonthName = () => {
    return selectedDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const todayExpenses = expenses.filter(expense => {
    const today = new Date().toISOString().split('T')[0];
    return expense.date === today;
  });

  const currentMonthExpenses = getCurrentMonthExpenses();
  const limitPercentage = (totalExpense / monthlyLimit) * 100;
  const remainingBudget = monthlyLimit - totalExpense;

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

        {/* Month Navigation */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMonthChange('prev')}
                className="hover:bg-blue-100"
              >
                ← Previous
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-800">
                  {getCurrentMonthName()}
                </h2>
                <p className="text-sm text-slate-600">Select month to view expenses</p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMonthChange('next')}
                className="hover:bg-blue-100"
              >
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Limit & Total Expense Card */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-teal-600">Total Expenses - {getCurrentMonthName()}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLimitModal(true)}
                    className="text-teal-600 hover:bg-teal-100"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Limit: ₹{monthlyLimit.toLocaleString()}
                  </Button>
                </div>
                <p className="text-3xl font-bold text-teal-800 mb-2">
                  ₹{animatedTotal.toLocaleString()}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-teal-100 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      limitPercentage >= 95 ? 'bg-red-500' : 
                      limitPercentage >= 80 ? 'bg-yellow-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(limitPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`${remainingBudget >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                    {remainingBudget >= 0 ? 
                      `₹${remainingBudget.toLocaleString()} remaining` : 
                      `₹${Math.abs(remainingBudget).toLocaleString()} over budget`
                    }
                  </span>
                  <span className="text-slate-500">
                    {limitPercentage.toFixed(1)}% of limit
                  </span>
                </div>
              </div>
              
              <div className={`p-3 rounded-full ${
                limitPercentage >= 95 ? 'bg-red-100' : 
                limitPercentage >= 80 ? 'bg-yellow-100' : 'bg-teal-100'
              }`}>
                {limitPercentage >= 80 ? (
                  <AlertTriangle className={`h-8 w-8 ${
                    limitPercentage >= 95 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                ) : (
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

            {/* Recent Expenses for Selected Month */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-slate-700">
                  {getCurrentMonthName()} Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {currentMonthExpenses.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No expenses found for {getCurrentMonthName()}
                    </p>
                  ) : (
                    currentMonthExpenses.slice(0, 10).map((expense) => (
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
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <ExpenseHistory 
              expenses={currentMonthExpenses}
              onDelete={deleteExpense}
              selectedMonth={getCurrentMonthName()}
            />
          </TabsContent>
        </Tabs>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => {
              console.log('Add button clicked, current showAddForm:', showAddForm);
              setShowAddForm(true);
              console.log('setShowAddForm(true) called');
            }}
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

        {/* Monthly Limit Modal */}
        {showLimitModal && (
          <MonthlyLimitModal
            currentLimit={monthlyLimit}
            onUpdate={updateMonthlyLimit}
            onClose={() => setShowLimitModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseGlow;