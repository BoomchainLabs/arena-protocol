import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string) {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getRarityColor(rarity: string) {
  switch (rarity.toLowerCase()) {
    case 'legendary': return 'text-accent border-accent shadow-[0_0_15px_rgba(255,191,0,0.3)]'
    case 'epic': return 'text-secondary border-secondary shadow-[0_0_15px_rgba(191,64,255,0.3)]'
    case 'rare': return 'text-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
    default: return 'text-muted-foreground border-muted-foreground'
  }
}
