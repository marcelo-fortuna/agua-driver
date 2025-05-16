
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Send, DollarSign } from 'lucide-react';

const MaintenanceForm = ({ driverForForm }) => {
  const { trucks, addMaintenance, authenticatedDriver } = useAppContext();
  const currentDriver = driverForForm || authenticatedDriver;

  const [issue, setIssue] = useState('');
  const [mechanic, setMechanic] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date());
  const [observation, setObservation] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!currentDriver) newErrors.driver = 'Motorista não autenticado.';
    if (!truckPlate) newErrors.truckPlate = 'Placa do caminhão é obrigatória.';
    if (!issue.trim()) newErrors.issue = 'Descrição do problema é obrigatória.';
    if (!mechanic.trim()) newErrors.mechanic = 'Nome do mecânico/oficina é obrigatório.';
    if (!cost || isNaN(parseFloat(cost)) || parseFloat(cost) < 0) newErrors.cost = 'Custo deve ser um número (pode ser zero).';
    if (!date) newErrors.date = 'Data da manutenção é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || !currentDriver) return;
    addMaintenance({
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      truckPlate: truckPlate,
      issue: issue,
      mechanic: mechanic,
      cost: parseFloat(cost),
      observation: observation,
      date: date.toISOString().split('T')[0],
    });
    setIssue('');
    setMechanic('');
    setCost('');
    setObservation('');
    setDate(new Date());
    setTruckPlate('');
    setErrors({});
  };

  return (
    <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-sky-700 dark:text-sky-400 flex items-center">
          <Wrench className="mr-2 h-6 w-6" /> Registrar Manutenção
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Preencha os detalhes da manutenção do caminhão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <Label htmlFor="maintenanceTruckPlate">Placa do Caminhão</Label>
            <Select value={truckPlate} onValueChange={setTruckPlate}>
              <SelectTrigger id="maintenanceTruckPlate" className="w-full">
                <SelectValue placeholder="Selecione a placa" />
              </SelectTrigger>
              <SelectContent>
                {trucks.map(truck => (
                  <SelectItem key={truck.id} value={truck.plate}>{truck.plate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.truckPlate && <p className="text-red-500 text-xs mt-1">{errors.truckPlate}</p>}
          </div>
          <div>
            <Label htmlFor="maintenanceIssue">Problema / Serviço Realizado</Label>
            <Textarea id="maintenanceIssue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Ex: Troca de óleo e filtro, Pneu furado..." />
            {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}
          </div>
          <div>
            <Label htmlFor="maintenanceMechanic">Mecânico / Oficina</Label>
            <Input id="maintenanceMechanic" value={mechanic} onChange={(e) => setMechanic(e.target.value)} placeholder="Ex: Oficina do Zé" />
            {errors.mechanic && <p className="text-red-500 text-xs mt-1">{errors.mechanic}</p>}
          </div>
          <div>
            <Label htmlFor="maintenanceCost">Custo Total (R$)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input id="maintenanceCost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Ex: 350.00" className="pl-10" />
            </div>
            {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
          </div>
          <div>
            <Label htmlFor="maintenanceDate">Data da Manutenção</Label>
            <DatePicker date={date} setDate={setDate} className="w-full"/>
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          <div>
            <Label htmlFor="maintenanceObservation">Observação (Opcional)</Label>
            <Textarea id="maintenanceObservation" value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Detalhes adicionais sobre a manutenção..." />
          </div>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            <Send className="mr-2 h-4 w-4" /> Enviar Registro de Manutenção
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;
