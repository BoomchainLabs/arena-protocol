import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "wouter"
import { TerminalSquare, Swords, Users, Activity, Hexagon } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden clip-edges border border-primary/30 p-8 md:p-16 lg:p-24 min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/cyber-city-bg.png`} 
            alt="Cyber City" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary text-primary text-xs font-mono mb-6 clip-edges">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              SYSTEM_ONLINE // BASE MAINNET
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white text-shadow-sm uppercase leading-tight">
              Enter The <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                Cyber Arena
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 font-mono max-w-xl">
              Mint augmented fighters, battle in high-stakes arenas, and climb the global ranks to earn $ARENA tokens.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/mint" className="block">
                <Button size="lg" className="text-lg w-full sm:w-auto">
                  <TerminalSquare className="mr-2 h-5 w-5" />
                  INITIALIZE FIGHTER
                </Button>
              </Link>
              <Link href="/arena" className="block">
                <Button variant="cyber" size="lg" className="text-lg w-full sm:w-auto">
                  <Swords className="mr-2 h-5 w-5" />
                  ENTER ARENA
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/40 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-primary/10 clip-edges">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">ACTIVE FIGHTERS</p>
                <p className="text-3xl font-display font-bold text-white neon-text">12,408</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/40 border-secondary/20 hover:border-secondary/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-secondary/10 clip-edges">
                <Activity className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">TOTAL BATTLES</p>
                <p className="text-3xl font-display font-bold text-white shadow-secondary">842,105</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/40 border-accent/20 hover:border-accent/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-accent/10 clip-edges">
                <Hexagon className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">$ARENA REWARDS</p>
                <p className="text-3xl font-display font-bold text-white shadow-accent">1.2M+</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TerminalSquare className="text-primary" /> SYSTEM_MODULES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/leaderboard" className="group block">
            <div className="relative overflow-hidden clip-edges border border-border/50 bg-card p-8 transition-all hover:border-primary">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">LEADERBOARD</h3>
              <p className="text-muted-foreground font-mono text-sm max-w-[80%]">View top ranked players, global win rates, and highest earners in the protocol.</p>
            </div>
          </Link>
          
          <Link href="/marketplace" className="group block">
            <div className="relative overflow-hidden clip-edges border border-border/50 bg-card p-8 transition-all hover:border-secondary">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Store className="w-32 h-32 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">MARKETPLACE</h3>
              <p className="text-muted-foreground font-mono text-sm max-w-[80%]">Trade augmented fighters with other players. Acquire legendary tier assets.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
// Required imports for icons
import { Trophy, Store } from "lucide-react"
