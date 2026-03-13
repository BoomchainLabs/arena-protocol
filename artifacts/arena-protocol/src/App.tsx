import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout & Contexts
import { Layout } from "@/components/Layout";
// Pages
import Home from "@/pages/Home";
import Mint from "@/pages/Mint";
import Arena from "@/pages/Arena";
import Leaderboard from "@/pages/Leaderboard";
import Marketplace from "@/pages/Marketplace";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/mint" component={Mint} />
        <Route path="/arena" component={Arena} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
