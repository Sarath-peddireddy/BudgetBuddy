import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Target, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MonthlyLimitModal = ({ currentLimit, onUpdate, onClose }) => {
  const [newLimit, setNewLimit] = useState(currentLimit.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const predefinedLimits = [5000, 10000, 15000, 20000, 25000, 30000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const limitAmount = parseFloat(newLimit);
    if (isNaN(limitAmount) || limitAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }

    if (limitAmount < 1000) {
      toast({
        title: "Error",
        description: "Monthly limit should be at least ₹1,000.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onUpdate(limitAmount);
      toast({
        title: "Success!",
        description: `Monthly limit updated to ₹${limitAmount.toLocaleString()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monthly limit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePredefinedLimit = (amount) => {
    setNewLimit(amount.toString());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-600" />
              Set Monthly Limit
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Set a monthly spending limit to track your budget effectively.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Limit Display */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                Current Monthly Limit
              </div>
              <p className="text-2xl font-bold text-slate-800">
                ₹{currentLimit.toLocaleString()}
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Quick Select
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {predefinedLimits.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={newLimit === amount.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePredefinedLimit(amount)}
                    className="text-xs"
                  >
                    ₹{amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="monthly-limit" className="text-sm font-medium text-slate-700">
                Custom Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                  ₹
                </span>
                <Input
                  id="monthly-limit"
                  type="number"
                  step="100"
                  min="1000"
                  placeholder="15000"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="pl-8"
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-500">
                Minimum limit: ₹1,000
              </p>
            </div>
            
            {/* Action Buttons */}
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
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Update Limit
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

export default MonthlyLimitModal;