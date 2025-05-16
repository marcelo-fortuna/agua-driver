
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
import { Fuel } from 'lucide-react';

const FuelingTable = ({ fuelings }) => {
  return (
    <Card className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400 flex items-center">
            <Fuel className="mr-2 h-6 w-6" /> Registros de Abastecimento
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
                <TableHead>Posto</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">Valor Total (R$)</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {fuelings.length > 0 ? (
                  fuelings.map((fueling) => (
                    <motion.tr
                      key={fueling.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <TableCell>{format(new Date(fueling.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell>{fueling.driverName}</TableCell>
                      <TableCell>{fueling.truckPlate}</TableCell>
                      <TableCell>{fueling.stationName}</TableCell>
                      <TableCell className="text-right">{fueling.liters.toFixed(2)} L</TableCell>
                      <TableCell className="text-right">R$ {fueling.totalValue.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={fueling.observation}>{fueling.observation || '-'}</TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-slate-500 dark:text-slate-400">
                      Nenhum registro de abastecimento encontrado.
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

export default FuelingTable;
