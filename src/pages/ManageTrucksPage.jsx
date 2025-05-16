
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { Truck as TruckIcon, Edit, Trash2, PlusCircle } from 'lucide-react';

const ManageTrucksPage = () => {
  const { trucks, addTruck, updateTruck, deleteTruck } = useAppContext();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentTruck, setCurrentTruck] = useState(null); // For editing
  const [truckPlate, setTruckPlate] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!truckPlate.trim()) {
        newErrors.truckPlate = 'A placa do caminhão é obrigatória.';
    } else if (!/^[A-Z]{3}-?\d{4}$/i.test(truckPlate.trim()) && !/^[A-Z]{3}\d[A-Z]\d{2}$/i.test(truckPlate.trim())) {
        newErrors.truckPlate = 'Formato de placa inválido. Use AAA-1234 ou AAA1B34.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenFormModal = (truck = null) => {
    setCurrentTruck(truck);
    setTruckPlate(truck ? truck.plate : '');
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCurrentTruck(null);
    setTruckPlate('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedPlate = truckPlate.toUpperCase().replace('-', '');

    if (currentTruck) {
      updateTruck({ ...currentTruck, plate: formattedPlate });
    } else {
      addTruck({ plate: formattedPlate });
    }
    handleCloseFormModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sky-700 dark:text-sky-400 flex items-center">
          <TruckIcon className="mr-3 h-8 w-8" /> Gerenciar Caminhões
        </h1>
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenFormModal()} className="bg-sky-600 hover:bg-sky-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Caminhão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="text-sky-700 dark:text-sky-400">{currentTruck ? 'Editar Caminhão' : 'Adicionar Novo Caminhão'}</DialogTitle>
              <DialogDescription>
                {currentTruck ? 'Atualize a placa do caminhão.' : 'Preencha a placa do novo caminhão.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="truckPlateModal" className="text-right">
                  Placa
                </Label>
                <Input
                  id="truckPlateModal"
                  value={truckPlate}
                  onChange={(e) => setTruckPlate(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: ABC-1234 ou ABC1D23"
                />
              </div>
              {errors.truckPlate && <p className="col-span-4 text-red-500 text-xs text-center">{errors.truckPlate}</p>}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseFormModal}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">{currentTruck ? 'Salvar Alterações' : 'Adicionar Caminhão'}</Button>
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">Lista de Caminhões</CardTitle>
        </CardHeader>
        <CardContent>
          {trucks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa do Caminhão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.map((truck) => (
                  <TableRow key={truck.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <TableCell className="font-medium">{truck.plate}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenFormModal(truck)}>
                        <Edit className="mr-1 h-4 w-4" /> Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-1 h-4 w-4" /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o caminhão com placa "{truck.plate}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTruck(truck.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhum caminhão cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageTrucksPage;
