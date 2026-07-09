export type HealthResponse = {
  service: string;
  version: string;
  status: string;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  displayName: string;
};

export type AuthResponse = {
  user: AuthenticatedUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || "http://localhost:8000").replace(/\/$/, "");
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/api/v1/health");
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async me(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/me");
  }

  async logout(): Promise<void> {
    await this.request<void>("/api/v1/auth/logout", { method: "POST" });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers
      },
      ...init
    });

    if (!response.ok) {
      throw new Error(await errorMessage(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") {
      return body.detail;
    }
  } catch {
    return `Request failed with ${response.status}`;
  }

  return `Request failed with ${response.status}`;
}
