import { Button } from "./ui/button"
import { useMockAccount } from "@/lib/wagmi"
import { formatAddress } from "@/lib/utils"
import { Wallet } from "lucide-react"

export function ConnectWallet() {
  const { address, isConnected } = useMockAccount()

  if (isConnected && address) {
    return (
      <Button variant="cyber" className="font-mono text-xs">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        {formatAddress(address)}
      </Button>
    )
  }

  return (
    <Button variant="default">
      <Wallet className="mr-2 h-4 w-4" />
      CONNECT
    </Button>
  )
}
