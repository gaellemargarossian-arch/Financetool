"use client"

import { useState } from "react"
import { Account, Transaction, Budget } from "@/src/types"

function getMockAccounts(): Account[] {
  return [
  {
    id: "1",
    userId: "user1",
    name: "Emirates NBD Savings",
    type: "bank",
    balance: 25000,
    currency: "AED",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    name: "ADCB Credit Card",
    type: "credit_card",
    balance: -3500,
    currency: "AED",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user1",
    name: "Personal Loan",
    type: "loan",
    balance: -15000,
    currency: "AED",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  ]
}

function getMockTransactions(): Transaction[] {
  return [
  {
    id: "1",
    userId: "user1",
    accountId: "1",
    type: "expense",
    amount: 4500,
    currency: "AED",
    merchant: "Landlord",
    category: "Rent",
    description: "Monthly rent payment",
    date: new Date("2024-12-01"),
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    accountId: "1",
    type: "expense",
    amount: 350,
    currency: "AED",
    merchant: "DEWA",
    category: "DEWA",
    description: "Electricity and water bill",
    date: new Date("2024-12-05"),
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user1",
    accountId: "1",
    type: "expense",
    amount: 120,
    currency: "AED",
    merchant: "Etisalat",
    category: "Telecom",
    description: "Mobile and internet",
    date: new Date("2024-12-06"),
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    userId: "user1",
    accountId: "1",
    type: "expense",
    amount: 250,
    currency: "AED",
    merchant: "Carrefour",
    category: "Groceries",
    description: "Weekly groceries",
    date: new Date("2024-12-07"),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    userId: "user1",
    accountId: "1",
    type: "expense",
    amount: 85,
    currency: "AED",
    merchant: "Starbucks",
    category: "Coffee",
    description: "Coffee and snacks",
    date: new Date("2024-12-08"),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    userId: "user1",
    accountId: "1",
    type: "income",
    amount: 15000,
    currency: "AED",
    merchant: "Company",
    category: "Salary",
    description: "Monthly salary",
    date: new Date("2024-12-01"),
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ]
}

function getMockBudgets(): Budget[] {
  return [
  {
    id: "1",
    userId: "user1",
    category: "Groceries",
    amount: 1000,
    currency: "AED",
    period: "monthly",
    startDate: new Date("2024-12-01"),
    alertThreshold: 80,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    category: "Restaurants",
    amount: 500,
    currency: "AED",
    period: "monthly",
    startDate: new Date("2024-12-01"),
    alertThreshold: 80,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user1",
    category: "Entertainment",
    amount: 300,
    currency: "AED",
    period: "monthly",
    startDate: new Date("2024-12-01"),
    alertThreshold: 80,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ]
}

export function useFinanceData() {
  const [accounts, setAccounts] = useState<Account[]>(() => getMockAccounts())
  const [transactions, setTransactions] = useState<Transaction[]>(() => getMockTransactions())
  const [budgets, setBudgets] = useState<Budget[]>(() => getMockBudgets())

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTransactions([newTransaction, ...transactions])
  }

  const addAccount = (account: Omit<Account, "id" | "createdAt" | "updatedAt">) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setAccounts([...accounts, newAccount])
  }

  const addBudget = (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setBudgets([...budgets, newBudget])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date() }
          : t
      )
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...updates, updatedAt: new Date() }
          : a
      )
    )
  }

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const importData = (data: { transactions: Transaction[]; accounts: Account[] }) => {
    if (data.transactions.length > 0) {
      setTransactions((prev) => [...data.transactions, ...prev])
    }
    if (data.accounts.length > 0) {
      setAccounts((prev) => [...data.accounts, ...prev])
    }
  }

  const categorySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  return {
    accounts,
    transactions,
    budgets,
    totalBalance,
    totalIncome,
    totalExpenses,
    categorySpending,
    addTransaction,
    addAccount,
    addBudget,
    updateTransaction,
    deleteTransaction,
    updateAccount,
    deleteAccount,
    importData,
  }
}

