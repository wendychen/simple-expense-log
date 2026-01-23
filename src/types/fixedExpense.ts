export type Frequency = "weekly" | "monthly" | "quarterly" | "yearly";

export interface FixedExpense {
  id: string;
  description: string;
  amount: number; // Stored in NTD
  frequency: Frequency;
  isActive: boolean;
  createdAt: string;
}

// Calculate monthly equivalent for display
export const getMonthlyEquivalent = (amount: number, frequency: Frequency): number => {
  switch (frequency) {
    case "weekly":
      return amount * 4.33;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
};
