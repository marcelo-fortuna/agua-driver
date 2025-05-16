
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { Building, UserPlus, Edit, Trash2 } from 'lucide-react';

const ManageCustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Nome do cliente é obrigatório.';
    if (!customerAddress.trim()) newErrors.customerAddress = 'Endereço do cliente é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenFormModal = (customer = null) => {
    setCurrentCustomer(customer);
    setCustomerName(customer ? customer.name : '');
    setCustomerAddress(customer ? customer.address : '');
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCurrentCustomer(null);
    setCustomerName('');
    setCustomerAddress('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const customerData = {
      name: customerName.trim(),
      address: customerAddress.trim(),
    };

    if (currentCustomer) {
      updateCustomer({ ...currentCustomer, ...customerData });
    } else {
      addCustomer(customerData);
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
          <Building className="mr-3 h-8 w-8" /> Gerenciar Clientes
        </h1>
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenFormModal()} className="bg-sky-600 hover:bg-sky-700">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="text-sky-700 dark:text-sky-400">{currentCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
              <DialogDescription>
                {currentCustomer ? 'Atualize os dados do cliente.' : 'Preencha os dados do novo cliente.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="customerNameModal">Nome do Cliente</Label>
                <Input id="customerNameModal" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex: Supermercado XYZ" />
                {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="customerAddressModal">Endereço</Label>
                <Textarea id="customerAddressModal" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Ex: Av. Brasil, 1500, Sala 10" />
                {errors.customerAddress && <p className="text-red-500 text-xs">{errors.customerAddress}</p>}
              </div>
            
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseFormModal}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">{currentCustomer ? 'Salvar Alterações' : 'Adicionar Cliente'}</Button>
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="max-w-sm truncate" title={customer.address}>{customer.address}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenFormModal(customer)}>
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
                                Tem certeza que deseja excluir o cliente "{customer.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCustomer(customer.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhum cliente cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageCustomersPage;
