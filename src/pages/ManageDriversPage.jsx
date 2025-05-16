
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
import { UserPlus, Edit, Trash2, UserCog, KeyRound } from 'lucide-react';

const ManageDriversPage = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useAppContext();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!driverName.trim()) newErrors.driverName = 'Nome do motorista é obrigatório.';
    if (!username.trim()) newErrors.username = 'Nome de usuário é obrigatório.';
    else if (drivers.some(d => d.username === username.trim() && d.id !== (currentDriver ? currentDriver.id : null))) {
      newErrors.username = 'Este nome de usuário já está em uso.';
    }
    if (!currentDriver && !password.trim()) newErrors.password = 'Senha é obrigatória para novos motoristas.';
    if (password.trim() && password.trim().length < 3) newErrors.password = 'Senha deve ter pelo menos 3 caracteres.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenFormModal = (driver = null) => {
    setCurrentDriver(driver);
    setDriverName(driver ? driver.name : '');
    setUsername(driver ? driver.username : '');
    setPassword(''); // Always clear password field for security
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCurrentDriver(null);
    setDriverName('');
    setUsername('');
    setPassword('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const driverData = {
      name: driverName.trim(),
      username: username.trim(),
    };

    if (password.trim()) {
      driverData.password = password.trim();
    }

    if (currentDriver) {
      updateDriver({ ...currentDriver, ...driverData });
    } else {
      addDriver(driverData);
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
          <UserCog className="mr-3 h-8 w-8" /> Gerenciar Motoristas
        </h1>
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenFormModal()} className="bg-sky-600 hover:bg-sky-700">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Motorista
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="text-sky-700 dark:text-sky-400">{currentDriver ? 'Editar Motorista' : 'Adicionar Novo Motorista'}</DialogTitle>
              <DialogDescription>
                {currentDriver ? 'Atualize os dados e credenciais do motorista.' : 'Preencha os dados e credenciais do novo motorista.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="driverNameModal">Nome Completo</Label>
                <Input id="driverNameModal" value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Ex: José Carlos Almeida" />
                {errors.driverName && <p className="text-red-500 text-xs">{errors.driverName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="usernameModal">Nome de Usuário</Label>
                <Input id="usernameModal" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ex: jose.carlos" />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="passwordModal">Senha</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input id="passwordModal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={currentDriver ? "Deixe em branco para não alterar" : "Mínimo 3 caracteres"} className="pl-10" />
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
            
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseFormModal}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">{currentDriver ? 'Salvar Alterações' : 'Adicionar Motorista'}</Button>
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">Lista de Motoristas</CardTitle>
        </CardHeader>
        <CardContent>
          {drivers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.username}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenFormModal(driver)}>
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
                              Tem certeza que deseja excluir o motorista "{driver.name}" (usuário: {driver.username})? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteDriver(driver.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhum motorista cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageDriversPage;
