
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, XCircle } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

const AdminDashboardFilters = ({ 
  activeTab, 
  deliverySearchTerm, setDeliverySearchTerm, deliveryFilterStartDate, setDeliveryFilterStartDate, deliveryFilterEndDate, setDeliveryFilterEndDate, deliveryFilterDriver, setDeliveryFilterDriver, deliveryFilterTruck, setDeliveryFilterTruck, resetDeliveryFilters,
  fuelingSearchTerm, setFuelingSearchTerm, fuelingFilterStartDate, setFuelingFilterStartDate, fuelingFilterEndDate, setFuelingFilterEndDate, fuelingFilterTruck, setFuelingFilterTruck, resetFuelingFilters,
  maintenanceSearchTerm, setMaintenanceSearchTerm, maintenanceFilterStartDate, setMaintenanceFilterStartDate, maintenanceFilterEndDate, setMaintenanceFilterEndDate, maintenanceFilterTruck, setMaintenanceFilterTruck, resetMaintenanceFilters
}) => {

  const commonDateFilters = (startDate, setStartDate, endDate, setEndDate) => (
    <>
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Início:</span>
        <DatePicker date={startDate} setDate={setStartDate} className="w-full" placeholderText="Data de Início"/>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Fim:</span>
        <DatePicker date={endDate} setDate={setEndDate} className="w-full" placeholderText="Data de Fim"/>
      </div>
    </>
  );

  if (activeTab === 'deliveries') {
    return (
      <CardContent className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-end">
        <div className="relative lg:col-span-1 xl:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input placeholder="Cliente ou endereço..." value={deliverySearchTerm} onChange={(e) => setDeliverySearchTerm(e.target.value)} className="pl-10" />
        </div>
        {commonDateFilters(deliveryFilterStartDate, setDeliveryFilterStartDate, deliveryFilterEndDate, setDeliveryFilterEndDate)}
        <Input type="text" placeholder="Filtrar por motorista" value={deliveryFilterDriver} onChange={(e) => setDeliveryFilterDriver(e.target.value)} />
        <Input type="text" placeholder="Filtrar por caminhão" value={deliveryFilterTruck} onChange={(e) => setDeliveryFilterTruck(e.target.value)} />
        <Button onClick={resetDeliveryFilters} variant="outline" className="w-full xl:col-span-3">
          <XCircle className="mr-2 h-4 w-4" /> Limpar Filtros de Entrega
        </Button>
      </CardContent>
    );
  } else if (activeTab === 'fuelings') {
    return (
      <CardContent className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-end">
        <div className="relative lg:col-span-1 xl:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input placeholder="Posto ou motorista..." value={fuelingSearchTerm} onChange={(e) => setFuelingSearchTerm(e.target.value)} className="pl-10" />
        </div>
        {commonDateFilters(fuelingFilterStartDate, setFuelingFilterStartDate, fuelingFilterEndDate, setFuelingFilterEndDate)}
        <Input type="text" placeholder="Filtrar por caminhão" value={fuelingFilterTruck} onChange={(e) => setFuelingFilterTruck(e.target.value)} />
        <Button onClick={resetFuelingFilters} variant="outline" className="w-full xl:col-span-3">
          <XCircle className="mr-2 h-4 w-4" /> Limpar Filtros de Abastecimento
        </Button>
      </CardContent>
    );
  } else if (activeTab === 'maintenances') {
    return (
      <CardContent className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-end">
        <div className="relative lg:col-span-1 xl:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input placeholder="Problema, mecânico ou motorista..." value={maintenanceSearchTerm} onChange={(e) => setMaintenanceSearchTerm(e.target.value)} className="pl-10" />
        </div>
        {commonDateFilters(maintenanceFilterStartDate, setMaintenanceFilterStartDate, maintenanceFilterEndDate, setMaintenanceFilterEndDate)}
        <Input type="text" placeholder="Filtrar por caminhão" value={maintenanceFilterTruck} onChange={(e) => setMaintenanceFilterTruck(e.target.value)} />
        <Button onClick={resetMaintenanceFilters} variant="outline" className="w-full xl:col-span-3">
          <XCircle className="mr-2 h-4 w-4" /> Limpar Filtros de Manutenção
        </Button>
      </CardContent>
    );
  }
  return null;
};

export default AdminDashboardFilters;
