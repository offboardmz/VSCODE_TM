// /entities/user.ts

/**
 * Интерфейс, описывающий структуру объекта пользователя.
 * В реальном приложении он должен соответствовать данным,
 * которые приходят от вашего API.
 */
export interface IUser {
  id: string;
  full_name: string;
  email?: string;
  picture?: string; // URL к аватару пользователя
}

// --- MOCK IMPLEMENTATION ---
// Этот раздел имитирует ответы от сервера.
// В реальном проекте здесь будут вызовы к вашему API (например, с помощью fetch или axios).

const MOCK_USER: IUser = {
  id: "12345-abcde",
  full_name: "Alex Starr",
  email: "alex.starr@example.com",
  // Используем сервис для получения случайного аватара
  picture: "https://i.pravatar.cc/150?u=alexstarr", 
};

const LOCAL_STORAGE_KEY = 'currentUser';

/**
 * Имитирует задержку сети для асинхронных операций.
 * @param ms - время задержки в миллисекундах.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// --- User Entity ---
// Класс для управления данными и состоянием пользователя.

export class User {
  /**
   * Статический метод для получения данных текущего аутентифицированного пользователя.
   * В реальном приложении этот метод будет отправлять запрос на эндпоинт типа `/api/auth/me`
   * для проверки сессии (например, по http-only cookie) и получения данных пользователя.
   *
   * @returns {Promise<IUser>} - Данные пользователя, если он залогинен.
   * @throws {Error} - Если пользователь не аутентифицирован.
   */
  static async me(): Promise<IUser> {
    console.log("User.me() called: Checking session...");
    await sleep(500); // Имитация задержки сети

    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        console.log("User found in localStorage.");
        return JSON.parse(storedUser) as IUser;
      }
      throw new Error("User not authenticated.");
    } catch (error) {
      console.error("Authentication check failed.");
      throw new Error("User not authenticated.");
    }
  }

  /**
   * Статический метод для выполнения входа пользователя.
   * В реальном приложении здесь будет логика редиректа на страницу провайдера аутентификации (Google, GitHub и т.д.)
   * или отправка запроса на логин с email/паролем.
   *
   * @returns {Promise<void>}
   */
  static async login(): Promise<void> {
    console.log("User.login() called: Simulating Google OAuth flow...");
    await sleep(1000); // Имитация задержки сети и процесса входа

    // В этой имитации мы просто "создаем" сессию, сохраняя данные пользователя.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_USER));
    
    console.log("Login successful. Mock user saved to localStorage.");
    // В реальном приложении после успешного логина обычно происходит перезагрузка страницы
    // или редирект, чтобы приложение обновило состояние.
    window.location.reload(); 
  }

  /**
   * Статический метод для выхода пользователя из системы.
   * В реальном приложении этот метод будет отправлять запрос на эндпоинт `/api/auth/logout`.
   *
   * @returns {Promise<void>}
   */
  static async logout(): Promise<void> {
    console.log("User.logout() called: Clearing session...");
    await sleep(300); // Имитация задержки сети

    // Удаляем "сессию"
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log("Logout successful. User data removed from localStorage.");
  }
}