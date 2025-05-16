
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LogIn, AlertTriangle, User, KeyRound } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); 
    if (adminLogin(username, password)) {
      navigate('/admin');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <Card className="w-full max-w-md shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-sky-700 dark:text-sky-400">
            Acesso Administrativo
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            Entre com seu usuário e senha para acessar o painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="pl-10"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center p-3 rounded-md bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleLogin} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminLoginPage;
