
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DriverPanelContentArea = ({ tabsConfig, defaultTab }) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shadow-sm">
        {tabsConfig.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white dark:data-[state=active]:bg-sky-500 
                       hover:bg-sky-100 dark:hover:bg-slate-700 
                       transition-all duration-150 ease-in-out
                       flex items-center justify-center py-3 text-sm font-medium rounded-md"
          >
            <tab.icon className="mr-2 h-5 w-5" /> {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabsConfig.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6 p-1">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DriverPanelContentArea;
