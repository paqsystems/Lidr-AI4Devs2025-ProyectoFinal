/**
 * Service: task.service
 * 
 * Servicio de tareas del frontend.
 * Maneja las llamadas al API de gestión de tareas.
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */

import { getToken } from '../../../shared/utils/tokenStorage';
import { t } from '../../../shared/i18n';

/**
 * URL base del API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Datos de una tarea para crear
 */
export interface CreateTaskData {
  fecha: string; // Formato YMD (YYYY-MM-DD)
  cliente_id: number;
  tipo_tarea_id: number;
  duracion_minutos: number;
  sin_cargo?: boolean;
  presencial?: boolean;
  observacion: string;
  usuario_id?: number | null; // Solo para supervisores
}

/**
 * Datos de una tarea creada
 */
export interface Task {
  id: number;
  usuario_id: number;
  cliente_id: number;
  tipo_tarea_id: number;
  fecha: string; // Formato YMD (YYYY-MM-DD)
  duracion_minutos: number;
  sin_cargo: boolean;
  presencial: boolean;
  observacion: string;
  cerrado: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Datos de un cliente para selector
 */
export interface Client {
  id: number;
  code: string;
  nombre: string;
}

/**
 * Datos de un tipo de tarea para selector
 */
export interface TaskType {
  id: number;
  code: string;
  descripcion: string;
  is_generico: boolean;
}

/**
 * Datos de un empleado para selector
 */
export interface Employee {
  id: number;
  code: string;
  nombre: string;
}

/**
 * Respuesta del API
 */
export interface ApiResponse<T> {
  error: number;
  respuesta: string;
  resultado: T;
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
 * Resultado de crear tarea
 */
export interface CreateTaskResult {
  success: boolean;
  task?: Task;
  errorCode?: number;
  errorMessage?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Resultado de obtener lista
 */
export interface GetListResult<T> {
  success: boolean;
  data?: T[];
  errorCode?: number;
  errorMessage?: string;
}

/**
 * Crea un nuevo registro de tarea
 * 
 * @param taskData Datos de la tarea (fecha en formato YMD)
 * @returns Resultado con datos de la tarea creada o error
 */
export async function createTask(taskData: CreateTaskData): Promise<CreateTaskResult> {
  const token = getToken();
  
  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: t('tasks.service.errors.notAuthenticated', 'No autenticado'),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Error de validación o servidor
      const errorData = data as ApiError;
      
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
        validationErrors: errorData.resultado.errors,
      };
    }

    // Tarea creada exitosamente
    const taskResponse = data as ApiResponse<Task>;
    
    return {
      success: true,
      task: taskResponse.resultado,
    };

  } catch (error) {
    // Error de red o inesperado
    console.error('Error en createTask:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: t('tasks.service.errors.connection', 'Error de conexión. Intente nuevamente.'),
    };
  }
}

/**
 * Obtiene la lista de clientes activos
 * 
 * @returns Resultado con lista de clientes o error
 */
export async function getClients(): Promise<GetListResult<Client>> {
  const token = getToken();
  
  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: t('tasks.service.errors.notAuthenticated', 'No autenticado'),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
      };
    }

    const clientsResponse = data as ApiResponse<Client[]>;
    
    return {
      success: true,
      data: clientsResponse.resultado,
    };

  } catch (error) {
    console.error('Error en getClients:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: t('tasks.service.errors.connection', 'Error de conexión. Intente nuevamente.'),
    };
  }
}

/**
 * Obtiene la lista de tipos de tarea disponibles
 * 
 * @param clienteId ID del cliente (opcional). Si se proporciona, retorna tipos genéricos + asignados al cliente
 * @returns Resultado con lista de tipos de tarea o error
 */
export async function getTaskTypes(clienteId?: number): Promise<GetListResult<TaskType>> {
  const token = getToken();
  
  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: t('tasks.service.errors.notAuthenticated', 'No autenticado'),
    };
  }

  try {
    const url = clienteId 
      ? `${API_BASE_URL}/v1/tasks/task-types?cliente_id=${clienteId}`
      : `${API_BASE_URL}/v1/tasks/task-types`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
      };
    }

    const taskTypesResponse = data as ApiResponse<TaskType[]>;
    
    return {
      success: true,
      data: taskTypesResponse.resultado,
    };

  } catch (error) {
    console.error('Error en getTaskTypes:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: t('tasks.service.errors.connection', 'Error de conexión. Intente nuevamente.'),
    };
  }
}

/**
 * Obtiene la lista de empleados activos (solo para supervisores)
 * 
 * @returns Resultado con lista de empleados o error
 */
export async function getEmployees(): Promise<GetListResult<Employee>> {
  const token = getToken();
  
  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: t('tasks.service.errors.notAuthenticated', 'No autenticado'),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      return {
        success: false,
        errorCode: errorData.error,
        errorMessage: errorData.respuesta,
      };
    }

    const employeesResponse = data as ApiResponse<Employee[]>;
    
    return {
      success: true,
      data: employeesResponse.resultado,
    };

  } catch (error) {
    console.error('Error en getEmployees:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: t('tasks.service.errors.connection', 'Error de conexión. Intente nuevamente.'),
    };
  }
}
