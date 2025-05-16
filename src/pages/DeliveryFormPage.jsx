
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Truck, User, CalendarDays, Clock, Droplet, Edit3, Send, Fingerprint, Building } from 'lucide-react';

const DeliveryForm = ({ driverForForm }) => {
  const { addDelivery, trucks, customers, authenticatedDriver } = useAppContext();
  
  const currentDriver = driverForForm || authenticatedDriver;

  const MANUAL_ENTRY_CUSTOMER_ID = "MANUAL_CUSTOMER_ENTRY_ID"; // Define a constant for manual entry

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [waterQuantity, setWaterQuantity] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [receiverSignature, setReceiverSignature] = useState('');
  const [receiverRg, setReceiverRg] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCustomerId && selectedCustomerId !== MANUAL_ENTRY_CUSTOMER_ID) {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        setCustomerName(selectedCustomer.name);
        setAddress(selectedCustomer.address);
      }
    } else {
      setCustomerName('');
      setAddress('');
    }
  }, [selectedCustomerId, customers, MANUAL_ENTRY_CUSTOMER_ID]);

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Nome do cliente é obrigatório.';
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório.';
    if (!startTime) newErrors.startTime = 'Horário de início é obrigatório.';
    if (!endTime) newErrors.endTime = 'Horário de saída é obrigatório.';
    if (startTime && endTime && startTime >= endTime) newErrors.endTime = 'Horário de saída deve ser após o horário de início.';
    if (!waterQuantity || isNaN(parseFloat(waterQuantity)) || parseFloat(waterQuantity) <= 0) newErrors.waterQuantity = 'Quantidade de água deve ser um número positivo.';
    if (!currentDriver || !currentDriver.name) newErrors.driverName = 'Motorista não identificado.';
    if (!truckPlate) newErrors.truckPlate = 'Placa do caminhão é obrigatória.';
    if (!deliveryDate) newErrors.deliveryDate = 'Data da entrega é obrigatória.';
    if (!receiverSignature.trim()) newErrors.receiverSignature = 'Assinatura (nome do receptor) é obrigatória.';
    if (!receiverRg.trim()) newErrors.receiverRg = 'RG do receptor é obrigatório.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || !currentDriver) return;

    addDelivery({
      customerName,
      address,
      startTime,
      endTime,
      waterQuantity: parseFloat(waterQuantity),
      driverName: currentDriver.name, 
      driverId: currentDriver.id,
      truckPlate,
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      receiverSignature,
      receiverRg,
      selectedCustomerId: selectedCustomerId === MANUAL_ENTRY_CUSTOMER_ID ? null : selectedCustomerId,
    });

    setSelectedCustomerId('');
    setCustomerName('');
    setAddress('');
    setStartTime('');
    setEndTime('');
    setWaterQuantity('');
    setTruckPlate('');
    setDeliveryDate(new Date());
    setReceiverSignature('');
    setReceiverRg('');
    setErrors({});
  };

  return (
      <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sky-700 dark:text-sky-400 flex items-center">
            <Truck className="mr-2 h-6 w-6" /> Registrar Nova Entrega
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Preencha os detalhes da entrega.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="selectedCustomer">Cliente Pré-cadastrado (Opcional)</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger id="selectedCustomer" className="w-full">
                  <SelectValue placeholder="Selecione um cliente ou preencha manualmente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MANUAL_ENTRY_CUSTOMER_ID}>Nenhum (Preencher manualmente)</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name} - {customer.address}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customerName">Nome do Cliente</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nome do cliente" className="pl-10" disabled={!!selectedCustomerId && selectedCustomerId !== MANUAL_ENTRY_CUSTOMER_ID} />
                </div>
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <Label htmlFor="waterQuantity">Quantidade de Água (Litros)</Label>
                 <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="waterQuantity" type="number" value={waterQuantity} onChange={(e) => setWaterQuantity(e.target.value)} placeholder="Ex: 500" className="pl-10" />
                </div>
                {errors.waterQuantity && <p className="text-red-500 text-xs mt-1">{errors.waterQuantity}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço completo da entrega" disabled={!!selectedCustomerId && selectedCustomerId !== MANUAL_ENTRY_CUSTOMER_ID} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startTime">Horário de Início</Label>
                 <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10" />
                </div>
                {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime">Horário de Saída</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10" />
                </div>
                {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
              </div>
            </div>
            
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Motorista: <span className="font-normal text-slate-600 dark:text-slate-400">{currentDriver?.name || 'Não identificado'}</span></p>
            {errors.driverName && <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="truckPlate">Placa do Caminhão</Label>
                <Select value={truckPlate} onValueChange={setTruckPlate}>
                  <SelectTrigger id="truckPlate" className="w-full">
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
                <Label htmlFor="deliveryDate">Data da Entrega</Label>
                <DatePicker date={deliveryDate} setDate={setDeliveryDate} className="w-full"/>
                {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="receiverSignature">Assinatura do Receptor (Nome)</Label>
                <div className="relative">
                    <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="receiverSignature" value={receiverSignature} onChange={(e) => setReceiverSignature(e.target.value)} placeholder="Digite o nome de quem recebeu" className="pl-10" />
                </div>
                {errors.receiverSignature && <p className="text-red-500 text-xs mt-1">{errors.receiverSignature}</p>}
              </div>
              <div>
                <Label htmlFor="receiverRg">RG do Receptor</Label>
                <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="receiverRg" value={receiverRg} onChange={(e) => setReceiverRg(e.target.value)} placeholder="Digite o RG de quem recebeu" className="pl-10" />
                </div>
                {errors.receiverRg && <p className="text-red-500 text-xs mt-1">{errors.receiverRg}</p>}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para simplificar a assinatura, digite o nome completo do receptor.</p>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full bg-sky-600 hover:bg-sky-700 text-white text-lg py-3">
            <Send className="mr-2 h-5 w-5" />
            Enviar Registro
          </Button>
        </CardFooter>
      </Card>
  );
};

export default DeliveryForm;
