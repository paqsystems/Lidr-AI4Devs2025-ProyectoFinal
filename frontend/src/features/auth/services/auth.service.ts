/**
 * Service: auth.service
 * 
 * Servicio de autenticación del frontend.
 * Maneja las llamadas al API de autenticación y el almacenamiento de tokens.
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */

import { setToken, setUserData, clearAuth, AuthUser } from '../../../shared/utils/tokenStorage';

/**
 * URL base del API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  error: number;
  respuesta: string;
  resultado: {
    token: string;
    user: {
      user_id: number;
      user_code: string;
      tipo_usuario: 'usuario' | 'cliente';
      usuario_id: number | null;
      cliente_id: number | null;
      es_supervisor: boolean;
      nombre: string;
      email: string | null;
    };
  };
}

/**
 * Respuesta de error del API
 */
export interface ApiError {
  error: number;
  respuesta: string;
  resultado: {
    errors?: Record<string, string[]>;
  };
}

/**
 * Resultado del login
 */
export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * Intenta autenticar al usuario con código y contraseña
 * 
 * @param usuario Código de usuario
 * @param password Contraseña
 * @returns Resultado del login con datos del usuario o error
 */
export async function login(usuario: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Error de autenticación o validación
      const errorData = data as ApiError;
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
      };
    }

    // Login exitoso
    const loginData = data as LoginResponse;
    
    // Mapear datos del usuario al formato del frontend
    const authUser: AuthUser = {
      userId: loginData.resultado.user.user_id,
      userCode: loginData.resultado.user.user_code,
      tipoUsuario: loginData.resultado.user.tipo_usuario,
      usuarioId: loginData.resultado.user.usuario_id,
      clienteId: loginData.resultado.user.cliente_id,
      esSupervisor: loginData.resultado.user.es_supervisor,
      nombre: loginData.resultado.user.nombre,
      email: loginData.resultado.user.email,
    };

    // Guardar token y datos del usuario
    setToken(loginData.resultado.token);
    setUserData(authUser);

    return {
      success: true,
      user: authUser,
    };

  } catch (error) {
    // Error de red o inesperado
    console.error('Error en login:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: 'Error de conexión. Intente nuevamente.',
    };
  }
}

/**
 * Cierra la sesión del usuario
 */
export function logout(): void {
  clearAuth();
}
