
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fuelings, setFuelings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Admin auth
  const [authenticatedDriver, setAuthenticatedDriver] = useState(null); // Driver auth

  const { toast } = useToast();
  
  useEffect(() => {
    const storedDeliveries = localStorage.getItem('deliveries');
    if (storedDeliveries) setDeliveries(JSON.parse(storedDeliveries));

    const storedDrivers = localStorage.getItem('drivers');
    if (storedDrivers) {
        setDrivers(JSON.parse(storedDrivers));
    } else {
      const defaultDrivers = [
        { id: 'driver1', name: 'João Silva', username: 'joao', password: '123' },
        { id: 'driver2', name: 'Maria Oliveira', username: 'maria', password: '123' },
      ];
      setDrivers(defaultDrivers);
      saveToLocalStorage('drivers', defaultDrivers);
    }

    const storedTrucks = localStorage.getItem('trucks');
    if (storedTrucks) setTrucks(JSON.parse(storedTrucks));
    else {
      const defaultTrucks = [
        { id: 'truck1', plate: 'ABC-1234' },
        { id: 'truck2', plate: 'XYZ-5678' },
      ];
      setTrucks(defaultTrucks);
      saveToLocalStorage('trucks', defaultTrucks);
    }

    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      const defaultCustomers = [
        { id: 'customer1', name: 'Padaria Pão Quente', address: 'Rua das Flores, 10, Centro' },
        { id: 'customer2', name: 'Restaurante Sabor Divino', address: 'Av. Principal, 250, Bairro Bom' },
      ];
      setCustomers(defaultCustomers);
      saveToLocalStorage('customers', defaultCustomers);
    }

    const storedFuelings = localStorage.getItem('fuelings');
    if (storedFuelings) setFuelings(JSON.parse(storedFuelings));

    const storedMaintenances = localStorage.getItem('maintenances');
    if (storedMaintenances) setMaintenances(JSON.parse(storedMaintenances));
    
    const adminAuthStatus = localStorage.getItem('isAuthenticated');
    if (adminAuthStatus === 'true') {
      setIsAuthenticated(true);
    }

    const driverAuthStatus = localStorage.getItem('authenticatedDriver');
    if (driverAuthStatus) {
      setAuthenticatedDriver(JSON.parse(driverAuthStatus));
    }

  }, []);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addDelivery = (delivery) => {
    const newDelivery = { ...delivery, id: Date.now().toString() };
    const updatedDeliveries = [...deliveries, newDelivery];
    setDeliveries(updatedDeliveries);
    saveToLocalStorage('deliveries', updatedDeliveries);
    toast({ title: "Sucesso!", description: "Entrega registrada." });
  };

  const updateDelivery = (updatedDelivery) => {
    const updatedDeliveries = deliveries.map(d => d.id === updatedDelivery.id ? updatedDelivery : d);
    setDeliveries(updatedDeliveries);
    saveToLocalStorage('deliveries', updatedDeliveries);
    toast({ title: "Sucesso!", description: "Entrega atualizada." });
  };

  const deleteDelivery = (deliveryId) => {
    const updatedDeliveries = deliveries.filter(d => d.id !== deliveryId);
    setDeliveries(updatedDeliveries);
    saveToLocalStorage('deliveries', updatedDeliveries);
    toast({ title: "Sucesso!", description: "Entrega excluída." });
  };

  const addDriver = (driver) => {
    const newDriver = { ...driver, id: Date.now().toString() };
    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    saveToLocalStorage('drivers', updatedDrivers);
    toast({ title: "Sucesso!", description: "Motorista adicionado." });
  };

  const updateDriver = (updatedDriver) => {
    const updatedDrivers = drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d);
    setDrivers(updatedDrivers);
    saveToLocalStorage('drivers', updatedDrivers);
    toast({ title: "Sucesso!", description: "Motorista atualizado." });
  };

  const deleteDriver = (driverId) => {
    const updatedDrivers = drivers.filter(d => d.id !== driverId);
    setDrivers(updatedDrivers);
    saveToLocalStorage('drivers', updatedDrivers);
    if (authenticatedDriver && authenticatedDriver.id === driverId) {
        driverLogout();
    }
    toast({ title: "Sucesso!", description: "Motorista excluído." });
  };
  
  const addTruck = (truck) => {
    const newTruck = { ...truck, id: Date.now().toString() };
    const updatedTrucks = [...trucks, newTruck];
    setTrucks(updatedTrucks);
    saveToLocalStorage('trucks', updatedTrucks);
    toast({ title: "Sucesso!", description: "Caminhão adicionado." });
  };

  const updateTruck = (updatedTruck) => {
    const updatedTrucks = trucks.map(t => t.id === updatedTruck.id ? updatedTruck : t);
    setTrucks(updatedTrucks);
    saveToLocalStorage('trucks', updatedTrucks);
    toast({ title: "Sucesso!", description: "Caminhão atualizado." });
  };

  const deleteTruck = (truckId) => {
    const updatedTrucks = trucks.filter(t => t.id !== truckId);
    setTrucks(updatedTrucks);
    saveToLocalStorage('trucks', updatedTrucks);
    toast({ title: "Sucesso!", description: "Caminhão excluído." });
  };

  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToLocalStorage('customers', updatedCustomers);
    toast({ title: "Sucesso!", description: "Cliente adicionado." });
  };

  const updateCustomer = (updatedCustomer) => {
    const updatedCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
    setCustomers(updatedCustomers);
    saveToLocalStorage('customers', updatedCustomers);
    toast({ title: "Sucesso!", description: "Cliente atualizado." });
  };

  const deleteCustomer = (customerId) => {
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    saveToLocalStorage('customers', updatedCustomers);
    toast({ title: "Sucesso!", description: "Cliente excluído." });
  };

  const addFueling = (fueling) => {
    const newFueling = { ...fueling, id: Date.now().toString() };
    const updatedFuelings = [...fuelings, newFueling];
    setFuelings(updatedFuelings);
    saveToLocalStorage('fuelings', updatedFuelings);
    toast({ title: "Sucesso!", description: "Registro de abastecimento adicionado." });
  };

  const addMaintenance = (maintenance) => {
    const newMaintenance = { ...maintenance, id: Date.now().toString() };
    const updatedMaintenances = [...maintenances, newMaintenance];
    setMaintenances(updatedMaintenances);
    saveToLocalStorage('maintenances', updatedMaintenances);
    toast({ title: "Sucesso!", description: "Registro de manutenção adicionado." });
  };

  const adminLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      setAuthenticatedDriver(null); 
      localStorage.removeItem('authenticatedDriver');
      toast({ title: 'Login Admin bem-sucedido!', description: 'Bem-vindo ao painel de Admin.' });
      return true;
    }
    toast({ title: 'Erro de Login Admin', description: 'Usuário ou senha incorretos.', variant: 'destructive' });
    return false;
  };

  const adminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    toast({ title: 'Logout Admin realizado', description: 'Você foi desconectado do painel de Admin.' });
  };

  const driverLogin = (username, password) => {
    const driver = drivers.find(d => d.username === username && d.password === password);
    if (driver) {
      setAuthenticatedDriver(driver);
      localStorage.setItem('authenticatedDriver', JSON.stringify(driver));
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      toast({ title: `Login Motorista bem-sucedido!`, description: `Bem-vindo, ${driver.name}.` });
      return true;
    }
    toast({ title: 'Erro de Login Motorista', description: 'Usuário ou senha incorretos.', variant: 'destructive' });
    return false;
  };

  const driverLogout = () => {
    setAuthenticatedDriver(null);
    localStorage.removeItem('authenticatedDriver');
    toast({ title: 'Logout Motorista realizado', description: 'Você foi desconectado.' });
  };

  return (
    <AppContext.Provider value={{ 
      deliveries, addDelivery, updateDelivery, deleteDelivery, 
      drivers, addDriver, updateDriver, deleteDriver,
      trucks, addTruck, updateTruck, deleteTruck,
      customers, addCustomer, updateCustomer, deleteCustomer,
      fuelings, addFueling,
      maintenances, addMaintenance,
      isAuthenticated, adminLogin, adminLogout,
      authenticatedDriver, driverLogin, driverLogout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
