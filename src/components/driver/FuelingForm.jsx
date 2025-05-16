
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Fuel, Send, Droplet, DollarSign } from 'lucide-react';

const FuelingForm = ({ driverForForm }) => {
  const { trucks, addFueling, authenticatedDriver } = useAppContext();
  const currentDriver = driverForForm || authenticatedDriver;

  const [stationName, setStationName] = useState('');
  const [liters, setLiters] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [observation, setObservation] = useState('');
  const [date, setDate] = useState(new Date());
  const [truckPlate, setTruckPlate] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!currentDriver) newErrors.driver = 'Motorista não autenticado.';
    if (!truckPlate) newErrors.truckPlate = 'Placa do caminhão é obrigatória.';
    if (!stationName.trim()) newErrors.stationName = 'Nome do posto é obrigatório.';
    if (!liters || isNaN(parseFloat(liters)) || parseFloat(liters) <= 0) newErrors.liters = 'Quantidade de litros deve ser um número positivo.';
    if (!totalValue || isNaN(parseFloat(totalValue)) || parseFloat(totalValue) <= 0) newErrors.totalValue = 'Valor total deve ser um número positivo.';
    if (!date) newErrors.date = 'Data do abastecimento é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || !currentDriver) return;
    addFueling({
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      truckPlate: truckPlate,
      stationName: stationName,
      liters: parseFloat(liters),
      totalValue: parseFloat(totalValue),
      observation: observation,
      date: date.toISOString().split('T')[0],
    });
    setStationName('');
    setLiters('');
    setTotalValue('');
    setObservation('');
    setDate(new Date());
    setTruckPlate('');
    setErrors({});
  };

  return (
    <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-sky-700 dark:text-sky-400 flex items-center">
          <Fuel className="mr-2 h-6 w-6" /> Registrar Abastecimento
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Preencha os detalhes do abastecimento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fuelingTruckPlate">Placa do Caminhão</Label>
            <Select value={truckPlate} onValueChange={setTruckPlate}>
              <SelectTrigger id="fuelingTruckPlate" className="w-full">
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
            <Label htmlFor="fuelingStationName">Nome do Posto</Label>
            <Input id="fuelingStationName" value={stationName} onChange={(e) => setStationName(e.target.value)} placeholder="Ex: Posto Confiança" />
            {errors.stationName && <p className="text-red-500 text-xs mt-1">{errors.stationName}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuelingLiters">Litros Abastecidos</Label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="fuelingLiters" type="number" value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="Ex: 150" className="pl-10" />
              </div>
              {errors.liters && <p className="text-red-500 text-xs mt-1">{errors.liters}</p>}
            </div>
            <div>
              <Label htmlFor="fuelingTotalValue">Valor Total (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="fuelingTotalValue" type="number" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} placeholder="Ex: 750.00" className="pl-10" />
              </div>
              {errors.totalValue && <p className="text-red-500 text-xs mt-1">{errors.totalValue}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="fuelingDate">Data do Abastecimento</Label>
            <DatePicker date={date} setDate={setDate} className="w-full"/>
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          <div>
            <Label htmlFor="fuelingObservation">Observação (Opcional)</Label>
            <Textarea id="fuelingObservation" value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Alguma nota adicional?" />
          </div>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            <Send className="mr-2 h-4 w-4" /> Enviar Registro de Abastecimento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FuelingForm;
