
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Filter, FileText, Package, Fuel, Wrench } from 'lucide-react';
import DeliveryTable from '@/components/admin/DeliveryTable';
import DeliveryDetailsModal from '@/components/admin/DeliveryDetailsModal';
import EditDeliveryModal from '@/components/admin/EditDeliveryModal';
import FuelingTable from '@/components/admin/FuelingTable';
import MaintenanceTable from '@/components/admin/MaintenanceTable';
import AdminDashboardFilters from '@/components/admin/AdminDashboardFilters';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminDashboardPage = () => {
  const { 
    deliveries, drivers, trucks, updateDelivery, deleteDelivery,
    fuelings, maintenances 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('deliveries');

  const [deliverySearchTerm, setDeliverySearchTerm] = useState('');
  const [deliveryFilterStartDate, setDeliveryFilterStartDate] = useState(null);
  const [deliveryFilterEndDate, setDeliveryFilterEndDate] = useState(null);
  const [deliveryFilterDriver, setDeliveryFilterDriver] = useState('');
  const [deliveryFilterTruck, setDeliveryFilterTruck] = useState('');
  
  const [fuelingSearchTerm, setFuelingSearchTerm] = useState('');
  const [fuelingFilterStartDate, setFuelingFilterStartDate] = useState(null);
  const [fuelingFilterEndDate, setFuelingFilterEndDate] = useState(null);
  const [fuelingFilterTruck, setFuelingFilterTruck] = useState('');

  const [maintenanceSearchTerm, setMaintenanceSearchTerm] = useState('');
  const [maintenanceFilterStartDate, setMaintenanceFilterStartDate] = useState(null);
  const [maintenanceFilterEndDate, setMaintenanceFilterEndDate] = useState(null);
  const [maintenanceFilterTruck, setMaintenanceFilterTruck] = useState('');

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const filterByDateRange = (items, dateField, startDate, endDate) => {
    if (!startDate && !endDate) return items;
    return items.filter(item => {
      const itemDate = parseISO(item[dateField]);
      const start = startDate ? startOfDay(startDate) : null;
      const end = endDate ? endOfDay(endDate) : null;

      if (start && end) return isWithinInterval(itemDate, { start, end });
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    });
  };

  const filteredDeliveries = useMemo(() => {
    let filtered = deliveries;
    filtered = filterByDateRange(filtered, 'deliveryDate', deliveryFilterStartDate, deliveryFilterEndDate);
    return filtered
      .filter(delivery => {
        const matchesSearch = 
          delivery.customerName.toLowerCase().includes(deliverySearchTerm.toLowerCase()) ||
          delivery.address.toLowerCase().includes(deliverySearchTerm.toLowerCase());
        const matchesDriver = deliveryFilterDriver ? delivery.driverName.toLowerCase().includes(deliveryFilterDriver.toLowerCase()) : true;
        const matchesTruck = deliveryFilterTruck ? delivery.truckPlate.toLowerCase().includes(deliveryFilterTruck.toLowerCase()) : true;
        return matchesSearch && matchesDriver && matchesTruck;
      })
      .sort((a, b) => new Date(b.deliveryDate + 'T' + b.startTime) - new Date(a.deliveryDate + 'T' + a.startTime));
  }, [deliveries, deliverySearchTerm, deliveryFilterStartDate, deliveryFilterEndDate, deliveryFilterDriver, deliveryFilterTruck]);

  const filteredFuelings = useMemo(() => {
    let filtered = fuelings;
    filtered = filterByDateRange(filtered, 'date', fuelingFilterStartDate, fuelingFilterEndDate);
    return filtered
      .filter(fueling => {
        const matchesSearch = 
          fueling.stationName.toLowerCase().includes(fuelingSearchTerm.toLowerCase()) ||
          fueling.driverName.toLowerCase().includes(fuelingSearchTerm.toLowerCase());
        const matchesTruck = fuelingFilterTruck ? fueling.truckPlate.toLowerCase().includes(fuelingFilterTruck.toLowerCase()) : true;
        return matchesSearch && matchesTruck;
      })
      .sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [fuelings, fuelingSearchTerm, fuelingFilterStartDate, fuelingFilterEndDate, fuelingFilterTruck]);

  const filteredMaintenances = useMemo(() => {
    let filtered = maintenances;
    filtered = filterByDateRange(filtered, 'date', maintenanceFilterStartDate, maintenanceFilterEndDate);
    return filtered
      .filter(maintenance => {
        const matchesSearch = 
          maintenance.issue.toLowerCase().includes(maintenanceSearchTerm.toLowerCase()) ||
          maintenance.mechanic.toLowerCase().includes(maintenanceSearchTerm.toLowerCase()) ||
          maintenance.driverName.toLowerCase().includes(maintenanceSearchTerm.toLowerCase());
        const matchesTruck = maintenanceFilterTruck ? maintenance.truckPlate.toLowerCase().includes(maintenanceFilterTruck.toLowerCase()) : true;
        return matchesSearch && matchesTruck;
      })
      .sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [maintenances, maintenanceSearchTerm, maintenanceFilterStartDate, maintenanceFilterEndDate, maintenanceFilterTruck]);


  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setIsViewModalOpen(true);
  };

  const handleEdit = (delivery) => {
    setEditingDelivery({ ...delivery, deliveryDate: parseISO(delivery.deliveryDate) });
    setIsEditModalOpen(true);
  };
  
  const handleUpdateCurrentDelivery = () => {
    if (!editingDelivery) return;
    const updated = {
      ...editingDelivery,
      deliveryDate: format(new Date(editingDelivery.deliveryDate), 'yyyy-MM-dd'),
      waterQuantity: parseFloat(editingDelivery.waterQuantity)
    };
    updateDelivery(updated);
    setIsEditModalOpen(false);
    setEditingDelivery(null);
  };

  const resetDeliveryFilters = () => {
    setDeliverySearchTerm('');
    setDeliveryFilterStartDate(null);
    setDeliveryFilterEndDate(null);
    setDeliveryFilterDriver('');
    setDeliveryFilterTruck('');
  };

  const resetFuelingFilters = () => {
    setFuelingSearchTerm('');
    setFuelingFilterStartDate(null);
    setFuelingFilterEndDate(null);
    setFuelingFilterTruck('');
  };

  const resetMaintenanceFilters = () => {
    setMaintenanceSearchTerm('');
    setMaintenanceFilterStartDate(null);
    setMaintenanceFilterEndDate(null);
    setMaintenanceFilterTruck('');
  };
  
  const exportToPDF = (data, headers, title, filename) => {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    doc.autoTable({
      head: [headers.map(h => h.header)],
      body: data.map(item => headers.map(h => item[h.key] !== undefined && item[h.key] !== null ? String(item[h.key]) : '')),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8 },
    });
    doc.save(`${filename}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`);
  };

  const handleExport = () => {
    if (activeTab === 'deliveries') {
      const headers = [
        { header: 'Cliente', key: 'customerName' },
        { header: 'Endereço', key: 'address' },
        { header: 'Data', key: 'deliveryDate' },
        { header: 'Início', key: 'startTime' },
        { header: 'Saída', key: 'endTime' },
        { header: 'Litros', key: 'waterQuantity' },
        { header: 'Motorista', key: 'driverName' },
        { header: 'Caminhão', key: 'truckPlate' },
        { header: 'Receptor', key: 'receiverSignature' },
        { header: 'RG Receptor', key: 'receiverRg' },
      ];
      exportToPDF(filteredDeliveries, headers, 'Relatório de Entregas', 'entregas');
    } else if (activeTab === 'fuelings') {
      const headers = [
        { header: 'Data', key: 'date' },
        { header: 'Motorista', key: 'driverName' },
        { header: 'Caminhão', key: 'truckPlate' },
        { header: 'Posto', key: 'stationName' },
        { header: 'Litros', key: 'liters' },
        { header: 'Valor Total', key: 'totalValue' },
        { header: 'Obs.', key: 'observation' },
      ];
      exportToPDF(filteredFuelings, headers, 'Relatório de Abastecimentos', 'abastecimentos');
    } else if (activeTab === 'maintenances') {
      const headers = [
        { header: 'Data', key: 'date' },
        { header: 'Motorista', key: 'driverName' },
        { header: 'Caminhão', key: 'truckPlate' },
        { header: 'Problema', key: 'issue' },
        { header: 'Mecânico', key: 'mechanic' },
        { header: 'Custo', key: 'cost' },
        { header: 'Obs.', key: 'observation' },
      ];
      exportToPDF(filteredMaintenances, headers, 'Relatório de Manutenções', 'manutencoes');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          <TabsTrigger value="deliveries" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600 flex items-center justify-center py-2.5">
            <Package className="mr-2 h-5 w-5" /> Entregas
          </TabsTrigger>
          <TabsTrigger value="fuelings" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600 flex items-center justify-center py-2.5">
            <Fuel className="mr-2 h-5 w-5" /> Abastecimentos
          </TabsTrigger>
          <TabsTrigger value="maintenances" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600 flex items-center justify-center py-2.5">
            <Wrench className="mr-2 h-5 w-5" /> Manutenções
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400 flex items-center mb-2 sm:mb-0">
                <Filter className="mr-2 h-6 w-6" /> Filtros e Pesquisa
              </CardTitle>
              <Button onClick={handleExport} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                <FileText className="mr-2 h-4 w-4" /> Exportar {activeTab === 'deliveries' ? 'Entregas' : activeTab === 'fuelings' ? 'Abastecimentos' : 'Manutenções'} (PDF)
              </Button>
            </div>
          </CardHeader>
          <AdminDashboardFilters
            activeTab={activeTab}
            deliverySearchTerm={deliverySearchTerm} setDeliverySearchTerm={setDeliverySearchTerm}
            deliveryFilterStartDate={deliveryFilterStartDate} setDeliveryFilterStartDate={setDeliveryFilterStartDate}
            deliveryFilterEndDate={deliveryFilterEndDate} setDeliveryFilterEndDate={setDeliveryFilterEndDate}
            deliveryFilterDriver={deliveryFilterDriver} setDeliveryFilterDriver={setDeliveryFilterDriver}
            deliveryFilterTruck={deliveryFilterTruck} setDeliveryFilterTruck={setDeliveryFilterTruck}
            resetDeliveryFilters={resetDeliveryFilters}
            fuelingSearchTerm={fuelingSearchTerm} setFuelingSearchTerm={setFuelingSearchTerm}
            fuelingFilterStartDate={fuelingFilterStartDate} setFuelingFilterStartDate={setFuelingFilterStartDate}
            fuelingFilterEndDate={fuelingFilterEndDate} setFuelingFilterEndDate={setFuelingFilterEndDate}
            fuelingFilterTruck={fuelingFilterTruck} setFuelingFilterTruck={setFuelingFilterTruck}
            resetFuelingFilters={resetFuelingFilters}
            maintenanceSearchTerm={maintenanceSearchTerm} setMaintenanceSearchTerm={setMaintenanceSearchTerm}
            maintenanceFilterStartDate={maintenanceFilterStartDate} setMaintenanceFilterStartDate={setMaintenanceFilterStartDate}
            maintenanceFilterEndDate={maintenanceFilterEndDate} setMaintenanceFilterEndDate={setMaintenanceFilterEndDate}
            maintenanceFilterTruck={maintenanceFilterTruck} setMaintenanceFilterTruck={setMaintenanceFilterTruck}
            resetMaintenanceFilters={resetMaintenanceFilters}
          />
        </Card>

        <TabsContent value="deliveries" className="mt-6">
          <DeliveryTable
            deliveries={filteredDeliveries}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={deleteDelivery}
          />
        </TabsContent>
        <TabsContent value="fuelings" className="mt-6">
          <FuelingTable fuelings={filteredFuelings} />
        </TabsContent>
        <TabsContent value="maintenances" className="mt-6">
          <MaintenanceTable maintenances={filteredMaintenances} />
        </TabsContent>
      </Tabs>

      {selectedDelivery && (
        <DeliveryDetailsModal
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          delivery={selectedDelivery}
        />
      )}

      {editingDelivery && (
        <EditDeliveryModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          delivery={editingDelivery}
          setDelivery={setEditingDelivery}
          onSave={handleUpdateCurrentDelivery}
          drivers={drivers}
          trucks={trucks}
        />
      )}
    </motion.div>
  );
};

export default AdminDashboardPage;
