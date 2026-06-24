import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

import { useState, useEffect } from "react"
const investmentData = [
  { month: 'Jan', value: 1000 },
  { month: 'Feb', value: 2500 },
  { month: 'Mar', value: 4000 },
  { month: 'Apr', value: 5500 },
  { month: 'May', value: 7000 },
  { month: 'Jun', value: 8500 },
  { month: 'Jul', value: 10000 },
];

const portfolioData = [
  { name: 'Equity (Stocks)', value: 100 },
  { name: 'Crypto', value: 100 },
  { name: 'Mutual Funds (SIP)', value: 1500 },
];
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

export default function Analytics() {
  const [spendingData, setSpendingData] = useState<any[]>([])
  const [weekly, setWeekly] = useState(0)
  const [monthly, setMonthly] = useState(0)

  useEffect(() => {
    const savedTx = localStorage.getItem('fin_transactions');
    const transactions = savedTx ? JSON.parse(savedTx) : [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    let wExp = 0;
    let mExp = 0;
    const catMap: any = {};

    transactions.forEach((t: any) => {
      if(t.type === 'expense') {
        const tDate = new Date(t.date);
        if(tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
          mExp += t.amount;
        }
        if(tDate >= sevenDaysAgo) {
          wExp += t.amount;
        }
        catMap[t.cat] = (catMap[t.cat] || 0) + t.amount;
      }
    });

    setWeekly(wExp);
    setMonthly(mExp);

    const sData = Object.keys(catMap).map(k => ({ name: k, amount: catMap[k] }));
    setSpendingData(sData);
  }, []);

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your financial data</p>
        </div>
      </div>

      {/* Top Level Expense Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-background to-destructive/10 border-destructive/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive font-bold uppercase tracking-wider">Weekly Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">₹{weekly.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Spent in the last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-orange-500/10 border-orange-500/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-500 font-bold uppercase tracking-wider">Monthly Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">₹{monthly.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total spent this calendar month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Category Breakdown */}
        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution of your investments</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {portfolioData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 w-full justify-center flex-wrap">
              {portfolioData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wealth Growth Over Time */}
        <Card className="md:col-span-2 shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Wealth Growth</CardTitle>
            <CardDescription>Your investment portfolio performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
