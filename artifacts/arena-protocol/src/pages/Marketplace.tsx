import { useGetMarketListings } from "@workspace/api-client-react"
import { Store, Filter } from "lucide-react"
import { FighterCard } from "@/components/FighterCard"
import { Button } from "@/components/ui/button"

export default function Marketplace() {
  const { data: listings, isLoading } = useGetMarketListings({ limit: 20 })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 clip-edges border border-secondary/30">
            <Store className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-secondary">Black Market</h1>
            <p className="text-muted-foreground font-mono text-sm">P2P Asset Exchange Hub</p>
          </div>
        </div>
        
        <Button variant="outline" className="font-mono text-xs">
          <Filter className="w-4 h-4 mr-2" />
          FILTER ASSETS
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[3/4] bg-card/40 animate-pulse clip-edges border border-border/20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings?.map((item) => (
            <FighterCard
              key={item.tokenId}
              id={item.tokenId}
              image={`${import.meta.env.BASE_URL}images/fighter-${(parseInt(item.tokenId) % 3) + 1}.png`} // Mock image resolution
              rarity={item.rarity}
              stats={{
                strength: item.strength,
                speed: item.speed,
                intelligence: item.intelligence
              }}
              wins={item.wins}
              losses={item.losses}
              price={item.price}
              onClick={() => alert(`Open purchase modal for ${item.tokenId}`)}
            />
          ))}

          {(!listings || listings.length === 0) && (
            <div className="col-span-full py-20 text-center border border-dashed border-border/50 clip-edges">
              <p className="font-mono text-muted-foreground uppercase">NO LISTINGS FOUND IN CURRENT SECTOR</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
