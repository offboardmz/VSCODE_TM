"use client";

import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/src/integrations/Core";
import { User, IUser } from "@/src/entities/user";
import { Button, GmailModal } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Wand2,
  BookOpen,
  Stars,
  Heart,
  Scroll,
  Github,
  Twitter,
  Mail,
  ArrowRight,
  Play,
  Download,
  LogIn,
  LogOut
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    await User.login();
  };

  const handleLogout = async () => {
    await User.logout();
    setCurrentUser(null);
  };

  const generateFairytale = async () => {
    if (!prompt.trim()) return;
  
    if (!currentUser) {
    alert("Need to LogIn first!");
    return;
  }

    setIsGenerating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Create a magical fairytale based on this idea: "${prompt}".
        Make it enchanting, with vivid imagery, memorable characters, and a heartwarming message.
        Include magical elements, a clear beginning, middle, and satisfying ending.
        Keep it around 200-300 words, suitable for all ages. Simple language, level B1.`,
      });
      setGeneratedStory(response);
    } catch (error) {
      console.error("Error generating fairytale:", error);
    }
    setIsGenerating(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'demo', 'features', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
        style={{
          opacity: headerOpacity,
          background: 'rgba(30, 27, 75, 0.8)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                FairyTale AI
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'demo', label: 'Demo' },
                { id: 'features', label: 'Features' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-yellow-400 bg-white/10'
                      : 'text-white/80 hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-yellow-400/50"
                      layoutId="activeSection"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {isAuthLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full h-full w-full overflow-hidden">
                      <span className="text-white font-bold text-sm text-center px-2">
                          {currentUser.full_name}
                        </span>
                      {/*  <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.picture} alt={currentUser.full_name} className="object-cover h-full w-full" />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-pink-500 text-white font-bold">
                          {currentUser.full_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar> */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/80 border-gray-700 text-white" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.full_name}</p>
                        <p className="text-xs leading-none text-gray-400">{currentUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with Google
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Magic
              </span>
              <br />
              <span className="text-white">
                Storytelling
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your imagination into enchanting fairytales with our AI-powered story generator.
              Create magical worlds, memorable characters, and heartwarming adventures in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection('demo')}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white border-0 text-lg px-8 py-4 rounded-full"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white border-0 text-lg px-8 py-4 rounded-full"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Floating Elements */}
          {/* <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400/60 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div> */}
        </motion.div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Create Your Story
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Enter a simple idea and watch as our AI weaves it into a magical fairytale
            </p>
          </motion.div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-white">
                    What's your story idea?
                  </label>
                  <Input
                    placeholder="e.g., A brave mouse who dreams of becoming a knight..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 text-lg py-4"
                    onKeyPress={(e) => e.key === 'Enter' && generateFairytale()}
                  />
                </div>

                <Button
                  onClick={generateFairytale}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 text-lg py-4 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Wand2 className="w-5 h-5" />
                      </motion.div>
                      Weaving Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Fairytale
                    </>
                  )}
                </Button>

                <AnimatePresence>
                  {generatedStory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Scroll className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-xl font-semibold text-white">Your Fairytale</h3>
                      </div>
                      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                        <p className="text-white/90 leading-relaxed text-lg whitespace-pre-wrap">
                          {generatedStory}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Why Choose FairyTale AI?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Experience the magic of AI-powered storytelling with features designed for endless creativity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Magic",
                description: "Advanced language models create unique, engaging stories tailored to your ideas"
              },
              {
                icon: Heart,
                title: "Family-Friendly",
                description: "All stories are crafted to be wholesome and appropriate for readers of all ages"
              },
              {
                icon: Stars,
                title: "Endless Creativity",
                description: "Generate unlimited stories with infinite possibilities and imaginative scenarios"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  FairyTale AI
                </h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                Bringing magic to storytelling through the power of artificial intelligence.
                Create, share, and enjoy unlimited fairytales.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
              <div className="space-y-3">
                {['Home', 'Demo', 'Features', 'Contact'].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase() === 'home' ? 'hero' : link.toLowerCase())}
                    className="block text-white/70 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Connect With Us</h4>
              <div className="flex gap-4">
                {/* <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </Button> */}
                <GmailModal>  
                  <Button variant="outline" size="icon" 
                        className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white border-0 text-lg px-4 py-4">
                    <Mail className="w-5 h-5" />
                  </Button>
                </GmailModal>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/50">
              © 2025 FairyTale. Made with magic and technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
