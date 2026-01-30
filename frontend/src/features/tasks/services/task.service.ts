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
 * Item de tarea en la lista (con cliente/tipo anidados y observación truncada)
 */
export interface TaskListItem {
  id: number;
  fecha: string;
  cliente: { id: number; nombre: string };
  tipo_tarea: { id: number; nombre: string };
  duracion_minutos: number;
  duracion_horas: string;
  sin_cargo: boolean;
  presencial: boolean;
  observacion: string;
  cerrado: boolean;
  created_at: string;
}

/**
 * Parámetros de filtro para listar tareas
 */
export interface TaskListParams {
  page?: number;
  per_page?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  cliente_id?: number | null;
  tipo_tarea_id?: number | null;
  usuario_id?: number | null;
  busqueda?: string;
  ordenar_por?: string;
  orden?: 'asc' | 'desc';
}

/**
 * Respuesta paginada del API de lista de tareas
 */
export interface TaskListResult {
  data: TaskListItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  totales: {
    cantidad_tareas: number;
    total_horas: number;
  };
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

/**
 * Obtiene la lista paginada de tareas del usuario con filtros
 *
 * @param params Parámetros de paginación y filtros
 * @returns Resultado con data, pagination, totales o error
 */
export async function getTasks(params: TaskListParams = {}): Promise<GetTasksResult> {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      errorCode: 4001,
      errorMessage: t('tasks.service.errors.notAuthenticated', 'No autenticado'),
    };
  }

  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.per_page != null) searchParams.set('per_page', String(params.per_page));
  if (params.fecha_desde) searchParams.set('fecha_desde', params.fecha_desde);
  if (params.fecha_hasta) searchParams.set('fecha_hasta', params.fecha_hasta);
  if (params.cliente_id != null && params.cliente_id !== '' && params.cliente_id !== undefined) searchParams.set('cliente_id', String(params.cliente_id));
  if (params.tipo_tarea_id != null && params.tipo_tarea_id !== '' && params.tipo_tarea_id !== undefined) searchParams.set('tipo_tarea_id', String(params.tipo_tarea_id));
  if (params.usuario_id != null && params.usuario_id !== '' && params.usuario_id !== undefined) searchParams.set('usuario_id', String(params.usuario_id));
  if (params.busqueda) searchParams.set('busqueda', params.busqueda);
  if (params.ordenar_por) searchParams.set('ordenar_por', params.ordenar_por);
  if (params.orden) searchParams.set('orden', params.orden);

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/v1/tasks${queryString ? `?${queryString}` : ''}`;

  try {
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

    const result = data as ApiResponse<TaskListResult>;
    const r = result.resultado;

    return {
      success: true,
      data: r.data,
      pagination: r.pagination,
      totales: r.totales,
    };
  } catch (error) {
    console.error('Error en getTasks:', error);
    return {
      success: false,
      errorCode: 9999,
      errorMessage: t('tasks.service.errors.connection', 'Error de conexión. Intente nuevamente.'),
    };
  }
}
