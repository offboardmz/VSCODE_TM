"use client";

import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/src/integrations/Core";
import { User, IUser } from "@/src/entities/user";
import { Button, GmailModal } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { text, setLang } from "@/src/constants/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { logToSheet } from "@/src/integrations/logtosheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Wand2,
  BookOpen,
  Stars,
  Heart,
  Scroll,
  Mail,
  Play,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<'ru' | 'en'>(() => {
    // Detect browser language on initial load
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'ru' ? 'ru' : 'en';
    }
    return 'en'; // Default to English if window is not available
  });

  // Set initial language based on detection
  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  const handleLanguageChange = (lang: 'ru' | 'en') => {
    setCurrentLang(lang);
    setLang(lang);
  };

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
      alert(text().MESSAGES.NEED_LOGIN);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await InvokeLLM({
        prompt: text().MESSAGES.FAIRYTALE_PROMPT(prompt),
      });
      setGeneratedStory(response);
      logToSheet(
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "",
        currentUser.email || "",
        prompt,
        response
      );
    } catch (error) {
      console.error(text().MESSAGES.ERROR_GENERATE, error);
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
          // Adjust the threshold for when the section is considered active
          return rect.top <= window.innerHeight * 0.2 && rect.bottom >= window.innerHeight * 0.2;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial scroll check to set active section on page load
    handleScroll();
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
            {/* Логотип: иконка + текст (видно на больших экранах) */}
            <motion.div
              className="hidden md:block flex items-center gap-2 md:gap-3" // Применяем классы для адаптивности
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-7 h-7 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              {/* Этот блок с текстом заголовка будет скрыт на мобильных */}
              <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                {text().MAIN.THEME}
              </h1>
            </motion.div>

            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-nowrap">
              {[
                { id: 'hero', label: text().BUTTONS.HOME },
                { id: 'demo', label: text().BUTTONS.DEMO },
                { id: 'features', label: text().BUTTONS.FEATURES },
                { id: 'contact', label: text().BUTTONS.CONTACT },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-2 py-1 sm:px-3 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base flex-shrink min-w-0                              
                  ${activeSection === item.id
                      ? 'text-yellow-400 bg-white/10'
                      : 'text-white/80 hover:text-yellow-400 hover:bg-white/5'
                    }
                `}
                  style={{ fontSize: 'clamp(10px, 3vw, 14px)' }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-yellow-400/50"
                      layoutId="activeSection"
                      transition={{ type: 'spring', duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Language Switcher Radio Group */}
              <RadioGroup
                value={currentLang}
                onValueChange={(value) => handleLanguageChange(value as 'ru' | 'en')}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="ru" id="r1" />
                  <label htmlFor="r1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">RU</label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="en" id="r2" />
                  <label htmlFor="r2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">EN</label>
                </div>
              </RadioGroup>

              {/* Auth Button */}
              {isAuthLoading ? (
                <Skeleton className="w-7 h-7 md:h-10 w-10 rounded-full" />
              ) : currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 rounded-full h-full w-full overflow-hidden"
                    >
                      <span className="text-white hover:text-black font-bold text-sm text-center px-2 ">
                        {currentUser.full_name.charAt(0).toUpperCase()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-gray-900/80 border-gray-700 text-white"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser.full_name}
                        </p>
                        <p className="text-xs leading-none text-gray-400">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer focus:bg-gray-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {/* текст скрыт на мобилках */}
                      <span className="hidden sm:inline">{text().BUTTONS.LOGOUT}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  {/* текст скрыт на мобилках */}
                  <span className="hidden sm:inline">{text().BUTTONS.LOGIN}</span>
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
              <span className="text-sm font-medium">{text().MAIN.POWERED_BY_AI}</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {text().MAIN.FIRST_HEAD_1}
              </span>
              <br />
              <span className="text-white">
                {text().MAIN.FIRST_HEAD_2}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              {text().MAIN.SUB_HEAD}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection('demo')}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white border-0 text-lg px-8 py-4 rounded-full"
              >
                <Play className="w-5 h-5 mr-2" />
                {text().BUTTONS.TRY}
              </Button>

              <Button
                onClick={() => scrollToSection('features')}
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white border-0 text-lg px-8 py-4 rounded-full"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {text().BUTTONS.LEARN}
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
              {text().MAIN.DEMO_HEAD}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {text().MAIN.DEMO_SUB_HEAD}
            </p>
          </motion.div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-white">
                    {text().MAIN.DEMO_BLOCK_HEAD}
                  </label>
                  <Input
                    placeholder={text().MAIN.DEMO_BLOCK_PROMT}
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
                      {text().MAIN.DEMO_LOADING}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {text().BUTTONS.GENERATE}
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
                        <h3 className="text-xl font-semibold text-white">{text().MAIN.DEMO_ANSWER_HEAD}</h3>
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
              {text().MAIN.FEATURES_HEAD}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {text().MAIN.FEATURES_SUB_HEAD}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: text().MAIN.FEATURE_1_HEAD,
                description: text().MAIN.FEATURE_1_DESCR,
              },
              {
                icon: Heart,
                title: text().MAIN.FEATURE_2_HEAD,
                description: text().MAIN.FEATURE_2_DESCR,
              },
              {
                icon: Stars,
                title: text().MAIN.FEATURE_3_HEAD,
                description: text().MAIN.FEATURE_3_DESCR,
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
                  {text().MAIN.THEME}
                </h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                {text().MAIN.FOOTER_ABOUT}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">{text().MAIN.FOOTER_LINKS}</h4>
              <div className="space-y-3">
                {[
                  { id: 'hero', label: text().BUTTONS.HOME },
                  { id: 'demo', label: text().BUTTONS.DEMO },
                  { id: 'features', label: text().BUTTONS.FEATURES },
                  { id: 'contact', label: text().BUTTONS.CONTACT }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block text-white/70 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">{text().MAIN.FOOTER_CONNECT}</h4>
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
