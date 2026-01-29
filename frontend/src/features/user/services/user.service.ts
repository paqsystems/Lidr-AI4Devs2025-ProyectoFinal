/**
 * Service: user.service
 * 
 * Servicio de usuario del frontend.
 * Maneja las llamadas al API de perfil de usuario.
 * 
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 */

import { getToken } from '../../../shared/utils/tokenStorage';

/**
 * URL base del API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Datos del perfil de usuario
 */
export interface UserProfile {
  user_code: string;
  nombre: string;
  email: string | null;
  tipo_usuario: 'usuario' | 'cliente' | 'desconocido';
  es_supervisor: boolean;
  created_at: string;
}

/**
 * Respuesta del endpoint de perfil
 */
export interface ProfileResponse {
  error: number;
  respuesta: string;
  resultado: UserProfile;
}

/**
 * Respuesta de error del API
 */
export interface ApiError {
  error: number;
  respuesta: string;
  resultado: {};
}

/**
 * Resultado de obtener perfil
 */
export interface GetProfileResult {
  success: boolean;
  profile?: UserProfile;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * Obtiene el perfil del usuario autenticado
 * 
 * @returns Resultado con datos del perfil o error
 */
export async function getProfile(): Promise<GetProfileResult> {
  const token = getToken();
  
  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: 'No autenticado',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Error de autenticación o servidor
      const errorData = data as ApiError;
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
      };
    }

    // Perfil obtenido exitosamente
    const profileData = data as ProfileResponse;
    
    return {
      success: true,
      profile: profileData.resultado,
    };

  } catch (error) {
    // Error de red o inesperado
    console.error('Error en getProfile:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: 'Error de conexión. Intente nuevamente.',
    };
  }
}
