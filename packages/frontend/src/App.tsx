import { lazy, Suspense } from 'react'
import { Navbar } from './components/Navbar'
import { ThemeProvider } from './providers/theme'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/ui/loading-spinner'

// Lazy load the BalanceForm component for better initial load performance
const BalanceForm = lazy(() => import('./components/BalanceForm').then(mod => ({
  default: mod.BalanceForm
})))

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
        <Navbar />
        <ErrorBoundary>
          <main className="flex-1 container mx-auto py-8 px-4">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold mb-2">Ethereum Balance Checker</h1>
              <p className="text-muted-foreground">
                Enter an Ethereum address to check token balances
              </p>
            </div>
            <Suspense fallback={
              <div className="flex justify-center items-center p-12">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <BalanceForm />
            </Suspense>
          </main>
        </ErrorBoundary>
        <footer className="border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ethereum Balance Checker
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
