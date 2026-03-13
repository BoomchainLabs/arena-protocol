import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FighterCard } from "@/components/FighterCard"
import { Swords, User, Bot, Skull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRecordBattle } from "@workspace/api-client-react"
import { useMockAccount } from "@/lib/wagmi"
import { motion, AnimatePresence } from "framer-motion"

// Mock user fighters
const myFighters = [
  {
    id: "1042",
    image: `${import.meta.env.BASE_URL}images/fighter-1.png`,
    rarity: "Epic",
    stats: { strength: 85, speed: 60, intelligence: 70 },
    wins: 12, losses: 4
  },
  {
    id: "891",
    image: `${import.meta.env.BASE_URL}images/fighter-2.png`,
    rarity: "Rare",
    stats: { strength: 40, speed: 90, intelligence: 65 },
    wins: 5, losses: 8
  }
]

export default function Arena() {
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null)
  const [mode, setMode] = useState<'PVE' | 'PVP'>('PVE')
  const [battleState, setBattleState] = useState<'IDLE' | 'FIGHTING' | 'RESULT'>('IDLE')
  const [result, setResult] = useState<{win: boolean, reward: string} | null>(null)
  
  const { address } = useMockAccount()
  const { toast } = useToast()
  
  const { mutateAsync: recordBattle } = useRecordBattle()

  const handleBattle = async () => {
    if (!selectedFighter) return
    if (!address) {
      toast({ title: "Error", description: "Connect wallet first", variant: "destructive" })
      return
    }

    setBattleState('FIGHTING')

    // Simulate battle duration
    setTimeout(async () => {
      const isWin = Math.random() > 0.5
      const reward = isWin ? "18" : "0"
      
      setResult({ win: isWin, reward })
      setBattleState('RESULT')

      // Record to backend API
      try {
        await recordBattle({
          data: {
            player: address,
            fighterId: selectedFighter,
            win: isWin,
            reward: reward,
            mode: mode,
            txHash: "0xmocktxhash" + Date.now()
          }
        })
      } catch (err) {
        console.error("Failed to record battle", err)
      }
    }, 4000)
  }

  const resetArena = () => {
    setBattleState('IDLE')
    setResult(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-destructive/10 clip-edges border border-destructive/30">
          <Swords className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-destructive">Battle Arena</h1>
          <p className="text-muted-foreground font-mono text-sm">Risk $ARENA. Destroy opponents. Claim rewards.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {battleState === 'IDLE' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Fighter Selection */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-mono text-primary uppercase tracking-widest border-b border-border/50 pb-2">Select Combatant</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {myFighters.map(f => (
                    <FighterCard 
                      key={f.id} 
                      {...f} 
                      onClick={() => setSelectedFighter(f.id)}
                      selected={selectedFighter === f.id}
                    />
                  ))}
                  {/* Empty slot */}
                  <div className="border border-dashed border-border/50 clip-edges flex flex-col items-center justify-center p-6 opacity-50 cursor-not-allowed">
                    <User className="w-8 h-8 mb-2" />
                    <span className="font-mono text-xs text-center uppercase">Empty Slot<br/>Go to Lab to Mint</span>
                  </div>
                </div>
              </div>

              {/* Match Configuration */}
              <Card className="h-fit sticky top-24 border-destructive/20">
                <div className="p-6 border-b border-border/50 bg-black/20">
                  <h3 className="font-display font-bold uppercase text-lg mb-4">Combat Protocol</h3>
                  
                  <div className="flex gap-2 mb-6">
                    <Button 
                      variant={mode === 'PVE' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setMode('PVE')}
                    >
                      <Bot className="mr-2 w-4 h-4" /> PvE
                    </Button>
                    <Button 
                      variant={mode === 'PVP' ? 'destructive' : 'outline'} 
                      className="flex-1"
                      onClick={() => setMode('PVP')}
                    >
                      <Skull className="mr-2 w-4 h-4" /> PvP
                    </Button>
                  </div>

                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entry Fee</span>
                      <span className="text-red-400">-10 ARENA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Winner Takes</span>
                      <span className="text-green-400">+18 ARENA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protocol Fee</span>
                      <span className="text-muted-foreground">2 ARENA</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="w-full text-xl h-16 hover-glitch shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                    disabled={!selectedFighter}
                    onClick={handleBattle}
                  >
                    {selectedFighter ? "INITIATE COMBAT" : "SELECT FIGHTER"}
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {battleState === 'FIGHTING' && (
          <motion.div 
            key="fighting"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="h-[60vh] flex flex-col items-center justify-center relative overflow-hidden clip-edges border border-destructive/50 bg-black"
          >
            <div className="absolute inset-0 z-0">
              <img src={`${import.meta.env.BASE_URL}images/arena-bg.png`} alt="Arena" className="w-full h-full object-cover opacity-40 animate-pulse" />
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-6xl font-black font-display text-destructive mb-8 neon-text glitch-text">COMBAT IN PROGRESS</h2>
              <div className="flex items-center justify-center gap-12">
                <div className="w-32 h-32 bg-primary/20 border border-primary clip-edges animate-bounce" />
                <Swords className="w-16 h-16 text-white animate-spin-slow" />
                <div className="w-32 h-32 bg-destructive/20 border border-destructive clip-edges animate-bounce" style={{animationDelay: '0.2s'}} />
              </div>
              <p className="mt-8 font-mono text-xl text-yellow-400">CALCULATING PROBABILITIES...</p>
            </div>
          </motion.div>
        )}

        {battleState === 'RESULT' && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className={cn(
              "p-12 text-center clip-edges border-2 bg-card max-w-lg w-full",
              result.win ? "border-primary shadow-[0_0_50px_rgba(0,255,255,0.2)]" : "border-destructive shadow-[0_0_50px_rgba(255,0,0,0.2)]"
            )}>
              <h2 className={cn(
                "text-5xl font-black font-display mb-4 uppercase",
                result.win ? "text-primary neon-text" : "text-destructive"
              )}>
                {result.win ? "VICTORY" : "DEFEAT"}
              </h2>
              
              <div className="font-mono text-xl mb-8">
                {result.win ? (
                  <p className="text-green-400">Reward Transferred: +{result.reward} ARENA</p>
                ) : (
                  <p className="text-red-400">Fighter heavily damaged. 0 ARENA returned.</p>
                )}
              </div>

              <Button onClick={resetArena} variant="outline" className="w-full">
                RETURN TO LOBBY
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
