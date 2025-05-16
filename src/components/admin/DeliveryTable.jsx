
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

const DeliveryTable = ({ deliveries, onViewDetails, onEdit, onDelete }) => {
  return (
    <Card className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400">Registros de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {deliveries.length > 0 ? (
                  deliveries.map((delivery) => (
                    <motion.tr
                      key={delivery.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <TableCell className="font-medium">{delivery.customerName}</TableCell>
                      <TableCell>{format(new Date(delivery.deliveryDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell>{delivery.driverName}</TableCell>
                      <TableCell className="text-right">{delivery.waterQuantity} L</TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewDetails(delivery)}>
                                <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(delivery)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-100 dark:focus:bg-red-900/50">
                                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                               <AlertDialogDescription>
                                 Tem certeza que deseja excluir este registro de entrega? Esta ação não pode ser desfeita.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Cancelar</AlertDialogCancel>
                               <AlertDialogAction onClick={() => onDelete(delivery.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-slate-500 dark:text-slate-400">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTable;
