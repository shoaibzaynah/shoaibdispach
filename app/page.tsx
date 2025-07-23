export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Lobocubs Courier Manager</h1>
          <p className="text-xl text-muted-foreground">
            Your complete courier management solution
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/login" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
