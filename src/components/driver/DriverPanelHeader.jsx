
import React from 'react';
import { Button } from '@/components/ui/button';

const DriverPanelHeader = ({ driverName, onLogout }) => {
  return (
    <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Painel do Motorista</h1>
          <p className="text-lg opacity-90">Bem-vindo, {driverName}!</p>
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout} 
          className="bg-white/20 hover:bg-white/30 text-white border-white/50 hover:border-white"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DriverPanelHeader;
