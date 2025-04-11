import { ThemeToggle } from './ThemeToggle'
import { EthereumIcon } from '../assets/icons/EthereumIcon'
import { GitHubIcon } from '../assets/icons/GitHubIcon'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <EthereumIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Ethereum Balance Checker
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-1">
            <a
              href="https://github.com/Lykhoyda/ethereum-balance"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="GitHub repository"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
