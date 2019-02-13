export enum AuthStatus {
	SignedOut = 0,
	SignedIn = 1,
	Authenticating = 2
}

export interface AuthRequest { username: string, password: string }

export interface AuthResponse { token: string }
