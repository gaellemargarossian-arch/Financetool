"use client"

import { useState } from "react"
import { Account } from "@/src/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatCurrency"
import { Save, X } from "lucide-react"

interface EditableAccountTableProps {
  accounts: Account[]
  onUpdate: (id: string, account: Partial<Account>) => void
  onDelete: (id: string) => void
}

export function EditableAccountTable({ accounts, onUpdate, onDelete }: EditableAccountTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Account>>({})

  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setEditData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
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
            <TableHead>Balance</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const isEditing = editingId === account.id

            return (
              <TableRow key={account.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.name || account.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-48"
                    />
                  ) : (
                    account.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.type || account.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as Account["type"] })}
                    >
                      <option value="bank">Bank</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="loan">Loan</option>
                    </Select>
                  ) : (
                    <span className="capitalize">{account.type.replace("_", " ")}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.balance ?? account.balance}
                      onChange={(e) => setEditData({ ...editData, balance: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  ) : (
                    <span className={account.balance >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(account.balance, account.currency)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.currency || account.currency}
                      onChange={(e) => setEditData({ ...editData, currency: e.target.value })}
                    >
                      <option value="AED">AED</option>
                      <option value="USD">USD</option>
                    </Select>
                  ) : (
                    account.currency
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
                      <Button size="sm" variant="outline" onClick={() => startEdit(account)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(account.id)}>
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

