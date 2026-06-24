import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { toast } from "sonner"
import { useFinance } from "@/context/FinanceContext"

export default function Settings() {
  const { currentBalance, setBalance } = useFinance();
  const [salary, setSalary] = useState(() => localStorage.getItem('fin_salary') || "100000")
  const [date, setDate] = useState(() => localStorage.getItem('fin_date') || "7")
  const [target, setTarget] = useState(() => localStorage.getItem('fin_target') || "500000")
  const [newCat, setNewCat] = useState("")
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fin_categories');
    return saved ? JSON.parse(saved) : ['Travel', 'Food', 'Family', 'Personal', 'Emergency', 'Investment']
  })
  const [balInput, setBalInput] = useState(currentBalance.toString())

  useEffect(() => {
    localStorage.setItem('fin_salary', salary);
    localStorage.setItem('fin_date', date);
    localStorage.setItem('fin_target', target);
    localStorage.setItem('fin_categories', JSON.stringify(categories));
  }, [salary, date, target, categories]);

  const handleSave = () => {
    setBalance(Number(balInput))
    toast.success("Settings and Balance saved successfully!")
  }

  const handleAddCategory = () => {
    if (newCat) {
      setCategories([...categories, newCat])
      setNewCat("")
      toast.success(`Category "${newCat}" added!`)
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your application preferences</p>
        </div>
        <Button onClick={handleSave} className="shadow-lg hover:shadow-xl transition-all">Save Changes</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Profile & Preferences</CardTitle>
            <CardDescription>Configure your base salary and currency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Currency Symbol</label>
              <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="₹" defaultValue="₹" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Monthly Salary Amount</label>
              <input value={salary} onChange={(e) => setSalary(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Salary Credit Date (Day of Month)</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} type="number" min="1" max="31" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-bold text-primary leading-none">Initial Current Balance</label>
              <p className="text-xs text-muted-foreground">This sets the dashboard balance globally.</p>
              <input value={balInput} onChange={(e) => setBalInput(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Emergency Fund Target</CardTitle>
            <CardDescription>Set your emergency reserve goal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Target Amount</label>
              <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Manage top-level categories. (No subcategories per rules)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat: string) => (
                <div key={cat} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
                  {cat}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="New Category" />
              <Button onClick={handleAddCategory}>+ Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Export your data or reset the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={() => {
                  const data = JSON.stringify(localStorage);
                  const blob = new Blob([data], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'financeos_backup.json';
                  a.click();
                  toast.success("Backup downloaded successfully!");
                }} 
                className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Export All Data (Backup)
              </Button>
              <Button 
                onClick={() => {
                  if(confirm("Are you sure you want to delete ALL data? This cannot be undone!")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }} 
                variant="destructive" 
                className="w-full md:w-1/2"
              >
                Factory Reset (Clear All Data)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
