import type { SignUpDto, SignInDto, UserSession, UserProfile } from "../../types/chat";
import { getApiUrl, STORAGE_KEYS, fetchDeduplicated } from "./client";

export const AuthApi = {
  async signUp(data: SignUpDto): Promise<UserSession> {
    const res = await fetch(getApiUrl('/auth/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password || 'password123',
        first_name: data.first_name,
        last_name: data.last_name,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'An account with this email address already exists or sign up failed.');
    }

    const user = await res.json();
    const session: UserSession = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      token: user.token || `mock-jwt-token-${Math.random().toString(36).substring(2)}`,
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(session));
    return session;
  },

  async login(data: SignInDto): Promise<UserSession> {
    const res = await fetch(getApiUrl('/auth/signin'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Invalid email or password. Please verify your credentials.');
    }

    const user = await res.json();
    if (!user) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    const session: UserSession = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      token: user.token || `mock-jwt-token-${Math.random().toString(36).substring(2)}`,
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(session));
    return session;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },

  getActiveSession(): UserSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async getUserDetails(email: string): Promise<UserProfile> {
    const res = await fetchDeduplicated(getApiUrl(`/auth/user-details?email=${encodeURIComponent(email)}`));
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to retrieve user details.');
    }
    return res.json();
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const res = await fetch(getApiUrl('/auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        new_password: newPassword,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to reset password. Please verify your email.');
    }
  },
};
