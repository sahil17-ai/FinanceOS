import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedPage from "@/components/layout/AnimatedPage"
import { TrendingUp, Wallet, Activity } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from "axios"
import api from "@/lib/api"

interface Investment {
  id: number;
  name: str;
  type: str;
  invested_amount: number;
  current_value: number;
  units?: number;
  avg_price?: number;
  sip_date?: number;
  loading?: boolean;
}

export default function Investments() {
  const [open, setOpen] = useState(false)
  const [assetName, setAssetName] = useState("")
  const [assetType, setAssetType] = useState("Stock")
  const [assetUnits, setAssetUnits] = useState("")
  const [assetPrice, setAssetPrice] = useState("")
  const [sipDate, setSipDate] = useState("")
  const [amountInvested, setAmountInvested] = useState("")
  
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInvestments = async () => {
    try {
      const res = await api.get('/investments/')
      const data = res.data.map((inv: any) => ({ ...inv, loading: inv.type !== 'SIP' }))
      setInvestments(data)
      
      // Fetch live prices for non-SIP assets
      data.forEach(async (inv: any) => {
        if (inv.type !== 'SIP' && inv.name) {
          try {
            // Assume name is the symbol for stocks/crypto
            const priceRes = await api.get(`/finance/live-price/${inv.name}`)
            setInvestments(prev => prev.map(p => 
              p.id === inv.id 
                ? { ...p, current_value: priceRes.data.price * (p.units || 1), loading: false } 
                : p
            ))
          } catch (e) {
            console.error(`Failed to fetch ${inv.name}`, e)
            setInvestments(prev => prev.map(p => 
              p.id === inv.id ? { ...p, loading: false } : p
            ))
          }
        }
      })
    } catch (e) {
      toast.error("Failed to fetch investments")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const sips = investments.filter(i => i.type === 'SIP')
  const assets = investments.filter(i => i.type !== 'SIP')

  const totalInvested = investments.reduce((acc, inv) => {
    if (inv.type === 'SIP') return acc + inv.invested_amount;
    return acc + ((inv.avg_price || 0) * (inv.units || 0));
  }, 0);

  const totalValue = investments.reduce((acc, inv) => {
    if (inv.type === 'SIP') return acc + inv.current_value;
    return acc + (inv.current_value || ((inv.avg_price || 0) * (inv.units || 0)));
  }, 0);

  const totalPL = totalValue - totalInvested;

  const handleSaveAsset = async () => {
    if(!assetName) return;
    try {
      const payload = {
        name: assetName,
        type: assetType,
        invested_amount: assetType === 'SIP' ? Number(amountInvested) : Number(assetPrice) * Number(assetUnits),
        units: assetType === 'SIP' ? null : Number(assetUnits),
        avg_price: assetType === 'SIP' ? null : Number(assetPrice),
        sip_date: assetType === 'SIP' ? Number(sipDate) : null,
        current_value: assetType === 'SIP' ? Number(amountInvested) : Number(assetPrice) * Number(assetUnits) // fallback
      };
      await api.post('/investments/', payload)
      toast.success(`${assetName} added to portfolio!`)
      setOpen(false)
      setAssetName("")
      setAssetUnits("")
      setAssetPrice("")
      setAmountInvested("")
      setSipDate("")
      fetchInvestments()
    } catch(e) {
      toast.error("Failed to add asset")
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
                <label className="text-sm font-medium">Type</label>
                <select value={assetType} onChange={e => setAssetType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Stock">Stock / ETF</option>
                  <option value="Crypto">Crypto</option>
                  <option value="SIP">Mutual Fund SIP</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{assetType === 'SIP' ? 'Fund Name' : 'Asset Symbol (e.g. AAPL)'}</label>
                <input value={assetName} onChange={e => setAssetName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={assetType === 'SIP' ? "e.g. SBI Multicap" : "e.g. AAPL"} />
              </div>
              {assetType === 'SIP' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Amount (₹)</label>
                    <input value={amountInvested} onChange={e => setAmountInvested(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 1000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SIP Date (1-31)</label>
                    <input value={sipDate} onChange={e => setSipDate(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 10" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Units/Shares</label>
                    <input value={assetUnits} onChange={e => setAssetUnits(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Avg Buy Price (₹)</label>
                    <input value={assetPrice} onChange={e => setAssetPrice(e.target.value)} type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 150" />
                  </div>
                </>
              )}
              <Button onClick={handleSaveAsset} className="w-full mt-2">Save Asset</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 perspective-1000">
        <Card className="bg-gradient-to-br from-background to-secondary/20 border-l-4 border-l-primary transform transition-transform hover:scale-105 hover:rotate-y-2 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalInvested.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-secondary/20 transform transition-transform hover:scale-105 hover:-rotate-y-2 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Live Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              ₹{totalValue.toFixed(2)}
              {assets.some(a => a.loading) && <Activity className="h-4 w-4 animate-pulse text-muted-foreground" />}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden transform transition-transform hover:scale-105 hover:rotate-x-2 duration-300">
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
              {totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0}% Returns
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* SIP Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Wallet className="h-5 w-5"/> Active SIPs</h2>
          {sips.length === 0 && <p className="text-muted-foreground text-sm">No active SIPs added yet.</p>}
          {sips.map((sip: any) => (
            <Card key={sip.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{sip.name}</CardTitle>
                    <CardDescription>Deducts on {sip.sip_date}th monthly</CardDescription>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">₹{sip.invested_amount}/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Invested: ₹{sip.invested_amount}</span>
                  <span className="font-medium text-green-500">Value: ₹{sip.current_value}</span>
                </div>
                <Button onClick={() => toast.success("Redemption request submitted successfully!")} variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">Redeem Funds</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Equities Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Live Stocks & Crypto</h2>
          {assets.length === 0 && <p className="text-muted-foreground text-sm">No assets added yet.</p>}
          {assets.map((asset: any) => {
            const invested = (asset.avg_price || 0) * (asset.units || 0);
            const current = asset.current_value;
            const pl = current - invested;
            const plPercent = invested > 0 ? (pl / invested) * 100 : 0;
            const isProfit = pl >= 0;

            return (
              <Card key={asset.id} className="transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {asset.name}
                        {asset.loading && <span className="text-xs bg-secondary px-2 rounded animate-pulse">Syncing...</span>}
                      </h3>
                      <p className="text-sm text-muted-foreground">{asset.units} shares • {asset.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">₹{current.toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                        <TrendingUp className="h-3 w-3" />
                        {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-4">
                    <span className="text-muted-foreground">Avg Price: ₹{(asset.avg_price || 0).toFixed(2)}</span>
                    <span className={`font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                      P&L: ₹{pl.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </AnimatedPage>
  )
}
