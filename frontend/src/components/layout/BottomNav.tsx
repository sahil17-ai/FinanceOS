import { NavLink, useNavigate } from "react-router-dom"
import { Home, List, PlusCircle, TrendingUp, User, Bell, ArrowRightLeft, Target } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  { name: "Add", href: "#", icon: PlusCircle },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Profile", href: "/settings", icon: User },
]

export default function BottomNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => (
          item.name === "Add" ? (
            <button
              key={item.name}
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-primary hover:scale-110 transition-transform relative -top-3"
            >
              <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg shadow-primary/50">
                <item.icon className="h-6 w-6" />
              </div>
            </button>
          ) : (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          )
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Quick Add</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all hover:scale-105"
              onClick={() => { setOpen(false); navigate('/transactions'); }}
            >
              <ArrowRightLeft className="h-8 w-8 text-blue-400" />
              <span>Transaction</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all hover:scale-105"
              onClick={() => { setOpen(false); navigate('/investments'); }}
            >
              <TrendingUp className="h-8 w-8 text-green-400" />
              <span>Asset/SIP</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all hover:scale-105"
              onClick={() => { setOpen(false); navigate('/goals'); }}
            >
              <Target className="h-8 w-8 text-purple-400" />
              <span>Goal</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
