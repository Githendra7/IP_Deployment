"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      console.error("Reset error:", resetError);
      setError(resetError.message);
    } else {
      setMessage("Password reset link has been sent to your email!");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] p-4 font-sans text-foreground">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] bg-card p-10 rounded-2xl shadow-xl border border-border"
      >
        <div className="mb-10">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-bold group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to login
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-3">Forgot password?</h2>
          <p className="text-muted-foreground font-medium">No worries, we'll send you reset instructions.</p>
        </div>

        {message ? (
          <div className="text-center py-4 bg-green-50/50 rounded-2xl p-6 border border-green-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <p className="text-green-700 font-bold mb-6 text-lg">{message}</p>
            <Button 
                onClick={() => setMessage("")} 
                variant="outline" 
                className="w-full h-12 rounded-xl border-green-200 hover:bg-green-50 text-green-700 font-bold"
            >
                Try another email
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
              <Label htmlFor="email" className="text-foreground font-bold pl-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  readOnly
                  required
                  className="pl-10 h-13 border-zinc-100 bg-zinc-50/50 text-zinc-500 cursor-not-allowed transition-all rounded-xl shadow-sm text-lg focus-visible:ring-0"
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-13 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg active:scale-[0.98] group flex justify-center items-center gap-2 text-lg"
                disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <>
                  Send reset link <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
