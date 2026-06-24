import { NavLink } from "react-router-dom"
import { Home, List, PlusCircle, TrendingUp, User } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  { name: "Add", href: "/add", icon: PlusCircle },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "Profile", href: "/settings", icon: User },
]

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex justify-around items-center px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </div>
  )
}
