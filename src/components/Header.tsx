import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

export default function Header() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark',
  )

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-8 mx-auto">
        <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Anonymous Maximus
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="rounded-full"
        >
          {isDark ? (
            <Sun className="h-5 w-5 transition-all" />
          ) : (
            <Moon className="h-5 w-5 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
