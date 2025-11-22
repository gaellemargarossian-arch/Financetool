"use client"

import { useState } from "react"
import { Asset } from "@/src/types/networth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatCurrency"
import { Save, X } from "lucide-react"

interface EditableAssetTableProps {
  assets: Asset[]
  onUpdate: (id: string, asset: Partial<Asset>) => void
  onDelete: (id: string) => void
}

export function EditableAssetTable({ assets, onUpdate, onDelete }: EditableAssetTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Asset>>({})

  const startEdit = (asset: Asset) => {
    setEditingId(asset.id)
    setEditData({
      name: asset.name,
      type: asset.type,
      value: asset.value,
      currency: asset.currency,
      description: asset.description,
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
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const isEditing = editingId === asset.id

            return (
              <TableRow key={asset.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.name || asset.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-48"
                    />
                  ) : (
                    asset.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.type || asset.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as Asset["type"] })}
                    >
                      <option value="house">House</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="investment">Investment</option>
                      <option value="other">Other</option>
                    </Select>
                  ) : (
                    <span className="capitalize">{asset.type}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.value ?? asset.value}
                      onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                  ) : (
                    formatCurrency(asset.value, asset.currency)
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
                      <Button size="sm" variant="outline" onClick={() => startEdit(asset)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(asset.id)}>
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

