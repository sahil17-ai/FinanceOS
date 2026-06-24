from fastapi import APIRouter, HTTPException
import yfinance as yf

router = APIRouter()

@router.get("/live-price/{symbol}")
def get_live_price(symbol: str):
    """
    Fetch the live, accurate current price of a stock/crypto from yfinance.
    Example symbols: GTLINFRA.NS, KAS-USD
    """
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")
        if data.empty:
            raise HTTPException(status_code=404, detail="Symbol not found or no data available")
        current_price = data['Close'].iloc[-1]
        
        # Convert KAS-USD to INR
        if symbol == "KAS-USD":
            try:
                inr_ticker = yf.Ticker("USDINR=X")
                inr_data = inr_ticker.history(period="1d")
                inr_rate = inr_data['Close'].iloc[-1]
                current_price = current_price * inr_rate
            except:
                current_price = current_price * 83.5 # Fallback rate
                
        return {"symbol": symbol, "price": float(current_price)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live data: {str(e)}")
