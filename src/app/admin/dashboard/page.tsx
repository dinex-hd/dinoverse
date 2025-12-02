"use client";

import Link from 'next/link';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ShoppingBagIcon, 
  UserGroupIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  // Mock data - will be replaced with real data
  const stats = [
    { name: 'Total Revenue', value: 'ETB 679,000', change: '+12.5%', trend: 'up', icon: CurrencyDollarIcon },
    { name: 'Total Users', value: '2,345', change: '+8.2%', trend: 'up', icon: UserGroupIcon },
    { name: 'Page Views', value: '45,678', change: '+15.3%', trend: 'up', icon: EyeIcon },
    { name: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: ChartBarIcon },
  ];

  const recentPosts = [
    { id: 1, title: 'Building Scalable Web Applications', category: 'Blog', status: 'Published', date: '2024-01-15' },
    { id: 2, title: 'The Future of AI in Web Development', category: 'Blog', status: 'Published', date: '2024-01-10' },
    { id: 3, title: 'TypeScript Advanced Patterns', category: 'Blog', status: 'Draft', date: '2024-01-08' },
  ];

  const recentProjects = [
    { id: 1, name: 'E-Commerce Platform', status: 'Completed', client: 'TechCorp Inc.', revenue: 'ETB 275,000' },
    { id: 2, name: 'Mobile Banking App', status: 'In Progress', client: 'FinanceHub', revenue: 'ETB 467,500' },
    { id: 3, name: 'AI Analytics Dashboard', status: 'Completed', client: 'DataCo', revenue: 'ETB 341,000' },
  ];

  const recentSales = [
    { id: 1, product: 'Web Development Course', amount: 'ETB 5,500', customer: 'John Doe', date: '2 hours ago' },
    { id: 2, product: 'UI/UX Design System', amount: 'ETB 2,750', customer: 'Sarah Smith', date: '5 hours ago' },
    { id: 3, product: 'SaaS Starter Kit', amount: 'ETB 11,000', customer: 'Mike Johnson', date: '1 day ago' },
  ];

  const quickActions = [
    { name: 'Manage Services', href: '/admin/services', icon: BriefcaseIcon, color: 'bg-[#2642fe]' },
    { name: 'View Contacts', href: '/admin/contacts', icon: DocumentTextIcon, color: 'bg-blue-500' },
    { name: 'New Blog Post', href: '/admin/blog/new', icon: DocumentTextIcon, color: 'bg-purple-500' },
    { name: 'View Analytics', href: '/admin/analytics', icon: ChartBarIcon, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back! Here's what's happening.</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center">
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Blog Posts</h2>
                <Link href="/admin/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
                <Link href="/admin/store" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentSales.map((sale) => (
                <div key={sale.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{sale.product}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{sale.customer}</span>
                        <span>•</span>
                        <span>{sale.date}</span>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-semibold text-green-600">{sale.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <Link href="/admin/portfolio" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {project.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
