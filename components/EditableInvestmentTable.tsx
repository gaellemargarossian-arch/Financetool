"use client"

import { useState } from "react"
import { Investment } from "@/src/types/networth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatCurrency"
import { Save, X } from "lucide-react"

interface EditableInvestmentTableProps {
  investments: Investment[]
  onUpdate: (id: string, investment: Partial<Investment>) => void
  onDelete: (id: string) => void
}

export function EditableInvestmentTable({ investments, onUpdate, onDelete }: EditableInvestmentTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Investment>>({})

  const startEdit = (investment: Investment) => {
    setEditingId(investment.id)
    setEditData({
      name: investment.name,
      type: investment.type,
      currentValue: investment.currentValue,
      currency: investment.currency,
      initialInvestment: investment.initialInvestment,
      description: investment.description,
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
            <TableHead>Current Value</TableHead>
            <TableHead>Initial Investment</TableHead>
            <TableHead>Gain/Loss</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => {
            const isEditing = editingId === investment.id
            const gainLoss = investment.currentValue - (investment.initialInvestment || 0)

            return (
              <TableRow key={investment.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.name || investment.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-40"
                    />
                  ) : (
                    investment.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.type || investment.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as Investment["type"] })}
                    >
                      <option value="stocks">Stocks</option>
                      <option value="bonds">Bonds</option>
                      <option value="mutual_fund">Mutual Fund</option>
                      <option value="crypto">Crypto</option>
                      <option value="other">Other</option>
                    </Select>
                  ) : (
                    <span className="capitalize">{investment.type.replace("_", " ")}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.currentValue ?? investment.currentValue}
                      onChange={(e) => setEditData({ ...editData, currentValue: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  ) : (
                    formatCurrency(investment.currentValue, investment.currency)
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.initialInvestment ?? investment.initialInvestment ?? 0}
                      onChange={(e) => setEditData({ ...editData, initialInvestment: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  ) : (
                    investment.initialInvestment ? formatCurrency(investment.initialInvestment, investment.currency) : "-"
                  )}
                </TableCell>
                <TableCell>
                  {!isEditing && investment.initialInvestment && (
                    <span className={gainLoss >= 0 ? "text-green-600" : "text-red-600"}>
                      {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss, investment.currency)}
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
                      <Button size="sm" variant="outline" onClick={() => startEdit(investment)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(investment.id)}>
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

