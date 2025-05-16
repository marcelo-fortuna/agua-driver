
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Wrench } from 'lucide-react';

const MaintenanceTable = ({ maintenances }) => {
  return (
    <Card className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400 flex items-center">
            <Wrench className="mr-2 h-6 w-6" /> Registros de Manutenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Caminhão</TableHead>
                <TableHead>Problema/Serviço</TableHead>
                <TableHead>Mecânico/Oficina</TableHead>
                <TableHead className="text-right">Custo (R$)</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {maintenances.length > 0 ? (
                  maintenances.map((maintenance) => (
                    <motion.tr
                      key={maintenance.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <TableCell>{format(new Date(maintenance.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell>{maintenance.driverName}</TableCell>
                      <TableCell>{maintenance.truckPlate}</TableCell>
                      <TableCell className="max-w-xs truncate" title={maintenance.issue}>{maintenance.issue}</TableCell>
                      <TableCell>{maintenance.mechanic}</TableCell>
                      <TableCell className="text-right">R$ {maintenance.cost.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={maintenance.observation}>{maintenance.observation || '-'}</TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-slate-500 dark:text-slate-400">
                      Nenhum registro de manutenção encontrado.
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

export default MaintenanceTable;
