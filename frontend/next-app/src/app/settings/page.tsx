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
    <div className="flex h-screen bg-background font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Settings</h1>
            <p className="text-zinc-500 font-medium">Manage your account and preferences.</p>
          </header>

          <div className="flex gap-8 border-b border-zinc-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" 
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
            className="bg-card border border-border rounded-2xl p-8 shadow-sm transition-all"
          >
            {activeTab === "profile" && (
              <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-bold text-foreground mb-4">Appearance</h3>
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg shadow-sm">
                                {theme === 'dark' ? <Moon className="h-4 w-4 text-foreground" /> : <Sun className="h-4 w-4 text-foreground" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Dark Mode</h4>
                                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 rounded-xl flex items-center gap-2 shadow-sm"
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
