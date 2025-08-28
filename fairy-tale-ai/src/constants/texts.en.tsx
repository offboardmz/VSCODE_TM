export const APP_TEXTS_EN = {
  
  MAIL: {
     COPIED: "Email address has been copied!",
     COPY_ERROR: "Failed to copy text: "
  },

  BUTTONS: {
    LOGIN: "Login",
    LOGOUT: "Logout",
    COPY: "Copy"
  },

  MESSAGES: {
    NEED_LOGIN: "Need to LogIn first!",
    FAIRYTALE_PROMPT: (prompt: string) =>
      `Create a magical fairytale based on this idea: "${prompt}". 
       Make it enchanting, with vivid imagery, memorable characters, and a heartwarming message. 
       Include magical elements, a clear beginning, middle, and satisfying ending. 
       Keep it around 200-300 words not much, suitable for all ages. Simple language, level B1.`,
    ERROR_GENERATE: "Error generating fairytale:"
  },

    MAIN: {
      SECOND_HEAD: "Transform your imagination into enchanting fairytales with our AI-powered story generator. Create magical worlds, memorable characters, and heartwarming adventures in seconds." 
  },
  } as const;