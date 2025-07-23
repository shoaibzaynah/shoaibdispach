import { Truck, Sparkles } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
              <Truck className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Lobocubs Courier Manager</h1>
            <p className="text-xl text-muted-foreground max-w-md">
              AI-powered multi-courier management system for Pakistan's leading logistics companies
            </p>
          </div>
          
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span>AI-powered data cleaning and formatting</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <span>Multi-courier integration (PostEx, BlueEx, TCS, etc.)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full" />
              </div>
              <span>Real-time tracking and analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Lobocubs</h1>
            <p className="text-muted-foreground">Courier Manager</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
