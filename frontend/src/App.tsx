import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import BottomNav from "./components/layout/BottomNav"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Income from "./pages/Income"
import Investments from "./pages/Investments"
import Lending from "./pages/Lending"
import Goals from "./pages/Goals"
import Analytics from "./pages/Analytics"
import Calendar from "./pages/Calendar"
import Settings from "./pages/Settings"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from "@/components/ui/sonner"
import { FinanceProvider } from "@/context/FinanceContext"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Navigate } from "react-router-dom"

const queryClient = new QueryClient()

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
        <Route path="/lending" element={<ProtectedRoute><Lending /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FinanceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout>
                    <AnimatedRoutes />
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </FinanceProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
