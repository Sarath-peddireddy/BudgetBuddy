import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import ExpenseCard from './ExpenseCard';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';

const ExpenseHistory = ({ expenses, onDelete }) => {
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
    const stats = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          total: 0,
          count: 0
        };
      }
      
      stats[monthKey].total += expense.price;
      stats[monthKey].count += 1;
    });
    
    return Object.values(stats).sort((a, b) => b.month.localeCompare(a.month));
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
      return date.toLocaleDateString('en-US', { 
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
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No Expenses Yet</h3>
          <p className="text-slate-500">Start adding expenses to see your history here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-700">
            <TrendingUp className="h-5 w-5" />
            Monthly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {monthlyStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border"
              >
                <p className="text-sm text-slate-600 mb-1">{stat.month}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-800">
                    ${stat.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {stat.count} expense{stat.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">
                      ${group.total.toFixed(2)}
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