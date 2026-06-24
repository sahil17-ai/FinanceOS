import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useFinance } from "@/context/FinanceContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Transactions() {
  const { addExpense, addIncome } = useFinance();
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 1, desc: "Grocery Shopping", cat: "Food", amount: 1200, date: "15 Jul 2026", type: 'expense' },
      { id: 2, desc: "Goa Trip Tickets", cat: "Travel", amount: 4500, date: "13 Jul 2026", type: 'expense' },
    ]
  });

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);
  const [categories] = useState(() => {
    const saved = localStorage.getItem('fin_categories');
    return saved ? JSON.parse(saved) : ["Family", "Friend", "Emergency", "Travel", "Food", "Custom"]
  });

  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [cat, setCat] = useState("Food")
  const [type, setType] = useState("expense")

  const handleSave = () => {
    const amt = Number(amount);
    if(desc && amt > 0) {
      setTransactions([{
        id: Date.now(),
        desc, cat, amount: amt, type,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})
      }, ...transactions])
      if(type === 'expense') addExpense(amt);
      else addIncome(amt);
      setOpen(false)
      setDesc("")
      setAmount("")
      toast.success("Transaction added & Dashboard synced!")
    }
  }

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t: any) => t.id !== id))
    toast.success("Transaction deleted")
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage your daily expenses and income</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl">+ Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input value={desc} onChange={e => setDesc(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Swiggy Order" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (₹)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select value={cat} onChange={e => setCat(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <Button onClick={handleSave} className="w-full mt-2">Save Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent History</CardTitle>
          <div className="flex gap-2">
            <select className="flex h-9 w-[130px] rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option>All Categories</option>
              {categories.map((c: string) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((t: any) => (
              <div key={t.id} className="group flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                    {t.type === 'income' ? <ArrowUpRight className="h-5 w-5"/> : <ArrowDownRight className="h-5 w-5"/>}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.desc}</span>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground font-medium rounded-md">{t.cat}</span>
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-lg ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount}
                  </span>
                  <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
