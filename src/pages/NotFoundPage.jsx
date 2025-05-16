
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4"
    >
      <AlertTriangle className="w-24 h-24 text-amber-500 mb-6" />
      <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">404</h1>
      <p className="text-2xl text-slate-600 dark:text-slate-300 mb-8">
        Oops! A página que você está procurando não foi encontrada.
      </p>
      <div className="space-x-4">
        <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar para o Início
          </Link>
        </Button>
         <Button asChild variant="outline">
            <Link to="/admin">
              Painel Administrativo
            </Link>
        </Button>
      </div>
       <div className="mt-12">
        <img  class="max-w-sm opacity-80" alt="Empty water bottle illustration" src="https://images.unsplash.com/photo-1556605468-813ca22f883f" />
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
