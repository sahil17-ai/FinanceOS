import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password });

      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Signup failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen pointer-events-none"></div>

      <Card className="w-full max-w-md shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl relative z-10 text-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-4xl font-black tracking-tight text-white mb-2">Create Account</CardTitle>
          <CardDescription className="text-gray-300">Join FinanceOS and take control of your wealth</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="flex h-12 w-full rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500" 
                placeholder="name@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="flex h-12 w-full rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500" 
                placeholder="••••••••"
                required 
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-purple-500/25 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 transition-all transform hover:scale-[1.02]">Sign Up</Button>
            <div className="text-center text-sm text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="text-white font-semibold hover:text-purple-400 transition-colors ml-1">Log in here</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
