"use client"

import { useState } from "react"
import { Asset, Loan, Investment } from "@/src/types/networth"

function getMockAssets(): Asset[] {
  return [
    {
      id: "1",
      userId: "user1",
      name: "Apartment in Dubai Marina",
      type: "house",
      value: 1200000,
      currency: "AED",
      purchaseDate: new Date("2020-01-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

function getMockLoans(): Loan[] {
  return [
    {
      id: "1",
      userId: "user1",
      name: "Home Mortgage",
      type: "mortgage",
      principal: 1000000,
      remainingBalance: 850000,
      currency: "AED",
      interestRate: 3.5,
      monthlyPayment: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      name: "Car Loan",
      type: "car",
      principal: 150000,
      remainingBalance: 75000,
      currency: "AED",
      interestRate: 4.2,
      monthlyPayment: 2500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

function getMockInvestments(): Investment[] {
  return [
    {
      id: "1",
      userId: "user1",
      name: "Dubai Stocks Portfolio",
      type: "stocks",
      currentValue: 50000,
      currency: "AED",
      initialInvestment: 40000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      name: "Mutual Fund",
      type: "mutual_fund",
      currentValue: 75000,
      currency: "AED",
      initialInvestment: 70000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

export function useNetWorth() {
  const [assets, setAssets] = useState<Asset[]>(() => getMockAssets())
  const [loans, setLoans] = useState<Loan[]>(() => getMockLoans())
  const [investments, setInvestments] = useState<Investment[]>(() => getMockInvestments())

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const totalLoans = loans.reduce((sum, l) => sum + l.remainingBalance, 0)
  const totalInvestments = investments.reduce((sum, i) => sum + i.currentValue, 0)
  const netWorth = totalAssets + totalInvestments - totalLoans

  const addAsset = (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setAssets([...assets, newAsset])
  }

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      )
    )
  }

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  const addLoan = (loan: Omit<Loan, "id" | "createdAt" | "updatedAt">) => {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLoans([...loans, newLoan])
  }

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l
      )
    )
  }

  const deleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id))
  }

  const addInvestment = (investment: Omit<Investment, "id" | "createdAt" | "updatedAt">) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setInvestments([...investments, newInvestment])
  }

  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    setInvestments((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
      )
    )
  }

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id))
  }

  return {
    assets,
    loans,
    investments,
    totalAssets,
    totalLoans,
    totalInvestments,
    netWorth,
    addAsset,
    updateAsset,
    deleteAsset,
    addLoan,
    updateLoan,
    deleteLoan,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  }
}

