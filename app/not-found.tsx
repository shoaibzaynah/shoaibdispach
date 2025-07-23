import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/admin-dashboard"
            className="px-6 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
