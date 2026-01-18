import { useState } from "react";
import { Goal } from "@/types/goal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Target, Calendar } from "lucide-react";
import { differenceInDays, parseISO, isValid } from "date-fns";

interface GoalListProps {
  goals: Goal[];
  onUpdateGoal: (id: string, updates: Partial<Omit<Goal, "id">>) => void;
  onAddGoal: (title: string, deadline: string) => void;
}

const GoalList = ({ goals, onUpdateGoal, onAddGoal }: GoalListProps) => {
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [editingGoals, setEditingGoals] = useState<Record<string, { title: string; deadline: string }>>({});

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const canAddGoal = activeGoals.length < 10;

  const getCountdown = (deadline: string): { days: number; label: string; color: string } | null => {
    if (!deadline) return null;
    const deadlineDate = parseISO(deadline);
    if (!isValid(deadlineDate)) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = differenceInDays(deadlineDate, today);
    
    if (days < 0) {
      return { days: Math.abs(days), label: "overdue", color: "text-red-500" };
    } else if (days === 0) {
      return { days: 0, label: "today", color: "text-orange-500" };
    } else if (days <= 7) {
      return { days, label: "days left", color: "text-orange-500" };
    } else if (days <= 30) {
      return { days, label: "days left", color: "text-yellow-500" };
    } else {
      return { days, label: "days left", color: "text-muted-foreground" };
    }
  };

  const handleAddGoal = () => {
    if (newGoalTitle.trim() && canAddGoal) {
      onAddGoal(newGoalTitle.trim(), newGoalDeadline);
      setNewGoalTitle("");
      setNewGoalDeadline("");
    }
  };

  const handleFieldChange = (id: string, field: "title" | "deadline", value: string) => {
    setEditingGoals((prev) => ({
      ...prev,
      [id]: {
        title: field === "title" ? value : (prev[id]?.title ?? goals.find(g => g.id === id)?.title ?? ""),
        deadline: field === "deadline" ? value : (prev[id]?.deadline ?? goals.find(g => g.id === id)?.deadline ?? ""),
      },
    }));
  };

  const handleFieldBlur = (id: string, field: "title" | "deadline") => {
    const editing = editingGoals[id];
    if (!editing) return;

    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    if (field === "title" && editing.title !== undefined && editing.title.trim()) {
      onUpdateGoal(id, { title: editing.title.trim() });
    }
    if (field === "deadline" && editing.deadline !== undefined) {
      onUpdateGoal(id, { deadline: editing.deadline });
    }

    setEditingGoals((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const renderGoalItem = (goal: Goal) => {
    const isEditing = editingGoals[goal.id] !== undefined;
    const displayTitle = isEditing ? editingGoals[goal.id].title : goal.title;
    const displayDeadline = isEditing ? editingGoals[goal.id].deadline : goal.deadline;
    const countdown = getCountdown(goal.deadline);

    return (
      <div
        key={goal.id}
        className={`flex flex-col gap-2 p-3 rounded-lg border transition-colors ${
          goal.completed
            ? "bg-muted/50 border-muted"
            : "bg-card border-border hover:border-primary/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={goal.completed}
            onCheckedChange={(checked) =>
              onUpdateGoal(goal.id, { completed: checked === true })
            }
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />
          <Input
            value={displayTitle}
            onChange={(e) => handleFieldChange(goal.id, "title", e.target.value)}
            onBlur={() => handleFieldBlur(goal.id, "title")}
            className={`flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 ${
              goal.completed ? "line-through text-muted-foreground" : ""
            }`}
            placeholder="Enter goal..."
          />
        </div>
        <div className="flex items-center gap-2 ml-7">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="date"
            value={displayDeadline}
            onChange={(e) => handleFieldChange(goal.id, "deadline", e.target.value)}
            onBlur={() => handleFieldBlur(goal.id, "deadline")}
            className="h-7 text-xs border-dashed bg-transparent w-32"
            placeholder="Set deadline"
          />
          {countdown && !goal.completed && (
            <span className={`text-xs font-medium ${countdown.color}`}>
              {countdown.label === "today" ? (
                "Due today!"
              ) : countdown.label === "overdue" ? (
                `${countdown.days}d overdue`
              ) : (
                `${countdown.days}d left`
              )}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-foreground">2026 Goals</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {activeGoals.length}/10 active
        </span>
      </div>

      {/* Active goals */}
      <div className="space-y-2">
        {activeGoals.map(renderGoalItem)}
      </div>

      {/* Add goal form */}
      {canAddGoal && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new goal..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              className="flex-1"
            />
            <Button
              onClick={handleAddGoal}
              disabled={!newGoalTitle.trim()}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Deadline"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              className="w-40 h-8 text-sm"
            />
            <span className="text-xs text-muted-foreground">Optional deadline</span>
          </div>
        </div>
      )}

      {!canAddGoal && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Complete a goal to add a new one
        </p>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Completed ({completedGoals.length})
          </p>
          <div className="space-y-2">{completedGoals.map(renderGoalItem)}</div>
        </div>
      )}
    </div>
  );
};

export default GoalList;