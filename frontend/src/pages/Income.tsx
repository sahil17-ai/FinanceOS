import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { toast } from "sonner"
import { useFinance } from "@/context/FinanceContext"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowUpRight } from "lucide-react"

export default function Income() {
  const { addIncome } = useFinance();
  const [sources, setSources] = useState<{name: string, amount: number}[]>(() => {
    const saved = localStorage.getItem('fin_income_sources');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fin_income_sources', JSON.stringify(sources));
  }, [sources]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    const amt = Number(amount);
    if(name && amt > 0) {
      setSources([...sources, {name, amount: amt}]);
      addIncome(amt);
      setOpen(false);
      setName("");
      setAmount("");
      toast.success("Income source added! Dashboard balance updated.");
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Income Sources</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Income</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Income Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Source Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Monthly Salary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Amount</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 5000" />
              </div>
              <Button onClick={handleSave} className="w-full">Save Income</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {sources.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                No income sources added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-full"><ArrowUpRight className="h-4 w-4" /></div>
                      <span className="font-semibold">{s.name}</span>
                    </div>
                    <span className="font-bold text-green-500 text-lg">+₹{s.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
