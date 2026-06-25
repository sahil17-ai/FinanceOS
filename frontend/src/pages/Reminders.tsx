import { Card, CardContent } from "@/components/ui/card"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Bell, Calendar, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

interface Reminder {
  id: string;
  title: string;
  amount: number;
  date: number; // day of month
  type: 'SIP' | 'EMI' | 'Bill';
  status: 'upcoming' | 'due-soon' | 'paid';
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await api.get('/investments/')
        const investments = res.data

        const today = new Date().getDate()
        const fetchedReminders: Reminder[] = []

        investments.forEach((inv: any) => {
          if (inv.type === 'SIP' && inv.sip_date) {
            let status: Reminder['status'] = 'upcoming';
            const diff = inv.sip_date - today;
            
            if (diff >= 0 && diff <= 3) status = 'due-soon';
            else if (diff < 0) status = 'paid';

            fetchedReminders.push({
              id: `sip-${inv.id}`,
              title: `${inv.name} SIP`,
              amount: inv.invested_amount,
              date: inv.sip_date,
              type: 'SIP',
              status
            })
          }
        })

        // Add some dummy bills to demonstrate UI
        fetchedReminders.push({
          id: 'mock-cc',
          title: 'HDFC Credit Card',
          amount: 15420,
          date: today + 2,
          type: 'Bill',
          status: 'due-soon'
        })
        
        fetchedReminders.push({
          id: 'mock-loan',
          title: 'Education Loan EMI',
          amount: 8500,
          date: 5,
          type: 'EMI',
          status: today > 5 ? 'paid' : 'upcoming'
        })

        fetchedReminders.sort((a, b) => {
          // Sort by date, but keep upcoming/due-soon first
          if (a.status === 'paid' && b.status !== 'paid') return 1;
          if (b.status === 'paid' && a.status !== 'paid') return -1;
          return a.date - b.date;
        })

        setReminders(fetchedReminders)
      } catch (e) {
        toast.error("Failed to fetch reminders")
      } finally {
        setLoading(false)
      }
    }

    fetchReminders()
  }, [])

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Reminders</h1>
          <p className="text-muted-foreground mt-1">Don't miss your SIPs and Bill payments</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Bell className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <Card className="glass-card text-center p-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold">All caught up!</h3>
            <p className="text-muted-foreground">No upcoming payments.</p>
          </Card>
        ) : (
          reminders.map((rem) => {
            const isDueSoon = rem.status === 'due-soon'
            const isPaid = rem.status === 'paid'
            
            return (
              <Card 
                key={rem.id} 
                className={`glass-card transition-all hover:scale-[1.01] ${
                  isDueSoon ? 'border-l-4 border-l-destructive shadow-destructive/10' : 
                  isPaid ? 'opacity-60 grayscale-[50%]' : ''
                }`}
              >
                <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl flex items-center justify-center font-bold text-lg w-12 h-12 ${
                      isDueSoon ? 'bg-destructive/20 text-destructive' : 
                      isPaid ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                    }`}>
                      {rem.date}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {rem.title}
                        {isDueSoon && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 
                        {isPaid ? 'Paid this month' : `Due on ${rem.date}th`} • {rem.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">₹{rem.amount.toLocaleString()}</div>
                    {!isPaid && (
                      <button className="text-xs text-primary font-medium hover:underline flex items-center justify-end gap-1 mt-1">
                        Pay Now <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </AnimatedPage>
  )
}
