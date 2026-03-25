"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, UserPlus, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { register as apiRegister } from "@/lib/api";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, login: authLogin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const data = await apiRegister(email, password);
      authLogin(data.access_token);
      setSuccess(true);
      // Success state will show success message
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white border border-border rounded-2xl shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-50 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Registration Successful!</h2>
          <p className="text-zinc-600 mb-8">
            Please check your email to confirm your account. You will be redirected to the login page in a few seconds.
          </p>
          <Button onClick={() => router.push("/login")} variant="outline" className="w-full h-12 rounded-xl text-lg font-bold">
            Go to login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen lg:grid lg:grid-cols-2 bg-background font-sans">
      {/* Left side: Visuals */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
             <div className="bg-white rounded-lg p-2">
                <div className="h-6 w-6 border-2 border-zinc-900 rounded-sm"></div>
             </div>
             <span className="text-2xl font-bold tracking-tight">ProtoStruc</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start your journey today.
            </h1>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-zinc-400 mt-1" />
                <p className="text-zinc-400 text-lg">Unlimited project creation and decomposition.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-zinc-400 mt-1" />
                <p className="text-zinc-400 text-lg">Collaborative morphological analysis tools.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-zinc-400 mt-1" />
                <p className="text-zinc-400 text-lg">AI-powered risk assessment insights.</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500 font-medium">
          <span>© 2026 ProtoStruc Inc.</span>
          <span>•</span>
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-zinc-800/20 to-transparent rounded-full blur-3xl -z-0"></div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFCFB]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-10 lg:hidden flex justify-center">
             <div className="flex items-center gap-2">
                <div className="bg-zinc-900 rounded-lg p-2 text-white">
                  <div className="h-4 w-4 border-2 border-white rounded-sm"></div>
                </div>
                <span className="text-xl font-bold tracking-tight">ProtoStruc</span>
             </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Create an account</h2>
            <p className="text-zinc-500 font-medium">Get started with ProtoStruc for free.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-start gap-3 text-sm font-medium"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-zinc-200 focus:border-zinc-900 transition-all rounded-xl shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 font-bold">Set Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 border-zinc-200 focus:border-zinc-900 transition-all rounded-xl shadow-sm"
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
              <Label htmlFor="confirmPassword" className="text-zinc-700 font-bold">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 border-zinc-200 focus:border-zinc-900 transition-all rounded-xl shadow-sm"
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
              className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all shadow-lg shadow-zinc-200 active:scale-[0.98] mt-2 group" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign up <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-900 font-bold hover:underline">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
