"use client"

import { Sidebar } from "@/components/sidebar"
import { Package, TrendingUp, DollarSign, Shirt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Dashboard() {
  const totalProducts = 50
  const totalVariants = 187
  const averagePrice = 35
  const numCategories = 5

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Total Variants",
      value: totalVariants,
      icon: Shirt,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      label: "Avg. Base Price",
      value: `$${averagePrice}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      label: "Categories",
      value: `${numCategories}`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-8">
        <header className="mb-8 animate-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your inventory status.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-2 border-none shadow-lg shadow-black/5">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-50 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                Analytics Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
