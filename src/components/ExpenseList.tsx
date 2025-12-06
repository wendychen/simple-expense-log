import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm mt-1">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dayExpenses = groupedExpenses[date];
        const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        return (
          <div key={date} className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {format(parseISO(date), "EEEE, MMMM d")}
              </h3>
              <span className="text-sm font-medium text-primary">
                ${dayTotal.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {dayExpenses.map((expense, index) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-foreground font-medium truncate flex-1 mr-4">
                    {expense.description}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground font-semibold tabular-nums">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
