"use client"

import { useState } from "react"
import { Asset } from "@/src/types/networth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AddAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => void
}

export function AddAssetDialog({ open, onOpenChange, onAdd }: AddAssetDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<Asset["type"]>("house")
  const [value, setValue] = useState("")
  const [currency, setCurrency] = useState("AED")
  const [description, setDescription] = useState("")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      name,
      type,
      value: parseFloat(value) || 0,
      currency,
      description: description || undefined,
    })
    setName("")
    setValue("")
    setType("house")
    setCurrency("AED")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Asset</CardTitle>
          <CardDescription>Add a new asset to your net worth</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Apartment in Dubai Marina"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Asset["type"])}
              >
                <option value="house">House</option>
                <option value="vehicle">Vehicle</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Value (AED)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

