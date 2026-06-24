import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FinanceState {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  setBalance: (amt: number) => void;
  addIncome: (amt: number) => void;
  addExpense: (amt: number) => void;
  addInvestment: (amt: number) => void;
}

const FinanceContext = createContext<FinanceState | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [currentBalance, setCurrentBalance] = useState(() => Number(localStorage.getItem('fin_balance') || 0));
  const [totalIncome, setTotalIncome] = useState(() => Number(localStorage.getItem('fin_income') || 0));
  const [totalExpenses, setTotalExpenses] = useState(() => Number(localStorage.getItem('fin_expenses') || 0));
  const [totalInvestments, setTotalInvestments] = useState(() => Number(localStorage.getItem('fin_investments') || 0));

  useEffect(() => {
    localStorage.setItem('fin_balance', currentBalance.toString());
    localStorage.setItem('fin_income', totalIncome.toString());
    localStorage.setItem('fin_expenses', totalExpenses.toString());
    localStorage.setItem('fin_investments', totalInvestments.toString());
  }, [currentBalance, totalIncome, totalExpenses, totalInvestments]);

  // Auto SIP Deduction Logic
  useEffect(() => {
    const today = new Date().getDate();
    const lastChecked = localStorage.getItem('fin_last_sip_check');
    const currentMonth = new Date().getMonth().toString();

    if (lastChecked !== currentMonth) {
      if (today >= 10) {
        // ICICI Liquid Fund 10th
        setCurrentBalance(prev => prev - 500);
        setTotalInvestments(prev => prev + 500);
        
        if (today >= 12) {
           // SBI Multicap Fund 12th
           setCurrentBalance(prev => prev - 1000);
           setTotalInvestments(prev => prev + 1000);
           localStorage.setItem('fin_last_sip_check', currentMonth);
        }
      }
    }
  }, []);

  const setBalance = (amt: number) => setCurrentBalance(amt);
  const addIncome = (amt: number) => {
    setTotalIncome(prev => prev + amt);
    setCurrentBalance(prev => prev + amt);
  };
  const addExpense = (amt: number) => {
    setTotalExpenses(prev => prev + amt);
    setCurrentBalance(prev => prev - amt);
  };
  const addInvestment = (amt: number) => {
    setTotalInvestments(prev => prev + amt);
    setCurrentBalance(prev => prev - amt);
  };

  return (
    <FinanceContext.Provider value={{
      currentBalance, totalIncome, totalExpenses, totalInvestments,
      setBalance, addIncome, addExpense, addInvestment
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
