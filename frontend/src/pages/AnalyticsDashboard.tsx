import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    Users, MessageSquare, Hash, TrendingUp, ArrowLeft,
    Calendar, Award, Activity
} from 'lucide-react';
import api from '../services/api';

interface AnalyticsData {
    totalUsers: number;
    totalMessages: number;
    totalConversations: number;
    messagesPerDay: Record<string, number>;
    topConversations: { title: string; messageCount: number }[];
}

const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Transform messagesPerDay for Recharts
    const chartData = Object.entries(stats.messagesPerDay).map(([date, count]) => ({
        date: date.split('-').slice(1).join('/'), // simplify date MM/DD
        messages: count
    })).sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
                        <Activity size={14} className="animate-pulse" />
                        Live Usage Stats
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                    </div>

                    <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                                <MessageSquare size={24} />
                            </div>
                            <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                                <TrendingUp size={12} /> +24%
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Messages</h3>
                        <p className="text-3xl font-bold mt-1">{stats.totalMessages}</p>
                    </div>

                    <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
                                <Hash size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Conversations</h3>
                        <p className="text-3xl font-bold mt-1">{stats.totalConversations}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Growth Chart */}
                    <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar size={18} className="text-blue-500" />
                            <h2 className="text-lg font-semibold">Message Volume (Last 7 Days)</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMsg)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Conversations */}
                    <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Award size={18} className="text-amber-500" />
                            <h2 className="text-lg font-semibold">Top Active Conversations</h2>
                        </div>
                        <div className="space-y-4">
                            {stats.topConversations.map((conv, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                                            #{idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{conv.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Activity Rank</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                                        <MessageSquare size={12} className="text-blue-500" />
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{conv.messageCount}</span>
                                    </div>
                                </div>
                            ))}
                            {stats.topConversations.length === 0 && (
                                <div className="text-center py-12 text-gray-400 italic">
                                    No conversation data available yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
