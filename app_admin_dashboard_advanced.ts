import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Building, Activity, DollarSign, Package, Truck, BarChart3, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is super admin
  if (!user || !['shoaiblilcubspk@gmail.com', 'shoaibzaynah@gmail.com'].includes(user.email || '')) {
    redirect('/dashboard')
  }

  // Get comprehensive statistics
  const { count: totalTenants } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: totalShipments } = await supabase
    .from('courier_dispatches')
    .select('*', { count: 'exact', head: true })

  const { count: activeShipments } = await supabase
    .from('courier_dispatches')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'picked', 'in-transit', 'out-for-delivery'])

  const { data: revenueData } = await supabase
    .from('courier_dispatches')
    .select('cod_amount, status')
    .eq('status', 'delivered')

  const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.cod_amount || 0), 0) || 0

  // Get recent activities
  const { data: recentTenants } = await supabase
    .from('tenants')
    .select('id, name, status, plan, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentShipments } = await supabase
    .from('courier_dispatches')
    .select('id, tracking_number, courier, customer_name, status, cod_amount, created_at, tenant_id')
    .order('created_at', { ascending: false })
    .limit(10)

  // Get courier statistics
  const { data: courierStats } = await supabase
    .from('courier_dispatches')
    .select('courier, status')

  const courierAnalytics = courierStats?.reduce((acc: any, shipment) => {
    const courier = shipment.courier
    if (!acc[courier]) {
      acc[courier] = { total: 0, delivered: 0, pending: 0 }
    }
    acc[courier].total++
    if (shipment.status === 'delivered') acc[courier].delivered++
    if (shipment.status === 'pending') acc[courier].pending++
    return acc
  }, {})

  // Get GPT usage statistics
  const { data: gptUsage } = await supabase
    .from('gpt_logs')
    .select('tokens_used, feature, created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const totalTokensUsed = gptUsage?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Complete system overview and management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tenants</p>
                <p className="text-3xl font-bold">{totalTenants || 0}</p>
                <p className="text-xs text-green-600 mt-1">All companies</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{totalUsers || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Active accounts</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shipments</p>
                <p className="text-3xl font-bold">{totalShipments || 0}</p>
                <p className="text-xs text-purple-600 mt-1">{activeShipments || 0} active</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">PKR {totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-orange-600 mt-1">Delivered orders</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin-dashboard/tenants" className="card p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Tenants</h3>
                <p className="text-sm text-muted-foreground">View, block, or configure tenants</p>
              </div>
            </div>
          </Link>

          <Link href="/admin-dashboard/courier-apis" className="card p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Truck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Courier APIs</h3>
                <p className="text-sm text-muted-foreground">Monitor API usage and performance</p>
              </div>
            </div>
          </Link>

          <Link href="/admin-dashboard/gpt-logs" className="card p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">GPT Analytics</h3>
                <p className="text-sm text-muted-foreground">AI usage and token consumption</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tenants */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Tenants</h2>
              <Link href="/admin-dashboard/tenants" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentTenants?.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tenant.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {tenant.status}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {tenant.plan}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No tenants yet</p>
              )}
            </div>
          </div>

          {/* Recent Shipments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Shipments</h2>
              <Link href="/admin-dashboard/shipments" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentShipments?.slice(0, 5).map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium font-mono text-sm">{shipment.tracking_number}</p>
                    <p className="text-sm text-muted-foreground">{shipment.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">PKR {shipment.cod_amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shipment.status === 'delivered' 
                        ? 'bg-green-500/20 text-green-500'
                        : shipment.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No shipments yet</p>
              )}
            </div>
          </div>

          {/* Courier Performance */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Courier Performance</h2>
            <div className="space-y-3">
              {Object.entries(courierAnalytics || {}).map(([courier, stats]: [string, any]) => (
                <div key={courier} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{courier}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.total} total shipments
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {((stats.delivered / stats.total) * 100).toFixed(1)}% delivered
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.pending} pending
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">GPT API</span>
                </div>
                <span className="text-sm text-green-600">
                  {totalTokensUsed.toLocaleString()} tokens used
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Courier APIs</span>
                </div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Authentication</span>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}