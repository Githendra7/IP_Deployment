"use client";

import { useState, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Bell, Save, Moon, Sun, Monitor, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function SettingsContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
  ];

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-[#FDFCFB] font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">Settings</h1>
            <p className="text-zinc-500 font-medium">Manage your account and preferences.</p>
          </header>

          <div className="flex gap-8 border-b border-zinc-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" 
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border rounded-2xl p-8 shadow-sm"
          >
            {activeTab === "profile" && (
              <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">Appearance</h3>
                    <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-zinc-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                {theme === 'dark' ? <Moon className="h-4 w-4 text-zinc-900" /> : <Sun className="h-4 w-4 text-zinc-900" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900">Dark Mode</h4>
                                <p className="text-xs text-zinc-500">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <Switch 
                            checked={theme === "dark"}
                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                    </div>
                </section>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 h-12 rounded-xl flex items-center gap-2"
                    onClick={() => toast.success("Preferences saved successfully!")}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-[#FDFCFB]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
        </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
