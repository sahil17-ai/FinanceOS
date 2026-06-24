import { Bell, Search, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function Header() {
  const { logout } = useAuth();
  
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center md:hidden">
        <span className="text-lg font-bold text-primary">FinanceOS</span>
      </div>
      
      <div className="hidden md:flex flex-1 items-center space-x-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search transactions..."
            className="w-full bg-background rounded-md border border-input pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium border border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  )
}
