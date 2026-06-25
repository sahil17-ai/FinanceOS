import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Target, Flag, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import api from "@/lib/api"

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // Form
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals/')
      setGoals(res.data)
    } catch (e) {
      toast.error("Failed to load goals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleSaveGoal = async () => {
    if (!name || !targetAmount) return;
    try {
      await api.post('/goals/', {
        name,
        target_amount: Number(targetAmount),
        current_amount: Number(currentAmount) || 0
      })
      toast.success("Goal created successfully!")
      setOpen(false)
      setName("")
      setTargetAmount("")
      setCurrentAmount("")
      fetchGoals()
    } catch (e) {
      toast.error("Failed to create goal")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/goals/${id}`)
      toast.success("Goal removed")
      fetchGoals()
    } catch (e) {
      toast.error("Failed to remove goal")
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Financial Goals</h1>
          <p className="text-muted-foreground mt-1">Track your progress towards big purchases</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:shadow-xl transition-all shadow-primary/20">+ Add Goal</Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" placeholder="e.g. New Car" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount (₹)</label>
                <input value={targetAmount} onChange={e => setTargetAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" placeholder="e.g. 500000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Already Saved (₹)</label>
                <input value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" placeholder="e.g. 50000" />
              </div>
              <Button onClick={handleSaveGoal} className="w-full mt-2">Save Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 flex justify-center p-8">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-2 text-center p-12 glass-card rounded-xl border border-white/5 border-dashed">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold">No Goals Yet</h3>
            <p className="text-muted-foreground mt-2 mb-6">Start saving for your dream home or vacation.</p>
            <Button onClick={() => setOpen(true)} variant="outline">Set a Goal</Button>
          </div>
        ) : (
          goals.map(goal => {
            const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
            return (
              <Card key={goal.id} className="glass-card relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flag size={150} />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{goal.name}</CardTitle>
                      <CardDescription>Target: ₹{goal.target_amount.toLocaleString()}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)} className="text-destructive hover:bg-destructive/10">Delete</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-3xl font-black text-primary">₹{goal.current_amount.toLocaleString()}</div>
                    <div className="text-sm font-bold bg-primary/20 text-primary px-2 py-1 rounded-md border border-primary/20">
                      {percent.toFixed(0)}%
                    </div>
                  </div>
                  <Progress value={percent} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    ₹{(goal.target_amount - goal.current_amount).toLocaleString()} left to reach your goal.
                  </p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </AnimatedPage>
  )
}
