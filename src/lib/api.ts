import { GovernmentScheme, GovernmentCenter, CitizenProfile, EligibilityResult } from '../types';

export async function fetchSchemes(params?: { 
  category?: string; 
  scope?: string; 
  search?: string;
  profile?: CitizenProfile;
}): Promise<GovernmentScheme[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.scope) query.append('scope', params.scope);
    if (params?.search) query.append('search', params.search);

    if (params?.profile) {
      if (params.profile.occupation) query.append('occupation', params.profile.occupation);
      if (params.profile.isStudent !== undefined) query.append('isStudent', String(params.profile.isStudent));
      if (params.profile.isFarmer !== undefined) query.append('isFarmer', String(params.profile.isFarmer));
      if (params.profile.age !== undefined) query.append('age', String(params.profile.age));
      if (params.profile.state) query.append('state', params.profile.state);
      if (params.profile.annualIncome !== undefined) query.append('annualIncome', String(params.profile.annualIncome));
    }

    const res = await fetch(`/api/schemes?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.schemes || [];
  } catch (error) {
    console.error('Failed to fetch schemes from API:', error);
    return [];
  }
}

export async function evaluateSchemes(profile: CitizenProfile, category?: string): Promise<EligibilityResult[]> {
  try {
    const res = await fetch('/api/schemes/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, category })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to evaluate schemes via API:', error);
    return [];
  }
}

export async function fetchCenters(params?: { state?: string; district?: string; type?: string }): Promise<GovernmentCenter[]> {
  try {
    const query = new URLSearchParams();
    if (params?.state) query.append('state', params.state);
    if (params?.district) query.append('district', params.district);
    if (params?.type) query.append('type', params.type);

    const res = await fetch(`/api/centers?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.centers || [];
  } catch (error) {
    console.error('Failed to fetch centers from API:', error);
    return [];
  }
}

export async function fetchAdminUsers() {
  const res = await fetch('/api/admin/users');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch('/api/admin/audit-logs');
  return res.json();
}

export async function fetchFeedbackData() {
  const res = await fetch('/api/feedback');
  return res.json();
}

export async function fetchAnalyticsData() {
  const res = await fetch('/api/analytics');
  return res.json();
}

export async function fetchMonitoringStatus() {
  const res = await fetch('/api/monitoring/status');
  return res.json();
}

export async function fetchMonitoringAlerts() {
  const res = await fetch('/api/monitoring/alerts');
  return res.json();
}
