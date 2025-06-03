/**
 * Utilidades para manejo de fechas en zona horaria de Colombia
 */

/**
 * Convierte una fecha a la zona horaria de Colombia (America/Bogota)
 * @param date - Fecha a convertir (Date, string o null)
 * @returns String con fecha en formato ISO con zona horaria de Colombia o null
 */
export function toColombianTime(date: Date | string | null): string | null {
  if (!date) return null;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      console.warn("Fecha inválida recibida:", date);
      return null;
    }

    // Formatear en zona horaria de Colombia
    return (
      dateObj
        .toLocaleString("sv-SE", {
          timeZone: "America/Bogota",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(" ", "T") + "-05:00"
    ); // Colombia está en UTC-5
  } catch (error) {
    console.error(
      "Error al convertir fecha a zona horaria de Colombia:",
      error
    );
    return null;
  }
}

/**
 * Obtiene la fecha y hora actual en zona horaria de Colombia
 * @returns String con fecha actual en formato ISO con zona horaria de Colombia
 */
export function getCurrentColombianTime(): string {
  return toColombianTime(new Date()) || new Date().toISOString();
}

/**
 * Convierte múltiples campos de fecha de un objeto
 * @param obj - Objeto que contiene campos de fecha
 * @param dateFields - Array con los nombres de los campos que son fechas
 * @returns Objeto con fechas convertidas a zona horaria de Colombia
 */
export function convertDateFieldsToColombianTime<T>(
  obj: T,
  dateFields: (keyof T)[]
): T {
  const result = { ...obj };

  dateFields.forEach((field) => {
    const value = obj[field];
    if (value && (typeof value === "string" || value instanceof Date)) {
      (result[field] as any) = toColombianTime(value as any);
    }
  });

  return result;
}
