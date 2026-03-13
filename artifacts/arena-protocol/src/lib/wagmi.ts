// Mock Wagmi configuration for UI demonstration
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
})

// Mocks for UI testing without full wallet connection
export const useMockAccount = () => {
  return {
    address: '0x1234567890abcdef1234567890abcdef12345678' as const,
    isConnected: true,
  }
}
