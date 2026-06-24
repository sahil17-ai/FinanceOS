import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Target, TrendingUp, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFinance } from "@/context/FinanceContext"

export default function Goals() {
  const { currentBalance, setBalance } = useFinance();
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fin_goals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "House Fund", target: 1000000, current: 15000, linkedSip: "ICICI Prudential Liquid Fund", sipAmount: 500 }
    ]
  });

  useEffect(() => {
    localStorage.setItem('fin_goals', JSON.stringify(goals));
  }, [goals]);

  const [open, setOpen] = useState(false)
  const [openExtra, setOpenExtra] = useState<number | null>(null)
  const [extraAmount, setExtraAmount] = useState("")
  const [name, setName] = useState("")
  const [target, setTarget] = useState("")

  const handleSave = () => {
    const targ = Number(target)
    if(name && targ > 0) {
      setGoals([...goals, {
        id: Date.now(), name, target: targ, current: 0, linkedSip: "None", sipAmount: 0
      }])
      setOpen(false)
      setName("")
      setTarget("")
      toast.success("New goal created!")
    }
  }

  const handleDelete = (id: number) => {
    setGoals(goals.filter((g: any) => g.id !== id))
    toast.success("Goal deleted!")
  }

  const handleAddExtra = () => {
    const amt = Number(extraAmount);
    if(openExtra && amt > 0) {
      if(amt > currentBalance) {
        toast.error("Insufficient Dashboard Balance!");
        return;
      }
      setGoals(goals.map((g: any) => g.id === openExtra ? { ...g, current: g.current + amt } : g));
      setBalance(currentBalance - amt);
      setOpenExtra(null);
      setExtraAmount("");
      toast.success("Extra money added to goal! Balance deducted.");
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Goals</h1>
          <p className="text-muted-foreground mt-1">Track your custom savings goals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">+ New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Dream Car" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount (₹)</label>
                <input value={target} onChange={e => setTarget(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 500000" />
              </div>
              <Button onClick={handleSave} className="w-full mt-2">Save Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal: any) => (
          <Card key={goal.id} className="relative overflow-hidden group shadow-lg hover:border-primary/50 transition-colors">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => handleDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Target size={150} />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{goal.name}</CardTitle>
              {goal.linkedSip !== "None" && (
                <p className="text-xs text-muted-foreground flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> Linked to {goal.linkedSip}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold text-primary">₹{goal.current.toLocaleString()}</div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Target</p>
                    <p className="font-bold">₹{goal.target.toLocaleString()}</p>
                  </div>
                </div>
                <div className="relative h-3 w-full bg-secondary overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full bg-primary/40 w-full" style={{ transform: `translateX(-${100 - (goal.current / goal.target) * 100}%)` }} />
                </div>
                <p className="text-xs text-right mt-1 font-medium">{((goal.current / goal.target) * 100).toFixed(1)}%</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-muted-foreground block text-sm">Monthly Contribution</span>
                  <span className="font-medium text-sm">{goal.sipAmount > 0 ? `₹${goal.sipAmount}/mo (Auto)` : 'Manual Only'}</span>
                </div>
                <Button onClick={() => setOpenExtra(goal.id)} variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4" /> Add Extra Money
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Extra Money Dialog */}
      <Dialog open={openExtra !== null} onOpenChange={(o) => !o && setOpenExtra(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Extra Money to Goal</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount to Add (₹)</label>
              <input value={extraAmount} onChange={e => setExtraAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 5000" />
            </div>
            <p className="text-xs text-muted-foreground">This amount will be deducted from your Dashboard Current Balance.</p>
            <Button onClick={handleAddExtra} className="w-full mt-2">Add Money</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
