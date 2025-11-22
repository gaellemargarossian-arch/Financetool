"use client"

import { useState } from "react"
import { useNetWorth } from "@/hooks/useNetWorth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/formatCurrency"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { EditableAssetTable } from "@/components/EditableAssetTable"
import { EditableLoanTable } from "@/components/EditableLoanTable"
import { EditableInvestmentTable } from "@/components/EditableInvestmentTable"
import { AddAssetDialog } from "@/components/AddAssetDialog"
import { AddLoanDialog } from "@/components/AddLoanDialog"
import { AddInvestmentDialog } from "@/components/AddInvestmentDialog"

export default function NetWorthPage() {
  const {
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
  } = useNetWorth()

  const [activeTab, setActiveTab] = useState("overview")
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false)
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false)
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Net Worth</h1>
          <p className="text-muted-foreground">Track your assets, loans, and investments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets, "AED")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLoans, "AED")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalInvestments, "AED")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(netWorth, "AED")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Assets</CardTitle>
                  <Button size="sm" onClick={() => setIsAssetDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets, "AED")}</div>
                    <div className="text-sm text-gray-600">{assets.length} assets</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Loans</CardTitle>
                  <Button size="sm" onClick={() => setIsLoanDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLoans, "AED")}</div>
                    <div className="text-sm text-gray-600">{loans.length} loans</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Investments</CardTitle>
                  <Button size="sm" onClick={() => setIsInvestmentDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalInvestments, "AED")}</div>
                    <div className="text-sm text-gray-600">{investments.length} investments</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assets</CardTitle>
                <Button onClick={() => setIsAssetDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </CardHeader>
              <CardContent>
                <EditableAssetTable
                  assets={assets}
                  onUpdate={updateAsset}
                  onDelete={deleteAsset}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Loans</CardTitle>
                <Button onClick={() => setIsLoanDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Loan
                </Button>
              </CardHeader>
              <CardContent>
                <EditableLoanTable
                  loans={loans}
                  onUpdate={updateLoan}
                  onDelete={deleteLoan}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Investments</CardTitle>
                <Button onClick={() => setIsInvestmentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </CardHeader>
              <CardContent>
                <EditableInvestmentTable
                  investments={investments}
                  onUpdate={updateInvestment}
                  onDelete={deleteInvestment}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddAssetDialog
          open={isAssetDialogOpen}
          onOpenChange={setIsAssetDialogOpen}
          onAdd={addAsset}
        />
        <AddLoanDialog
          open={isLoanDialogOpen}
          onOpenChange={setIsLoanDialogOpen}
          onAdd={addLoan}
        />
        <AddInvestmentDialog
          open={isInvestmentDialogOpen}
          onOpenChange={setIsInvestmentDialogOpen}
          onAdd={addInvestment}
        />
      </div>
    </main>
  )
}

