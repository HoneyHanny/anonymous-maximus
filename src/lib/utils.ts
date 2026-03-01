import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Copied successfully')
  } catch (err) {
    try {
      document.execCommand(text) // Fallback / backwards compatibility
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}
