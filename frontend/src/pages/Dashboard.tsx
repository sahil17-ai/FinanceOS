import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { ArrowDownRight, ArrowUpRight, AlertCircle, ShieldCheck, Wallet, TrendingUp } from "lucide-react"
import { useFinance } from "@/context/FinanceContext"

export default function Dashboard() {
  const { currentBalance, totalIncome, totalExpenses, totalInvestments } = useFinance();

  const savedTx = localStorage.getItem('fin_transactions');
  const transactions = savedTx ? JSON.parse(savedTx) : [];
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  let weeklyExpenses = 0;
  let monthlyExpenses = 0;

  transactions.forEach((t: any) => {
    if(t.type === 'expense') {
      const tDate = new Date(t.date);
      if(tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        monthlyExpenses += t.amount;
      }
      if(tDate >= sevenDaysAgo) {
        weeklyExpenses += t.amount;
      }
    }
  });

  const data = {
    balance: currentBalance,
    safeToSpend: currentBalance > 10000 ? currentBalance - 10000 : 0,
    safeToInvest: currentBalance > 20000 ? currentBalance - 20000 : 0,
    upcomingEMI: 10000,
    income: totalIncome,
    expenses: totalExpenses, // Global total
    weeklyExpenses,
    monthlyExpenses,
    investments: totalInvestments,
    savings: totalIncome - monthlyExpenses - totalInvestments,
    emergencyTarget: 500000,
    emergencyCurrent: 0,
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Balance */}
        <Card className="bg-gradient-to-br from-background to-secondary/10 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary"><Wallet className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.balance.toLocaleString()}</div>
            <p className="text-xs text-green-500 font-medium flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1"/> +20.1% from last month</p>
          </CardContent>
        </Card>

        {/* Safe To Spend */}
        <Card className="bg-gradient-to-br from-background to-secondary/10 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe To Spend</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full text-green-500"><ShieldCheck className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.safeToSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">After upcoming obligations</p>
          </CardContent>
        </Card>

        {/* Safe To Invest */}
        <Card className="bg-gradient-to-br from-background to-secondary/10 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe To Invest</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><TrendingUp className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.safeToInvest.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available surplus</p>
          </CardContent>
        </Card>

        {/* Upcoming Deductions */}
        <Card className="bg-gradient-to-br from-background to-secondary/10 hover:border-primary/50 transition-colors border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Deduction</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-full text-destructive"><AlertCircle className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.upcomingEMI.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">29 Jul Education EMI</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Cashflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><ArrowUpRight className="h-5 w-5" /></div>
                  <span className="font-semibold">Total Income</span>
                </div>
                <span className="font-bold text-lg text-green-500">₹{data.income.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/20 text-destructive rounded-lg"><ArrowDownRight className="h-5 w-5" /></div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Monthly Expenses</span>
                    <span className="text-xs text-muted-foreground font-medium">Weekly: ₹{data.weeklyExpenses.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-lg text-foreground">₹{data.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
                  <span className="font-semibold">Investments (SIPs)</span>
                </div>
                <span className="font-bold text-lg text-foreground">₹{data.investments.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-border bg-primary/5 rounded-b-lg">
                <span className="font-bold text-lg">Net Savings</span>
                <span className="font-black text-2xl text-primary">₹{data.savings.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={200} />
          </div>
          <CardHeader>
            <CardTitle>Emergency Fund</CardTitle>
            <CardDescription>Target: ₹{data.emergencyTarget.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="text-4xl font-black text-primary">₹{data.emergencyCurrent.toLocaleString()}</div>
                <div className="text-sm font-bold bg-primary text-primary-foreground px-2 py-1 rounded-md">
                  {((data.emergencyCurrent / data.emergencyTarget) * 100).toFixed(0)}%
                </div>
              </div>
              <Progress value={(data.emergencyCurrent / data.emergencyTarget) * 100} className="h-3" />
            </div>
            <p className="text-sm text-muted-foreground pt-4 border-t border-border">
              Keep building this up! Aim for 6 months of living expenses.
            </p>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
