import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'OPERATIONAL':
      return 'bg-green-500'
    case 'DEGRADED':
      return 'bg-yellow-500'
    case 'PARTIAL_OUTAGE':
      return 'bg-orange-500'
    case 'MAJOR_OUTAGE':
      return 'bg-red-500'
    case 'MAINTENANCE':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function getStatusLabel(status: string) {
  return status.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}