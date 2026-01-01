'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  email: string;
  city: string;
  ip: string;
  device: string;
  created_at: string;
}

interface Stats {
  total_leads: number;
  device_breakdown: Array<{ device_type: string; count: number; percentage: number }>;
  top_cities: Array<{ city_from_form: string; count: number }>;
}

interface VisitStats {
  total_visits: number;
  total_leads: number;
  converted_visits: number;
  bounced_visits: number;
  conversion_rate: number;
  bounce_rate: number;
  device_breakdown: Array<{ device_type: string; count: number; percentage: number }>;
  top_referrers: Array<{ referrer: string; count: number }>;
  top_campaigns: Array<{ campaign: string; count: number }>;
}

interface ScrollStats {
  total_visits: number;
  total_visits_with_scroll: number;
  milestone_counts: Record<number, number>;
  milestone_percentages: Record<number, number>;
  section_counts: Record<string, number>;
  section_percentages: Record<string, number>;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [scrollStats, setScrollStats] = useState<ScrollStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const trimmedPassword = password.trim();
      const authHeader = `Bearer ${trimmedPassword}`;
      
      // Debug logging
      console.log('[FRONTEND] Attempting login...');
      console.log('[FRONTEND] Password length:', trimmedPassword.length);
      console.log('[FRONTEND] Auth header length:', authHeader.length);
      
      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': authHeader
        }
      });
      
      console.log('[FRONTEND] Response status:', response.status);
      
      if (response.ok) {
        console.log('[FRONTEND] Login successful!');
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', trimmedPassword);
        fetchData(trimmedPassword);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[FRONTEND] Login failed:', errorData);
        setError(`Senha incorreta (Status: ${response.status}). Verifique se ADMIN_PASSWORD está configurado no Vercel.`);
      }
    } catch (err) {
      console.error('[FRONTEND] Login error:', err);
      setError(`Erro ao fazer login: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      // Fetch leads
      const leadsResponse = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.leads);
      }
      
      // Fetch lead stats
      const statsResponse = await fetch('/api/leads/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
      
      // Fetch visit stats
      const visitStatsResponse = await fetch('/api/visits/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (visitStatsResponse.ok) {
        const visitStatsData = await visitStatsResponse.json();
        setVisitStats(visitStatsData.stats);
      }
      
      // Fetch scroll stats
      const scrollStatsResponse = await fetch('/api/scroll/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (scrollStatsResponse.ok) {
        const scrollStatsData = await scrollStatsResponse.json();
        setScrollStats(scrollStatsData.stats);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setPassword(token);
      setIsAuthenticated(true);
      fetchData(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setLeads([]);
    setStats(null);
    setVisitStats(null);
    setScrollStats(null);
  };
  
  // Get color based on percentage (Green -> Yellow -> Red)
  const getColorForPercentage = (percentage: number): string => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get text color based on percentage
  const getTextColorForPercentage = (percentage: number): string => {
    if (percentage >= 70) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const exportToCSV = async (type: 'leads' | 'traffic') => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      if (type === 'leads') {
        // Export leads
        const headers = ['ID', 'Name', 'WhatsApp', 'Email', 'City', 'Device', 'IP', 'Created At'];
        const rows = leads.map(lead => [
          lead.id,
          lead.name,
          lead.whatsapp,
          lead.email,
          lead.city,
          lead.device,
          lead.ip,
          new Date(lead.created_at).toLocaleString()
        ]);
        
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else {
        // Export traffic data - fetch all visits
        const response = await fetch('/api/visits/export', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const headers = ['ID', 'IP', 'Device', 'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Converted', 'Lead ID', 'Visit Duration (s)', 'Created At'];
          const rows = data.visits.map((visit: any) => [
            visit.id,
            visit.ip || '',
            visit.device || '',
            visit.referrer || '',
            visit.utm_source || '',
            visit.utm_medium || '',
            visit.utm_campaign || '',
            visit.converted ? 'Yes' : 'No',
            visit.lead_id || '',
            visit.visit_duration || '',
            new Date(visit.created_at).toLocaleString()
          ]);
          
          const csvContent = [
            headers.join(','),
            ...rows.map((row: (string | number | boolean)[]) => row.map(cell => `"${cell}"`).join(','))
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `traffic_export_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
        }
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Error exporting data. Please try again.');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Haitian Photography School</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Haitian Photography School</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV('leads')}
                  className="px-4 py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 rounded-lg text-[#D4AF37] text-sm font-medium transition-all"
                >
                  Export Leads CSV
                </button>
                <button
                  onClick={() => exportToCSV('traffic')}
                  className="px-4 py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 rounded-lg text-[#D4AF37] text-sm font-medium transition-all"
                >
                  Export Traffic CSV
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Analytics Section */}
            {visitStats && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Total Visitors */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-sm font-medium">Total Visitors</h3>
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{visitStats.total_visits.toLocaleString()}</p>
                  </div>

                  {/* Conversion Rate */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-sm font-medium">Conversion Rate</h3>
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{visitStats.conversion_rate.toFixed(2)}%</p>
                    <p className="text-xs text-gray-400 mt-1">{visitStats.converted_visits} of {visitStats.total_visits} converted</p>
                  </div>

                  {/* Bounce Rate */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-sm font-medium">Bounce Rate</h3>
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{visitStats.bounce_rate.toFixed(2)}%</p>
                    <p className="text-xs text-gray-400 mt-1">{visitStats.bounced_visits} left in &lt;10s</p>
                  </div>

                  {/* Total Leads */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-sm font-medium">Total Leads</h3>
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{visitStats.total_leads.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Heatmap Section */}
            {scrollStats && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Mapa de Calor (Scroll Depth)</h2>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="space-y-6">
                    {/* Section-based Scroll Depth */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Porcentagem de Usuários por Seção</h3>
                      <div className="space-y-4">
                        {['Intro', '3D Book', 'Price/Offer', 'Footer'].map((section) => {
                          const percentage = scrollStats.section_percentages[section] || 0;
                          const count = scrollStats.section_counts[section] || 0;
                          return (
                            <div key={section} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300 font-medium">{section}</span>
                                <span className={`font-bold ${getTextColorForPercentage(percentage)}`}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full h-8 bg-white/10 rounded-full overflow-hidden relative">
                                <div
                                  className={`h-full ${getColorForPercentage(percentage)} transition-all duration-500 flex items-center justify-end pr-2`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                >
                                  {percentage > 10 && (
                                    <span className="text-xs font-semibold text-white">{count}</span>
                                  )}
                                </div>
                                {percentage <= 10 && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{count}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Milestone-based Scroll Depth */}
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Milestones de Scroll</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[25, 50, 75, 100].map((milestone) => {
                          const percentage = scrollStats.milestone_percentages[milestone] || 0;
                          const count = scrollStats.milestone_counts[milestone] || 0;
                          return (
                            <div key={milestone} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">{milestone}%</span>
                                <span className={`text-sm font-bold ${getTextColorForPercentage(percentage)}`}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full h-6 bg-white/10 rounded-full overflow-hidden relative">
                                <div
                                  className={`h-full ${getColorForPercentage(percentage)} transition-all duration-500`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 text-center">{count} usuários</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-gray-400">Alta Retenção (≥70%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-gray-400">Média (40-69%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-gray-400">Alto Drop-off (&lt;40%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Device Breakdown */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-gray-400 text-sm font-medium mb-4">Device Breakdown</h3>
                  <div className="space-y-3">
                    {stats.device_breakdown.map((device) => (
                      <div key={device.device_type} className="flex items-center justify-between">
                        <span className="text-white capitalize">{device.device_type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                          <span className="text-[#D4AF37] font-bold text-sm w-12 text-right">
                            {device.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Cities */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-gray-400 text-sm font-medium mb-4">Top Cities</h3>
                  <div className="space-y-2">
                    {stats.top_cities.slice(0, 5).map((city, index) => (
                      <div key={city.city_from_form} className="flex items-center justify-between">
                        <span className="text-white text-sm">{index + 1}. {city.city_from_form}</span>
                        <span className="text-[#D4AF37] font-bold">{city.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Referrers */}
                {visitStats && visitStats.top_referrers.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-4">Top Referrers</h3>
                    <div className="space-y-2">
                      {visitStats.top_referrers.slice(0, 5).map((ref, index) => (
                        <div key={ref.referrer} className="flex items-center justify-between">
                          <span className="text-white text-sm truncate">{index + 1}. {ref.referrer.substring(0, 30)}</span>
                          <span className="text-[#D4AF37] font-bold">{ref.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leads Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">All Leads ({leads.length})</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{lead.whatsapp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{lead.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{lead.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            lead.device === 'mobile' ? 'bg-blue-500/20 text-blue-400' :
                            lead.device === 'desktop' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.device}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{lead.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(lead.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {leads.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No leads yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
