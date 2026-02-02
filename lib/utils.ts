/**
 * Utilitaire de fusion de classes CSS
 * Combine clsx et tailwind-merge pour gérer les conflits de classes
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Fusionne les classes CSS en évitant les conflits Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
