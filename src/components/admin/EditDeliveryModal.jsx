
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

const EditDeliveryModal = ({ isOpen, onOpenChange, delivery, setDelivery, onSave, drivers, trucks }) => {
  if (!delivery) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDelivery(prev => ({ ...prev, [id.replace('edit-', '')]: value }));
  };
  
  const handleDateChange = (date) => {
     setDelivery(prev => ({ ...prev, deliveryDate: date }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-sky-700 dark:text-sky-400">Editar Entrega</DialogTitle>
          <DialogDescription>Modifique os detalhes da entrega abaixo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-customerName" className="text-right">Cliente</Label>
            <Input id="edit-customerName" value={delivery.customerName} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-address" className="text-right">Endereço</Label>
            <Input id="edit-address" value={delivery.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-deliveryDate" className="text-right">Data</Label>
            <DatePicker date={delivery.deliveryDate} setDate={handleDateChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-startTime" className="text-right">Início</Label>
            <Input id="edit-startTime" type="time" value={delivery.startTime} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-endTime" className="text-right">Saída</Label>
            <Input id="edit-endTime" type="time" value={delivery.endTime} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-waterQuantity" className="text-right">Litros</Label>
            <Input id="edit-waterQuantity" type="number" value={delivery.waterQuantity} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-driverName" className="text-right">Motorista</Label>
            <select id="edit-driverName" value={delivery.driverName} onChange={handleChange} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              {drivers.map(driver => <option key={driver.id} value={driver.name}>{driver.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-truckPlate" className="text-right">Caminhão</Label>
            <select id="edit-truckPlate" value={delivery.truckPlate} onChange={handleChange} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              {trucks.map(truck => <option key={truck.id} value={truck.plate}>{truck.plate}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-receiverSignature" className="text-right">Receptor</Label>
            <Input id="edit-receiverSignature" value={delivery.receiverSignature} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-receiverRg" className="text-right">RG Receptor</Label>
            <Input id="edit-receiverRg" value={delivery.receiverRg || ''} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={onSave} className="bg-sky-600 hover:bg-sky-700">Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeliveryModal;
