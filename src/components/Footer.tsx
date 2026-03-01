import { LucideLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 px-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Anonymous Maximus
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Secure, private, and disposable chat rooms.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="font-medium">Anonymous Maximus</span>
          <span className="mx-1">•</span>
          <span>Built for privacy</span>
        </div>
        <a
          className="text-xs text-muted-foreground flex items-center gap-1"
          href="https://www.flaticon.com/free-icons/anonymous"
          title="anonymous icons"
        >
          Anonymous icons created by pbig - Flaticon
          <LucideLink className="h-2 w-2" />
        </a>
      </div>
    </footer>
  )
}
