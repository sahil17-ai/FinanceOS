import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg,
        history: messages
      });
      
      setMessages(prev => [...prev, { role: 'model', content: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please check your connection and API key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white z-50 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-[350px] h-[500px] max-h-[80vh] flex flex-col shadow-2xl border-white/10 bg-black/80 backdrop-blur-xl z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-50 duration-300">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/10 bg-black/40">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-400" /> FinanceOS AI
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-gray-400 hover:text-white rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
            <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10 px-4 animate-pulse">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-sm">Ask me anything about your finances, budgets, or tips for saving!</p>
                </div>
              )}
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 text-sm shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white/10 text-gray-100 rounded-2xl rounded-tl-sm border border-white/5'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm bg-white/5 border border-white/5 text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 border-t border-white/10 bg-black/60 backdrop-blur-md">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()} 
                  className="absolute right-1 top-1 bottom-1 rounded-full h-auto w-9 p-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
