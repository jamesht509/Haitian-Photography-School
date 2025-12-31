'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  email: string;
  city_from_form: string;
  ip_address: string;
  device_type: string;
  referrer: string;
  created_at: string;
}

interface Stats {
  total_leads: number;
  device_breakdown: Array<{ device_type: string; count: number; percentage: number }>;
  top_cities: Array<{ city_from_form: string; count: number }>;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const authHeader = `Bearer ${password}`;
      console.log('[FRONTEND] Attempting login...');
      console.log('[FRONTEND] Password length:', password.length);
      console.log('[FRONTEND] Auth header:', authHeader);
      console.log('[FRONTEND] Auth header length:', authHeader.length);
      
      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': authHeader
        }
      });
      
      console.log('[FRONTEND] Response status:', response.status);
      console.log('[FRONTEND] Response ok:', response.ok);
      
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', password);
        fetchData(password);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[FRONTEND] Login failed:', errorData);
        setError(`Senha incorreta (Status: ${response.status})`);
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
      
      // Fetch stats
      const statsResponse = await fetch('/api/leads/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
            >
              Logout
            </button>
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
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Leads */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm font-medium">Total Leads</h3>
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white">{stats.total_leads}</p>
                </div>

                {/* Mobile vs Desktop */}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{lead.city_from_form}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            lead.device_type === 'mobile' ? 'bg-blue-500/20 text-blue-400' :
                            lead.device_type === 'desktop' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.device_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{lead.ip_address}</td>
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

