import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { TrendingUp, Wallet, Activity } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from "axios"

export default function Investments() {
  const [open, setOpen] = useState(false)
  const [assetName, setAssetName] = useState("")
  const [assetUnits, setAssetUnits] = useState("")
  const [assetPrice, setAssetPrice] = useState("")
  
  const sbiSip = { name: "SBI Multicap Fund Regular Growth", type: "SIP", amount: 1000, date: 12, value: 1050 }
  const iciciSip = { name: "ICICI Prudential Liquid Fund", type: "SIP", amount: 500, date: 10, value: 500 }
  
  const [gtl, setGtl] = useState({ name: "GTL Infrastructure", type: "Stock", avgPrice: 1.60, currentPrice: 1.60, units: 57, loading: true })
  const [kaspa, setKaspa] = useState({ name: "Kaspa Coin", type: "Crypto", avgPrice: 3.17, currentPrice: 3.17, units: 31.5, loading: true })

  useEffect(() => {
    // Fetch live prices from our new yfinance backend endpoint
    const fetchLivePrices = async () => {
      try {
        const gtlRes = await axios.get("/api/finance/live-price/GTLINFRA.NS")
        setGtl(prev => ({ ...prev, currentPrice: gtlRes.data.price, loading: false }))
      } catch (e) {
        console.error("Failed to fetch GTL", e)
        setGtl(prev => ({ ...prev, loading: false })) // Fallback to avg
      }

      try {
        const kaspaRes = await axios.get("/api/finance/live-price/KAS-USD")
        setKaspa(prev => ({ ...prev, currentPrice: kaspaRes.data.price, loading: false }))
      } catch (e) {
        console.error("Failed to fetch Kaspa", e)
        setKaspa(prev => ({ ...prev, loading: false }))
      }
    }
    fetchLivePrices()
  }, [])

  const calculateStockValue = (stock: any) => stock.currentPrice * stock.units;
  const calculateStockInvested = (stock: any) => stock.avgPrice * stock.units;
  const calculatePL = (invested: number, current: number) => current - invested;

  const totalInvested = sbiSip.amount + iciciSip.amount + calculateStockInvested(gtl) + calculateStockInvested(kaspa);
  const totalValue = sbiSip.value + iciciSip.value + calculateStockValue(gtl) + calculateStockValue(kaspa);
  const totalPL = totalValue - totalInvested;

  const handleSaveAsset = () => {
    if(assetName && assetUnits && assetPrice) {
      toast.success(`${assetName} added to portfolio!`)
      setOpen(false)
      setAssetName("")
      setAssetUnits("")
      setAssetPrice("")
    }
  }

  return (
    <AnimatedPage className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Track your SIPs and live market positions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">+ Add Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Name/Symbol</label>
                <input value={assetName} onChange={e => setAssetName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. AAPL" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Units/Shares</label>
                <input value={assetUnits} onChange={e => setAssetUnits(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Avg Buy Price (₹)</label>
                <input value={assetPrice} onChange={e => setAssetPrice(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 150" />
              </div>
              <Button onClick={handleSaveAsset} className="w-full mt-2">Save Asset</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-background to-secondary/20 border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalInvested.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Live Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              ₹{totalValue.toFixed(2)}
              {gtl.loading && kaspa.loading && <Activity className="h-4 w-4 animate-pulse text-muted-foreground" />}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <TrendingUp size={100} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Unrealized P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPL >= 0 ? '+' : ''}₹{totalPL.toFixed(2)}
            </div>
            <p className="text-sm mt-1 text-muted-foreground">
              {((totalPL / totalInvested) * 100).toFixed(2)}% Returns
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* SIP Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Wallet className="h-5 w-5"/> Active SIPs</h2>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{sbiSip.name}</CardTitle>
                  <CardDescription>Deducts on {sbiSip.date}th monthly</CardDescription>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">₹{sbiSip.amount}/mo</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invested: ₹{sbiSip.amount}</span>
                <span className="font-medium text-green-500">Value: ₹{sbiSip.value}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{iciciSip.name}</CardTitle>
                  <CardDescription>Deducts on {iciciSip.date}th monthly • Goal Linked</CardDescription>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">₹{iciciSip.amount}/mo</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Invested: ₹{iciciSip.amount}</span>
                <span className="font-medium">Value: ₹{iciciSip.value}</span>
              </div>
              <Button onClick={() => toast.success("Redemption request submitted successfully!")} variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">Redeem Funds</Button>
            </CardContent>
          </Card>
        </div>

        {/* Equities Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Live Stocks & Crypto</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {gtl.name}
                    {gtl.loading && <span className="text-xs bg-secondary px-2 rounded animate-pulse">Syncing...</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{gtl.units} shares</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">₹{gtl.currentPrice.toFixed(2)}</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${gtl.currentPrice >= gtl.avgPrice ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="h-3 w-3" />
                    {gtl.currentPrice >= gtl.avgPrice ? '+' : ''}{((gtl.currentPrice - gtl.avgPrice) / gtl.avgPrice * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-4">
                <span className="text-muted-foreground">Avg Price: ₹{gtl.avgPrice.toFixed(2)}</span>
                <span className={`font-bold ${calculatePL(calculateStockInvested(gtl), calculateStockValue(gtl)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  P&L: ₹{calculatePL(calculateStockInvested(gtl), calculateStockValue(gtl)).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {kaspa.name}
                    {kaspa.loading && <span className="text-xs bg-secondary px-2 rounded animate-pulse">Syncing...</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{kaspa.units} coins</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">₹{kaspa.currentPrice.toFixed(2)}</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${kaspa.currentPrice >= kaspa.avgPrice ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="h-3 w-3" />
                    {kaspa.currentPrice >= kaspa.avgPrice ? '+' : ''}{((kaspa.currentPrice - kaspa.avgPrice) / kaspa.avgPrice * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-4">
                <span className="text-muted-foreground">Avg Price: ₹{kaspa.avgPrice.toFixed(2)}</span>
                <span className={`font-bold ${calculatePL(calculateStockInvested(kaspa), calculateStockValue(kaspa)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  P&L: ₹{calculatePL(calculateStockInvested(kaspa), calculateStockValue(kaspa)).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AnimatedPage>
  )
}
