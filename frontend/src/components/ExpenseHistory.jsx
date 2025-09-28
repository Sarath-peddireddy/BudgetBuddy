import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import ExpenseCard from './ExpenseCard';
import { Calendar, TrendingUp, IndianRupee } from 'lucide-react';

const ExpenseHistory = ({ expenses, onDelete, selectedMonth }) => {
  const groupedExpenses = useMemo(() => {
    const groups = {};
    
    expenses.forEach(expense => {
      const date = expense.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
    });
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    
    return sortedDates.map(date => ({
      date,
      expenses: groups[date].sort((a, b) => new Date(b.id) - new Date(a.id)), // Sort by creation time
      total: groups[date].reduce((sum, expense) => sum + expense.price, 0)
    }));
  }, [expenses]);

  const monthlyStats = useMemo(() => {
    if (expenses.length === 0) return null;
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.price, 0);
    const averagePerDay = expenses.length > 0 ? totalAmount / new Set(expenses.map(e => e.date)).size : 0;
    const highestExpense = Math.max(...expenses.map(e => e.price));
    const lowestExpense = Math.min(...expenses.map(e => e.price));
    
    return {
      total: totalAmount,
      count: expenses.length,
      averagePerDay,
      highest: highestExpense,
      lowest: lowestExpense,
      uniqueDays: new Set(expenses.map(e => e.date)).size
    };
  }, [expenses]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            No Expenses for {selectedMonth}
          </h3>
          <p className="text-slate-500">
            Start adding expenses to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Summary Statistics */}
      {monthlyStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-700">
              <TrendingUp className="h-5 w-5" />
              {selectedMonth} Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-700 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-teal-800 flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {monthlyStats.total.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-blue-800">
                  {monthlyStats.count}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-purple-800 flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {monthlyStats.averagePerDay.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-1">Active Days</p>
                <p className="text-2xl font-bold text-green-800">
                  {monthlyStats.uniqueDays}
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Highest Expense:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {monthlyStats.highest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Lowest Expense:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {monthlyStats.lowest.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-700">
            <Calendar className="h-5 w-5" />
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {groupedExpenses.map((group, index) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white py-2 z-10">
                  <h3 className="text-lg font-semibold text-slate-700">
                    {formatDate(group.date)}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-medium">
                      {group.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-500">
                      ({group.expenses.length} item{group.expenses.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
                
                {/* Expenses for this date */}
                <div className="space-y-3 mb-4">
                  {group.expenses.map((expense) => (
                    <ExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onDelete={onDelete}
                    />
                  ))}
                </div>
                
                {/* Separator between days */}
                {index < groupedExpenses.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseHistory;