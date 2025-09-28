import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Plus, IndianRupee } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AddExpenseForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in both expense name and price.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAdd({
        name: formData.name.trim(),
        price: price
      });
      
      toast({
        title: "Success!",
        description: `Added ${formData.name} - ₹${price.toLocaleString('en-IN')}`
      });
      
      setFormData({ name: '', price: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-slate-800">Add New Expense</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="expense-name" className="text-sm font-medium text-slate-700">
                Expense Name
              </Label>
              <Input
                id="expense-name"
                type="text"
                placeholder="e.g., Lunch at restaurant"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-price" className="text-sm font-medium text-slate-700">
                Price (₹)
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="expense-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="150.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpenseForm;