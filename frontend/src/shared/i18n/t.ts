/**
 * Función de traducción t() con fallback obligatorio
 * 
 * Regla: TODOS los textos visibles al usuario DEBEN usar esta función.
 * 
 * @param key - Clave de traducción con notación de puntos (ej: "auth.login.title")
 * @param fallback - Texto legible en español que se muestra si no hay traducción
 * @param params - Parámetros opcionales para interpolación (ej: { count: 5 })
 * @returns Texto traducido o fallback
 * 
 * @example
 * t("auth.login.title", "Iniciar Sesión")
 * t("tasks.summary.totalHours", "Total: {{hours}} horas", { hours: 2.5 })
 */
export function t(key: string, fallback: string, params?: Record<string, any>): string {
  // Por ahora, retorna el fallback directamente
  // En el futuro, aquí se integrará con la librería de i18n elegida (react-i18next, etc.)
  
  if (!fallback) {
    console.warn(`[i18n] Missing fallback for key: ${key}`);
    return key;
  }

  // Interpolación básica de parámetros
  if (params) {
    let result = fallback;
    Object.entries(params).forEach(([paramKey, value]) => {
      const regex = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });
    return result;
  }

  return fallback;
}

