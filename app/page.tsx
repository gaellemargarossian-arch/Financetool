import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Budget App
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            AI-powered personal finance tool
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                View your financial overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Dashboard</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Manage your expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">View Transactions</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
              <CardDescription>
                Set and track budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Manage Budgets</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with Next.js 14, Tailwind CSS, and shadcn UI
          </p>
        </div>
      </div>
    </main>
  )
}

