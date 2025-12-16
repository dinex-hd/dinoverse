"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon as ChartBarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
} from '@heroicons/react/24/solid';

interface DashboardStats {
  blogs: { total: number; published: number };
  services: { total: number; active: number };
  products: { total: number; active: number };
  contacts: { total: number };
}

interface RecentBlog {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  category?: string;
}

interface RecentContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        setRecentBlogs(data.recent?.blogs || []);
        setRecentContacts(data.recent?.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      name: 'Blog Posts',
      value: stats?.blogs.total || 0,
      subtitle: `${stats?.blogs.published || 0} published`,
      icon: DocumentTextIconSolid,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      href: '/admin/blog',
      delay: 0.1,
    },
    {
      name: 'Services',
      value: stats?.services.total || 0,
      subtitle: `${stats?.services.active || 0} active`,
      icon: BriefcaseIconSolid,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      href: '/admin/services',
      delay: 0.2,
    },
    {
      name: 'Products',
      value: stats?.products.total || 0,
      subtitle: `${stats?.products.active || 0} active`,
      icon: ShoppingBagIconSolid,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      href: '/admin/store',
      delay: 0.3,
    },
    {
      name: 'Contacts',
      value: stats?.contacts.total || 0,
      subtitle: 'Total messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      href: '/admin/contacts',
      delay: 0.4,
    },
  ];

  const quickActions = [
    {
      name: 'New Blog Post',
      href: '/admin/blog?new=true',
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Create a new blog post',
    },
    {
      name: 'Add Service',
      href: '/admin/services?new=true',
      icon: BriefcaseIcon,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Add a new service',
    },
    {
      name: 'Add Product',
      href: '/admin/store?new=true',
      icon: ShoppingBagIcon,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Add a new product',
    },
    {
      name: 'View Analytics',
      href: '/admin/contacts',
      icon: ChartBarIcon,
      gradient: 'from-orange-500 to-red-500',
      description: 'View contact analytics',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Here's what's happening with your content.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <Link href={stat.href}>
                  <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-gray-600">
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">{stat.name}</p>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={action.href}
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all group relative overflow-hidden bg-gray-800/30"
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                    
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all relative z-10`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white text-center relative z-10">{action.name}</span>
                    <span className="text-xs text-gray-400 mt-1 relative z-10">{action.description}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blog Posts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Recent Blog Posts</h2>
                </div>
                <Link
                  href="/admin/blog"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 hover:underline"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : recentBlogs.length > 0 ? (
                recentBlogs.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="p-6 hover:bg-gray-800/50 transition-colors group"
                  >
                    <Link href={`/admin/blog/${post._id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {post.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                            {post.category && (
                              <>
                                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                                  {post.category}
                                </span>
                              </>
                            )}
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`ml-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <p className="mb-2">No blog posts yet</p>
                  <Link
                    href="/admin/blog?new=true"
                    className="text-sm text-purple-400 hover:underline font-medium"
                  >
                    Create your first post
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-orange-500/20 to-red-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Recent Contacts</h2>
                </div>
                <Link
                  href="/admin/contacts"
                  className="text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : recentContacts.length > 0 ? (
                recentContacts.map((contact, index) => (
                  <motion.div
                    key={contact._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="p-6 hover:bg-gray-800/50 transition-colors group"
                  >
                    <Link href={`/admin/contacts`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-gray-300 mt-1">{contact.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{contact.subject}</p>
                          <span className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <p>No contact submissions yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
