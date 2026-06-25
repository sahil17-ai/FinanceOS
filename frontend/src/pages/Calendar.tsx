import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

interface CalendarEvent {
  id: number | string;
  name: string;
  date: number;
  desc: string;
  type: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const res = await api.get('/investments/')
        const investments = res.data

        const fetchedEvents: CalendarEvent[] = []
        
        // Add SIPs to calendar
        investments.forEach((inv: any) => {
          if (inv.type === 'SIP' && inv.sip_date) {
            fetchedEvents.push({
              id: `sip-${inv.id}`,
              name: inv.name,
              date: inv.sip_date,
              desc: `SIP Deduction • ₹${inv.invested_amount}`,
              type: 'investment'
            })
          }
        })

        // Add a mock Salary event for context until Income API is wired
        fetchedEvents.push({
          id: 'mock-salary',
          name: "Salary Credit",
          date: 1,
          desc: "Monthly Income",
          type: 'income'
        })

        // Sort by date ascending
        fetchedEvents.sort((a, b) => a.date - b.date)
        setEvents(fetchedEvents)
      } catch (err) {
        toast.error("Failed to load calendar events")
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarEvents()
  }, [])

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Upcoming financial events</p>
        </div>
      </div>

      <Card className="max-w-3xl shadow-lg border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary"/> Monthly Schedule</CardTitle>
          <CardDescription>Based on your SIPs and recurring transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8 text-muted-foreground">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {events.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active transform transition-all hover:scale-105 duration-300">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary/20">
                    {event.date}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg">{event.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium shadow-inner ${
                        event.type === 'income' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        event.type === 'expense' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {event.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.desc}</p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No events scheduled for this month.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
