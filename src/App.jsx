
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ManageDriversPage from '@/pages/ManageDriversPage';
import ManageTrucksPage from '@/pages/ManageTrucksPage';
import ManageCustomersPage from '@/pages/ManageCustomersPage';
import DriverLoginPage from '@/pages/DriverLoginPage';
import DriverPanelPage from '@/pages/DriverPanelPage'; 
import NotFoundPage from '@/pages/NotFoundPage';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { GlassWater as Water, Truck, Users, LogOut, UserCog, LogIn, Wrench, Fuel, UserCircle, Building, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProtectedRoute = ({ children, adminOnly = true }) => {
  const { isAuthenticated, authenticatedDriver } = useAppContext();
  if (adminOnly && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!adminOnly && !authenticatedDriver && !isAuthenticated) {
    return <Navigate to="/driver-login" />;
  }
  return children;
};

const AppLayout = () => {
  const { isAuthenticated, adminLogout, authenticatedDriver, driverLogout } = useAppContext();

  const handleLogout = () => {
    if (isAuthenticated) {
      adminLogout();
    } else if (authenticatedDriver) {
      driverLogout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950 text-slate-800 dark:text-slate-200">
      <header className="py-4 px-6 shadow-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to={authenticatedDriver ? "/driver-panel" : (isAuthenticated ? "/admin" : "/")} className="flex items-center space-x-2 text-2xl font-bold text-sky-600 dark:text-sky-400">
            <Water size={32} />
            <span>AquaFlow Entregas</span>
          </Link>
          <nav className="flex space-x-1 sm:space-x-2 items-center">
             {!isAuthenticated && !authenticatedDriver && (
               <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                <Link to="/" className="flex items-center space-x-1">
                  <Home size={18} /> 
                  <span className="hidden sm:inline">Início</span>
                </Link>
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/admin" className="flex items-center space-x-1">
                    <Users size={18} />
                    <span className="hidden sm:inline">Painel Admin</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/admin/customers" className="flex items-center space-x-1">
                    <Building size={18} />
                    <span className="hidden sm:inline">Clientes</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/admin/drivers" className="flex items-center space-x-1">
                    <UserCog size={18} />
                    <span className="hidden sm:inline">Motoristas</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/admin/trucks" className="flex items-center space-x-1">
                    <Truck size={18} />
                    <span className="hidden sm:inline">Caminhões</span>
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="hover:text-red-500 transition-colors flex items-center space-x-1 text-xs sm:text-sm">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sair Admin</span>
                </Button>
              </>
            ) : authenticatedDriver ? (
              <>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/driver-panel" className="flex items-center space-x-1">
                    <Wrench size={18} />
                    <span className="hidden sm:inline">Meu Painel</span>
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="hover:text-red-500 transition-colors flex items-center space-x-1 text-xs sm:text-sm">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sair ({authenticatedDriver.name.split(' ')[0]})</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/driver-login" className="flex items-center space-x-1">
                    <UserCircle size={18} />
                    <span className="hidden sm:inline">Login Motorista</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="hover:text-sky-500 transition-colors text-xs sm:text-sm">
                  <Link to="/login" className="flex items-center space-x-1">
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Login Admin</span>
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={ <Navigate to={authenticatedDriver ? "/driver-panel" : (isAuthenticated ? "/admin" : "/driver-login")} /> } />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/driver-login" element={<DriverLoginPage />} />
          <Route 
            path="/driver-panel" 
            element={
              <ProtectedRoute adminOnly={false}>
                <DriverPanelPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/drivers" element={<ProtectedRoute><ManageDriversPage /></ProtectedRoute>} />
          <Route path="/admin/trucks" element={<ProtectedRoute><ManageTrucksPage /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute><ManageCustomersPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
        © {new Date().getFullYear()} AquaFlow Entregas. Todos os direitos reservados.
      </footer>
    </div>
  );
}


const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
        <Toaster />
      </Router>
    </AppProvider>
  );
};

export default App;
