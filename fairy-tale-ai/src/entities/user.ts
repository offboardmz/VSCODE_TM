// /entities/user.ts

import { signIn, signOut, getSession } from "next-auth/react";

export interface IUser {
  id: string;
  full_name: string;
  email?: string;
  picture?: string; // URL к аватару пользователя
}

// --- User Entity ---

export class User {
 /**
   * Получить данные текущего пользователя через NextAuth.
   * Использует getSession() для получения session.
   */
  static async me(): Promise<IUser> {
    const session = await getSession();

    if (!session || !session.user) {
      throw new Error("User not authenticated.");
    }

    return {
      id: session.user.email || "unknown", 
      full_name: session.user.name || "Anonymous",
      email: session.user.email || undefined,
      picture: session.user.image || undefined,
    };
  }

  /**
   * Выполнить вход через Google OAuth.
   */
  static async login(): Promise<void> {
    await signIn("google", { callbackUrl: "/" });
  }

  /**
   * Выполнить выход пользователя.
   */
  static async logout(): Promise<void> {
    await signOut({ callbackUrl: "/" });
  }
}