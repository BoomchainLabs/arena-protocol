import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Terminal, Cpu, Zap, Beaker } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FighterCard } from "@/components/FighterCard"

export default function Mint() {
  const [isMinting, setIsMinting] = useState(false)
  const [mintedFighter, setMintedFighter] = useState<any>(null)
  const { toast } = useToast()

  const handleMint = () => {
    setIsMinting(true)
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsMinting(false)
      const newFighter = {
        id: Math.floor(Math.random() * 10000).toString(),
        image: `${import.meta.env.BASE_URL}images/fighter-${Math.floor(Math.random() * 3) + 1}.png`,
        rarity: Math.random() > 0.9 ? 'Legendary' : Math.random() > 0.7 ? 'Epic' : Math.random() > 0.4 ? 'Rare' : 'Common',
        stats: {
          strength: Math.floor(Math.random() * 80) + 20,
          speed: Math.floor(Math.random() * 80) + 20,
          intelligence: Math.floor(Math.random() * 80) + 20,
        }
      }
      setMintedFighter(newFighter)
      toast({
        title: "SYNTHESIS COMPLETE",
        description: `Successfully minted ${newFighter.rarity} Fighter #${newFighter.id}`,
      })
    }, 3000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-secondary/10 clip-edges border border-secondary/30">
          <Beaker className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-widest">Synthesis Lab</h1>
          <p className="text-muted-foreground font-mono text-sm">Generate new augmented assets on-chain</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mint Console */}
        <Card className="border-primary/20 h-fit">
          <CardContent className="p-6 lg:p-8">
            <div className="bg-black/50 border border-primary/30 p-4 mb-8 font-mono text-sm text-green-400 h-48 overflow-y-auto">
              <p>{">"} CONNECTING TO NEURAL NETWORK...</p>
              <p>{">"} STATUS: OK</p>
              <p>{">"} INITIALIZING DNA SEQUENCE GENERATOR...</p>
              <p className="text-muted-foreground mt-4">Waiting for user input to begin synthesis sequence.</p>
              {isMinting && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-yellow-400 mt-4 space-y-1">
                  <p>{">"} TX SUBMITTED. AWAITING CONFIRMATION...</p>
                  <p className="animate-pulse">{">"} ASSEMBLING CYBERNETICS [====      ]</p>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="font-mono text-muted-foreground uppercase">Synthesis Cost</span>
                <span className="font-bold text-xl text-primary">0 ARENA <span className="text-sm text-muted-foreground">+ GAS</span></span>
              </div>
              
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="font-mono text-muted-foreground uppercase">Network</span>
                <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Base Mainnet</span>
              </div>

              <Button 
                size="lg" 
                className="w-full h-16 text-xl mt-4" 
                onClick={handleMint}
                disabled={isMinting}
              >
                {isMinting ? (
                  <>
                    <Cpu className="mr-2 h-6 w-6 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6" />
                    INITIALIZE SYNTHESIS
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Area */}
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/50 p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
          
          <AnimatePresence mode="wait">
            {!mintedFighter && !isMinting && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center z-10"
              >
                <Terminal className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="font-mono text-muted-foreground uppercase">Awaiting Output</p>
              </motion.div>
            )}

            {isMinting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="z-10"
              >
                <div className="w-64 h-80 border-2 border-primary border-dashed flex items-center justify-center clip-edges relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                  <div className="w-full h-2 bg-primary/50 absolute top-0 animate-[ping_2s_linear_infinite]"></div>
                  <Cpu className="w-16 h-16 text-primary animate-spin" />
                </div>
              </motion.div>
            )}

            {mintedFighter && !isMinting && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="z-10 w-full max-w-xs"
              >
                <h3 className="text-center text-primary font-bold font-display uppercase mb-4 text-xl neon-text">Asset Secured</h3>
                <FighterCard {...mintedFighter} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
