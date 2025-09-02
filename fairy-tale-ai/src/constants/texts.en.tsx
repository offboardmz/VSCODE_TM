export const APP_TEXTS_EN = {
  
  MAIL: {
     COPIED: "Email address has been copied!",
     COPY_ERROR: "Failed to copy text: "
  },

  BUTTONS: {
    LOGIN: "Login",
    LOGOUT: "Logout",
    COPY: "Copy",
    HOME: "Home",
    DEMO: "Demo",
    FEATURES: "Features",
    CONTACT: "Contact",   
    TRY: "Try Demo",
    LEARN: "Learn More",
    GENERATE: "Generate Fairytale",

  },

  MESSAGES: {
    NEED_LOGIN: "Need to Login first",
    FAIRYTALE_PROMPT: (prompt: string) =>
      `Create a magical fairytale based on this idea: "${prompt}". 
       Make it enchanting, with vivid imagery, memorable characters, and a heartwarming message. 
       Include magical elements, a clear beginning, middle, and satisfying ending. 
       Keep it around 200-300 words not much, suitable for all ages. Simple language, level B1.`,
    ERROR_GENERATE: "Error generating fairytale:"
  },

    MAIN: {
      THEME: "FairyTale AI",
      POWERED_BY_AI: "Powered by AI",
      FIRST_HEAD_1: "Magic",
      FIRST_HEAD_2: "Storytelling",
      SUB_HEAD: "Transform your imagination into enchanting fairytales with our AI-powered story generator. Create magical worlds, memorable characters, and heartwarming adventures in seconds." ,
      
      DEMO_HEAD: "Create Your Story",
      DEMO_SUB_HEAD: "Enter a simple idea and watch as our AI weaves it into a magical fairytale",

      DEMO_BLOCK_HEAD: "What's your story idea?",
      DEMO_BLOCK_PROMT: "e.g., A brave mouse who dreams of becoming a knight...",
      DEMO_LOADING: "Weaving Magic...",
      DEMO_ANSWER_HEAD: "Your Fairytale",

      FEATURES_HEAD: "Why Choose FairyTale AI?",
      FEATURES_SUB_HEAD: "Experience the magic of AI-powered storytelling with features designed for endless creativity",
      FEATURE_1_HEAD: "AI-Powered Magic",
      FEATURE_1_DESCR: "Advanced language models create unique, engaging stories tailored to your ideas",
      FEATURE_2_HEAD: "Family-Friendly",
      FEATURE_2_DESCR: "All stories are crafted to be wholesome and appropriate for readers of all ages",
      FEATURE_3_HEAD: "Endless Creativity",
      FEATURE_3_DESCR: "Generate unlimited stories with infinite possibilities and imaginative scenarios",

      FOOTER_ABOUT: "Bringing magic to storytelling through the power of artificial intelligence. Create, share, and enjoy unlimited fairytales.",
      FOOTER_LINKS: "Quick Links",
      FOOTER_CONNECT: "Connect with Us",
  },
  } as const;