"use client"

import { useState } from "react"
import { Transaction } from "@/src/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatCurrency"
import { Save, X } from "lucide-react"
import { DEFAULT_CATEGORIES } from "@/src/constants/categories"

interface EditableTransactionTableProps {
  transactions: Transaction[]
  onUpdate: (id: string, transaction: Partial<Transaction>) => void
  onDelete: (id: string) => void
}

export function EditableTransactionTable({ transactions, onUpdate, onDelete }: EditableTransactionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Transaction>>({})

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditData({
      amount: transaction.amount,
      category: transaction.category,
      merchant: transaction.merchant,
      description: transaction.description,
      type: transaction.type,
    })
  }

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editData)
      setEditingId(null)
      setEditData({})
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isEditing = editingId === transaction.id

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.type || transaction.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as "expense" | "income" })}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                      <option value="transfer">Transfer</option>
                    </Select>
                  ) : (
                    <span className="capitalize">{transaction.type}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.merchant || transaction.merchant || ""}
                      onChange={(e) => setEditData({ ...editData, merchant: e.target.value })}
                      className="w-32"
                    />
                  ) : (
                    transaction.merchant || transaction.description
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.category || transaction.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    transaction.category
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.amount || transaction.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                    />
                  ) : (
                    <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(transaction)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(transaction.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

