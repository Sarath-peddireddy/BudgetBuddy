import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Calendar, IndianRupee } from 'lucide-react';

const ExpenseCard = ({ expense, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(expense.id);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
    setIsDeleting(false);
  };

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
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-lg hover:scale-105 border-l-4 animate-in slide-in-from-right duration-500"
      style={{ borderLeftColor: expense.color }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: expense.color }}
              ></div>
              <h3 className="font-semibold text-slate-800 text-lg">
                {expense.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                <span className="font-medium text-slate-800">
                  {expense.price.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            {isDeleting ? (
              <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;