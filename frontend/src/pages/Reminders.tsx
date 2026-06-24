import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Bell, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function Reminders() {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('fin_reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem('fin_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    // Check for due reminders today
    const today = new Date().toISOString().split('T')[0];
    const dueToday = reminders.filter((r: any) => r.date === today && !r.paid);
    if (dueToday.length > 0) {
      dueToday.forEach((r: any) => {
        toast.warning(`Reminder: ${r.title} (₹${r.amount}) is due today!`);
      });
    }
  }, []);

  const handleSave = () => {
    if (title && amount && date) {
      setReminders([...reminders, { id: Date.now(), title, amount: Number(amount), date, paid: false }]);
      setOpen(false);
      setTitle(""); setAmount(""); setDate("");
      toast.success("Reminder added!");
    }
  };

  const markPaid = (id: number) => {
    setReminders(reminders.map((r: any) => r.id === id ? { ...r, paid: true } : r));
    toast.success("Marked as paid!");
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter((r: any) => r.id !== id));
  };

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-purple-500" /> Bill Reminders
          </h1>
          <p className="text-muted-foreground mt-1">Never miss a payment again</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl bg-purple-600 hover:bg-purple-500 text-white rounded-full"><Plus className="h-4 w-4 mr-2"/> Add Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bill Name (e.g., Electricity)</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Amount (₹)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <input value={date} onChange={e => setDate(e.target.value)} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-500 text-white">Save Reminder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reminders.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p>No reminders set. Add your upcoming bills here!</p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((r: any) => {
            const isOverdue = new Date(r.date) < new Date(new Date().toDateString()) && !r.paid;
            return (
            <Card key={r.id} className={`shadow-sm transition-all ${r.paid ? 'opacity-60 grayscale' : ''} ${isOverdue ? 'border-destructive/50 bg-destructive/5' : ''}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isOverdue ? 'bg-destructive/20 text-destructive' : 'bg-purple-500/20 text-purple-500'}`}>
                    <Bell className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${r.paid ? 'line-through text-muted-foreground' : ''}`}>{r.title}</h3>
                    <p className={`text-sm ${isOverdue ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      Due: {new Date(r.date).toLocaleDateString()} {isOverdue && '(OVERDUE)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-xl font-bold">₹{r.amount}</div>
                  {!r.paid && (
                    <Button variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10" onClick={() => markPaid(r.id)}>
                      Mark Paid
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-destructive opacity-50 hover:opacity-100" onClick={() => deleteReminder(r.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )})
        )}
      </div>
    </AnimatedPage>
  )
}
