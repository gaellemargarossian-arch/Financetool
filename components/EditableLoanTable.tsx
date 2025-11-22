"use client"

import { useState } from "react"
import { Loan } from "@/src/types/networth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatCurrency"
import { Save, X } from "lucide-react"

interface EditableLoanTableProps {
  loans: Loan[]
  onUpdate: (id: string, loan: Partial<Loan>) => void
  onDelete: (id: string) => void
}

export function EditableLoanTable({ loans, onUpdate, onDelete }: EditableLoanTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Loan>>({})

  const startEdit = (loan: Loan) => {
    setEditingId(loan.id)
    setEditData({
      name: loan.name,
      type: loan.type,
      remainingBalance: loan.remainingBalance,
      principal: loan.principal,
      currency: loan.currency,
      interestRate: loan.interestRate,
      monthlyPayment: loan.monthlyPayment,
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
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Remaining Balance</TableHead>
            <TableHead>Monthly Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => {
            const isEditing = editingId === loan.id

            return (
              <TableRow key={loan.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.name || loan.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-40"
                    />
                  ) : (
                    loan.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.type || loan.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as Loan["type"] })}
                    >
                      <option value="mortgage">Mortgage</option>
                      <option value="personal">Personal</option>
                      <option value="car">Car</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="other">Other</option>
                    </Select>
                  ) : (
                    <span className="capitalize">{loan.type.replace("_", " ")}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.remainingBalance ?? loan.remainingBalance}
                      onChange={(e) => setEditData({ ...editData, remainingBalance: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-red-600">{formatCurrency(loan.remainingBalance, loan.currency)}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.monthlyPayment ?? loan.monthlyPayment ?? 0}
                      onChange={(e) => setEditData({ ...editData, monthlyPayment: parseFloat(e.target.value) || 0 })}
                      className="w-28"
                    />
                  ) : (
                    loan.monthlyPayment ? formatCurrency(loan.monthlyPayment, loan.currency) : "-"
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
                      <Button size="sm" variant="outline" onClick={() => startEdit(loan)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(loan.id)}>
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

