import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { ArrowDownRight, ArrowUpRight, AlertCircle, ShieldCheck, Wallet, TrendingUp, Sparkles } from "lucide-react"
import { useFinance } from "@/context/FinanceContext"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"

const EXPENSE_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const mockGrowthData = [
  { name: 'Jan', value: 120000 },
  { name: 'Feb', value: 135000 },
  { name: 'Mar', value: 130000 },
  { name: 'Apr', value: 155000 },
  { name: 'May', value: 170000 },
  { name: 'Jun', value: 185000 },
]

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
  
  // Categorize expenses for pie chart
  const expenseCategories: Record<string, number> = {
    Food: 0,
    Travel: 0,
    Bills: 0,
    Other: 0
  };

  transactions.forEach((t: any) => {
    if(t.type === 'expense') {
      const tDate = new Date(t.date);
      if(tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        monthlyExpenses += t.amount;
        // Mock category logic for now
        const cat = t.category || 'Other';
        if(expenseCategories[cat] !== undefined) {
          expenseCategories[cat] += t.amount;
        } else {
          expenseCategories['Other'] += t.amount;
        }
      }
      if(tDate >= sevenDaysAgo) {
        weeklyExpenses += t.amount;
      }
    }
  });

  const pieData = Object.entries(expenseCategories).filter(([_, val]) => val > 0).map(([name, value]) => ({ name, value }));
  if (pieData.length === 0) {
    pieData.push({ name: 'No Data', value: 1 })
  }

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
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 perspective-1000">
        {/* Current Balance */}
        <Card className="glass-card hover:border-primary/50 transform transition-all hover:scale-105 hover:rotate-y-2 duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Wallet className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.balance.toLocaleString()}</div>
            <p className="text-xs text-green-500 font-medium flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1"/> +20.1% from last month</p>
          </CardContent>
        </Card>

        {/* Safe To Spend */}
        <Card className="glass-card hover:border-primary/50 transform transition-all hover:scale-105 hover:-rotate-y-2 duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe To Spend</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors"><ShieldCheck className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.safeToSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">After upcoming obligations</p>
          </CardContent>
        </Card>

        {/* AI Insight Card */}
        <Card className="col-span-1 md:col-span-2 glass-card bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 transform transition-all hover:scale-[1.02] duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4"/> AI Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mt-1">You've saved 15% more this week compared to last week! Keep it up. Your SIPs are on track for wealth compounding.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Portfolio Growth Chart */}
        <Card className="col-span-4 glass-card shadow-lg">
          <CardHeader>
            <CardTitle>Net Worth Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockGrowthData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Pie Chart */}
        <Card className="col-span-3 glass-card shadow-lg">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2 text-xs font-medium flex-wrap justify-center">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
