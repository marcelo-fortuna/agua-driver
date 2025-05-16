
import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Fuel, Wrench, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FuelingForm from '@/components/driver/FuelingForm';
import MaintenanceForm from '@/components/driver/MaintenanceForm';
import DeliveryForm from '@/pages/DeliveryFormPage';
import DriverPanelHeader from '@/components/driver/DriverPanelHeader';
import DriverPanelContentArea from '@/components/driver/DriverPanelContentArea';

const DriverPanelPage = () => {
  const { authenticatedDriver, driverLogout } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedDriver) {
      navigate('/driver-login');
    }
  }, [authenticatedDriver, navigate]);

  if (!authenticatedDriver) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">Acesso Negado</p>
            <p className="text-md text-slate-500 dark:text-slate-500">Você precisa estar logado como motorista para acessar esta página.</p>
            <Button onClick={() => navigate('/driver-login')} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white">Ir para Login do Motorista</Button>
        </div>
    );
  }

  const tabsConfig = [
    {
      value: "delivery",
      label: "Nova Entrega",
      icon: PackagePlus,
      component: <DeliveryForm driverForForm={authenticatedDriver} />
    },
    {
      value: "fueling",
      label: "Abastecimento",
      icon: Fuel,
      component: <FuelingForm driverForForm={authenticatedDriver} />
    },
    {
      value: "maintenance",
      label: "Manutenção",
      icon: Wrench,
      component: <MaintenanceForm driverForForm={authenticatedDriver} />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <DriverPanelHeader 
        driverName={authenticatedDriver.name} 
        onLogout={() => { driverLogout(); navigate('/driver-login'); }}
      />
      <DriverPanelContentArea tabsConfig={tabsConfig} defaultTab="delivery" />
    </motion.div>
  );
};

export default DriverPanelPage;
