
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DeliveryDetailsModal = ({ isOpen, onOpenChange, delivery }) => {
  if (!delivery) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-sky-700 dark:text-sky-400">Detalhes da Entrega</DialogTitle>
          <DialogDescription>Informações completas do registro.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4 text-sm">
          <p><strong>Cliente:</strong> {delivery.customerName}</p>
          <p><strong>Endereço:</strong> {delivery.address}</p>
          <p><strong>Data:</strong> {format(new Date(delivery.deliveryDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p><strong>Início:</strong> {delivery.startTime}</p>
          <p><strong>Saída:</strong> {delivery.endTime}</p>
          <p><strong>Quantidade:</strong> {delivery.waterQuantity} L</p>
          <p><strong>Motorista:</strong> {delivery.driverName}</p>
          <p><strong>Caminhão:</strong> {delivery.truckPlate}</p>
          <p><strong>Receptor:</strong> {delivery.receiverSignature}</p>
          <p><strong>RG Receptor:</strong> {delivery.receiverRg || 'Não informado'}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetailsModal;
