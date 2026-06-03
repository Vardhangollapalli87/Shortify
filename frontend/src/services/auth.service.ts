const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  authProvider: "credentials" | "google" | "mixed";
  googleId?: string;
  avatarUrl?: string | null;
  isEmailVerified: boolean;
};

export type AuthResponse = {
  success: true;
  data: {
    user: AuthUser;
    accessToken: string;
  };
  message?: string;
};

export const startGoogleOAuth = () => {
  window.location.assign(`${API_BASE_URL}/auth/google`);
};

export const refreshSession = async (): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Unable to refresh session");
  }

  return response.json();
};
