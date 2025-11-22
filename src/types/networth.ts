export interface Asset {
  id: string
  userId: string
  name: string
  type: "house" | "vehicle" | "investment" | "other"
  value: number
  currency: string
  description?: string
  purchaseDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  userId: string
  name: string
  type: "mortgage" | "personal" | "car" | "credit_card" | "other"
  principal: number
  remainingBalance: number
  currency: string
  interestRate?: number
  monthlyPayment?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Investment {
  id: string
  userId: string
  name: string
  type: "stocks" | "bonds" | "mutual_fund" | "crypto" | "other"
  currentValue: number
  currency: string
  initialInvestment?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface NetWorth {
  totalAssets: number
  totalLoans: number
  totalInvestments: number
  netWorth: number
}

