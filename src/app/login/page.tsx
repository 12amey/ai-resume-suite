"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("OTP sent to your email!");
      
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&otp=${data.otp || ''}`);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2Mmgtdi0yem0wIDZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yem0tNi02aDJ2MmgtMnYtMnptMCA2aDJ2MmgtMnYtMnptMCA2aDJ2MmgtMnYtMnptMC02aDJ2MmgtMnYtMnptLTYgMGgydjJoLTJ2LTJ6bTAgNmgydjJoLTJ2LTJ6bTAgNmgydjJoLTJ2LTJ6bS02LTZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yem0wIDZoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Animated Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 150, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-white/20">
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 mb-4 shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <LogIn className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to continue to your resume builder
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                <div className="relative mt-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500 z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-base border-2 border-purple-200 focus:border-purple-500 dark:border-purple-800 dark:focus:border-purple-500 transition-all duration-300 hover:border-purple-400"
                      required
                    />
                  </motion.div>
                </div>
                <motion.p 
                  className="text-sm text-muted-foreground mt-2 flex items-center gap-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  We'll send you a one-time password to verify your identity
                </motion.p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div 
              className="relative my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gradient-to-r from-purple-200 via-blue-200 to-cyan-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-muted-foreground font-medium">
                  Don't have an account?
                </span>
              </div>
            </motion.div>

            {/* Register Link */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-base font-semibold border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                    Create Account
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-center text-sm text-white/80 mt-6 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}