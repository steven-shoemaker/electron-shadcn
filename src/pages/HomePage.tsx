// HomePage.tsx
import React from "react";
import SimulationComponent from "@/components/Simulation";
import { useTranslation } from "react-i18next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
 
const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
       
        <div className="flex flex-col min-h-screen bg-white">
           
            <main className="flex-grow flex p-8 overflow-hidden">
                <div className="w-full max-w-full overflow-y-auto max-h-[calc(100vh-100px)]">
                    <SimulationComponent />
                </div>
            </main>
            <footer className="w-full p-4 text-center text-gray-500 bg-white">
                © {new Date().getFullYear()} Your Company. All rights reserved.
            </footer>
        </div>
   
    );
};

export default HomePage;