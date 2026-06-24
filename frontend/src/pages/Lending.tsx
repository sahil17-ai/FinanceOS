import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { Users, RefreshCw, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Lending() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('fin_lending');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Alice", lent: 5000, recovered: 2000 },
      { id: 2, name: "Bob", lent: 1500, recovered: 1500 }, // Should auto-delete logic test
    ].filter((r: any) => r.lent - r.recovered > 0);
  });

  useEffect(() => {
    localStorage.setItem('fin_lending', JSON.stringify(records));
  }, [records]);

  const [openAdd, setOpenAdd] = useState(false)
  const [openRefund, setOpenRefund] = useState<{id: number, name: string} | null>(null)
  const [openEdit, setOpenEdit] = useState<{id: number, name: string, lent: number} | null>(null)
  
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [editName, setEditName] = useState("")
  const [editLent, setEditLent] = useState("")

  const totalLent = records.reduce((acc: number, curr: any) => acc + curr.lent, 0)
  const totalRecovered = records.reduce((acc: number, curr: any) => acc + curr.recovered, 0)
  const pendingBalance = totalLent - totalRecovered

  const handleAdd = () => {
    const amt = Number(amount)
    if(name && amt > 0) {
      setRecords([...records, { id: Date.now(), name, lent: amt, recovered: 0 }])
      setOpenAdd(false)
      setName("")
      setAmount("")
      toast.success("Lending record created!")
    }
  }

  const handleDelete = (id: number) => {
    setRecords(records.filter((r: any) => r.id !== id))
    toast.success("Record deleted!")
  }

  const handleEdit = () => {
    if(openEdit) {
      setRecords(records.map((r: any) => r.id === openEdit.id ? { ...r, name: editName, lent: Number(editLent) } : r))
      setOpenEdit(null)
      toast.success("Record updated!")
    }
  }

  const handleRefund = () => {
    const amt = Number(refundAmount)
    if(openRefund && amt > 0) {
      const updated = records.map((r: any) => {
        if(r.id === openRefund.id) {
          return { ...r, recovered: r.recovered + amt }
        }
        return r
      })
      
      // Auto-delete logic
      const filtered = updated.filter((r: any) => (r.lent - r.recovered) > 0)
      
      if(filtered.length < updated.length) {
        toast.success("Refund logged! Balance hit 0, record auto-deleted.")
      } else {
        toast.success("Refund logged successfully!")
      }
      
      setRecords(filtered)
      setOpenRefund(null)
      setRefundAmount("")
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Lending</h1>
          <p className="text-muted-foreground mt-1">Track money given to friends and family</p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">+ Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Lent (₹)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 5000" />
              </div>
              <Button onClick={handleAdd} className="w-full mt-2">Save Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{totalLent.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recovered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">₹{totalRecovered.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive shadow-lg hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">₹{pendingBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">Records will auto-delete when balance hits 0</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5" /> Active Records</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {records.map((record: any) => (
            <Card key={record.id} className="group shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                      {record.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{record.name}</h4>
                      <p className="text-sm text-muted-foreground">Lent: ₹{record.lent} • Recovered: ₹{record.recovered}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditName(record.name); setEditLent(record.lent.toString()); setOpenEdit(record);
                    }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className="font-bold text-xl text-destructive">₹{record.lent - record.recovered}</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary" onClick={() => setOpenRefund(record)}>
                    <RefreshCw className="h-4 w-4" /> Log Refund
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit !== null} onOpenChange={(open) => !open && setOpenEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Record</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Lent (₹)</label>
              <input value={editLent} onChange={e => setEditLent(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button onClick={handleEdit} className="w-full mt-2">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={openRefund !== null} onOpenChange={(open) => !open && setOpenRefund(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Refund for {openRefund?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Refund Amount (₹)</label>
              <input value={refundAmount} onChange={e => setRefundAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 1000" />
            </div>
            <p className="text-xs text-muted-foreground">Remaining balance: ₹{openRefund ? (records.find((r: any)=>r.id===openRefund.id)?.lent || 0) - (records.find((r: any)=>r.id===openRefund.id)?.recovered || 0) : 0}</p>
            <Button onClick={handleRefund} className="w-full mt-2">Submit Refund</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
