import {
  DonationRequest,
  Volunteer,
  AuthUser,
  RegisteredUser,
  ChatMessage,
  NotificationAlert,
  UserRole
} from '../types/foodbridge';

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[API] Network error calling ${endpoint}:`, error);
    return null;
  }
}

export const api = {
  // Health / DB status check
  async checkHealth(): Promise<{ status: string; database: string } | null> {
    return fetchJson('/health');
  },

  // Auth & Users
  auth: {
    async getUsers(): Promise<RegisteredUser[] | null> {
      return fetchJson<RegisteredUser[]>('/auth/users');
    },

    async login(email: string, role: UserRole, password?: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role, password })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to connect to backend server' };
      }
    },

    async register(userData: Omit<RegisteredUser, 'id'>): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to connect to backend server' };
      }
    },

    async updateUser(id: string, data: Partial<RegisteredUser>): Promise<{ success: boolean; user?: RegisteredUser } | null> {
      return fetchJson(`/auth/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  // Requests & Donations
  requests: {
    async getAll(): Promise<DonationRequest[] | null> {
      return fetchJson<DonationRequest[]>('/requests');
    },

    async create(requestData: Partial<DonationRequest>): Promise<{ success: boolean; request?: DonationRequest } | null> {
      return fetchJson('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
    },

    async update(id: string, updateData: Partial<DonationRequest>): Promise<{ success: boolean; request?: DonationRequest } | null> {
      return fetchJson(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    },

    async delete(id: string): Promise<{ success: boolean } | null> {
      return fetchJson(`/requests/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Volunteers
  volunteers: {
    async getAll(): Promise<Volunteer[] | null> {
      return fetchJson<Volunteer[]>('/volunteers');
    },

    async sync(volData: Partial<Volunteer>): Promise<{ success: boolean; volunteer?: Volunteer } | null> {
      return fetchJson('/volunteers', {
        method: 'POST',
        body: JSON.stringify(volData)
      });
    },

    async update(id: string, updateData: Partial<Volunteer>): Promise<{ success: boolean; volunteer?: Volunteer } | null> {
      return fetchJson(`/volunteers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    }
  },

  // Chat
  chats: {
    async getForRequest(requestId: string): Promise<ChatMessage[] | null> {
      return fetchJson<ChatMessage[]>(`/chats/${requestId}`);
    },

    async send(message: Partial<ChatMessage>): Promise<{ success: boolean; message?: ChatMessage } | null> {
      return fetchJson('/chats', {
        method: 'POST',
        body: JSON.stringify(message)
      });
    }
  },

  // Notifications
  notifications: {
    async get(role?: string, recipientId?: string): Promise<NotificationAlert[] | null> {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (recipientId) params.append('recipientId', recipientId);
      return fetchJson<NotificationAlert[]>(`/notifications?${params.toString()}`);
    },

    async send(notification: Partial<NotificationAlert>): Promise<{ success: boolean; notification?: NotificationAlert } | null> {
      return fetchJson('/notifications', {
        method: 'POST',
        body: JSON.stringify(notification)
      });
    },

    async clear(id: string): Promise<{ success: boolean } | null> {
      return fetchJson(`/notifications/${id}`, {
        method: 'DELETE'
      });
    }
  }
};
