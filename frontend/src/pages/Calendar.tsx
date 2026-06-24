import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Calendar as CalendarIcon } from "lucide-react"

export default function Calendar() {
  const events = [
    { id: 1, name: "Salary Credit", date: "7th", desc: "Monthly Income", type: 'income' },
    { id: 2, name: "ICICI Liquid Fund", date: "10th", desc: "SIP 2 • ₹500", type: 'investment' },
    { id: 3, name: "SBI Multicap Fund", date: "12th", desc: "SIP 1 • ₹1000", type: 'investment' },
    { id: 4, name: "Education Loan EMI", date: "29th", desc: "Recurring Deduction", type: 'expense' },
  ]

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Upcoming financial events</p>
        </div>
      </div>

      <Card className="max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Monthly Schedule</CardTitle>
          <CardDescription>Based on your SIP, EMI, and Salary settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {events.sort((a, b) => parseInt(a.date) - parseInt(b.date)).map((event) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  {parseInt(event.date)}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{event.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      event.type === 'income' ? 'bg-green-500/10 text-green-500' :
                      event.type === 'expense' ? 'bg-destructive/10 text-destructive' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
