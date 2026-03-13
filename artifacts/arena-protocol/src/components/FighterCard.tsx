import { cn, getRarityColor } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Activity, Brain, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface FighterCardProps {
  id: string
  image: string
  rarity: string
  stats: {
    strength: number
    speed: number
    intelligence: number
  }
  wins?: number
  losses?: number
  price?: string
  onClick?: () => void
  selected?: boolean
}

export function FighterCard({ id, image, rarity, stats, wins, losses, price, onClick, selected }: FighterCardProps) {
  const rarityClass = getRarityColor(rarity)
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "relative bg-card/60 backdrop-blur-sm border clip-edges p-1 cursor-pointer transition-all duration-300 group overflow-hidden",
        selected ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]" : "border-border/50 hover:border-primary/50"
      )}
    >
      {/* Background glow based on rarity */}
      <div className={cn(
        "absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity",
        rarity === 'Legendary' ? 'bg-accent' : 
        rarity === 'Epic' ? 'bg-secondary' : 
        rarity === 'Rare' ? 'bg-blue-500' : 'bg-muted'
      )} />

      <div className="relative clip-edges bg-black aspect-square overflow-hidden mb-3">
        <img src={image} alt={`Fighter ${id}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute top-2 right-2">
          <Badge className={cn("bg-black/80 backdrop-blur-md", rarityClass)}>
            {rarity}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/80 text-white font-mono text-xs px-2 py-1 clip-edges border border-white/10">
          #{id}
        </div>
      </div>

      <div className="px-3 pb-3 relative z-10">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center bg-background/80 p-1.5 clip-edges border border-border/50">
            <Shield className="w-4 h-4 text-red-400 mb-1" />
            <span className="font-mono text-sm font-bold">{stats.strength}</span>
          </div>
          <div className="flex flex-col items-center bg-background/80 p-1.5 clip-edges border border-border/50">
            <Zap className="w-4 h-4 text-yellow-400 mb-1" />
            <span className="font-mono text-sm font-bold">{stats.speed}</span>
          </div>
          <div className="flex flex-col items-center bg-background/80 p-1.5 clip-edges border border-border/50">
            <Brain className="w-4 h-4 text-blue-400 mb-1" />
            <span className="font-mono text-sm font-bold">{stats.intelligence}</span>
          </div>
        </div>

        {(wins !== undefined || losses !== undefined) && (
          <div className="flex justify-between items-center text-xs font-mono text-muted-foreground border-t border-border/30 pt-2">
            <span className="text-green-400">W: {wins || 0}</span>
            <Activity className="w-3 h-3" />
            <span className="text-red-400">L: {losses || 0}</span>
          </div>
        )}

        {price && (
          <div className="mt-2 text-center bg-primary/10 border border-primary/30 py-1.5 text-primary font-bold clip-edges">
            {price} ARENA
          </div>
        )}
      </div>
    </motion.div>
  )
}
