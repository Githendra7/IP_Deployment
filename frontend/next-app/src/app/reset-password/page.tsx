"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Save, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password,
      });

      if (resetError) throw resetError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] p-4 font-sans text-foreground">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-card p-10 rounded-2xl shadow-xl border border-border"
      >
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/5 rounded-full mb-6 text-primary">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Set new password</h2>
          <p className="text-muted-foreground font-medium">Please enter your new password below.</p>
        </div>

        {success ? (
          <div className="text-center py-6 bg-green-50/50 rounded-2xl border border-green-100 p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">Password updated!</h3>
            <p className="text-green-700 font-medium mb-8 leading-relaxed">
              Your password has been changed successfully. We'll redirect you to login in a few seconds.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full h-12 rounded-xl text-lg font-bold bg-green-600 hover:bg-green-700">
              Go to login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-start gap-3 text-sm font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-bold pl-1">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-13 border-border focus:border-primary transition-all rounded-xl shadow-sm text-lg"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 focus:outline-none"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-bold pl-1">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-13 border-border focus:border-primary transition-all rounded-xl shadow-sm text-lg"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 focus:outline-none"
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-13 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg active:scale-[0.98] mt-4 flex justify-center items-center gap-2 text-lg group"
                disabled={loading}
            >
              {loading ? "Updating..." : (
                <>
                  Update Password <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
