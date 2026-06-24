import { NavLink } from "react-router-dom"
import { Home, List, PlusCircle, TrendingUp, Users, Target, BarChart2, Calendar, Settings } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  { name: "Income", href: "/income", icon: PlusCircle },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "Lending", href: "/lending", icon: Users },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-primary">FinanceOS</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
