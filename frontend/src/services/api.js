const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8090';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(path, options = {}) {
  const { headers: customHeaders, body, ...restOptions } = options;

  const headers = customHeaders || {};
  if (!headers['Content-Type'] && body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...restOptions, headers, body });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const AuthApi = {
  async login(username, password) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    localStorage.setItem('token', res.token);
    return res;
  }
}

export const TripApi = {
  createTrip: (dto, options) => apiFetch('/api/trips', { method: 'POST', body: JSON.stringify(dto), ...options }),
  update: (id, dto, options) => apiFetch(`/api/trips/${id}`, { method: 'PUT', body: JSON.stringify(dto), ...options }),
  todays: (options) => apiFetch('/api/trips/today', options),
  recent: (options) => apiFetch('/api/trips/recent', options),
  details: (id, options) => apiFetch(`/api/trips/${id}`, options),
  close: (id, options) => apiFetch(`/api/trips/${id}/close`, { method: 'PUT', ...options })
}

export const RateApi = {
  getRateCard: () => apiFetch('/api/rates/card'),
  saveRateCard: (rateCard) => apiFetch('/api/rates/card', { method: 'POST', body: JSON.stringify(rateCard) }),
  getCombinedRateHistory: () => apiFetch('/api/rates/combined-history'),
  getDailyRateHistory: () => apiFetch('/api/rates/daily-history')
}

export const VendorApi = {
  list: () => apiFetch('/api/vendors'),
  getFinancials: () => apiFetch('/api/ledger/vendors'),
  create: (vendor) => apiFetch('/api/vendors', { method: 'POST', body: JSON.stringify(vendor) }),
  getLedger: (vendorId) => apiFetch(`/api/vendors/${vendorId}/ledger`)
}

export const DriverApi = {
  list: () => apiFetch('/api/drivers'),
  create: (driver) => apiFetch('/api/drivers', { method: 'POST', body: JSON.stringify(driver) })
}

export const DispatchApi = {
  getDispatchData: (date) => apiFetch(`/api/dispatch?date=${date}`),
  createOrder: (order) => apiFetch('/api/dispatch/orders', { method: 'POST', body: JSON.stringify(order) }),
  assignOrdersToTrip: (tripId, orderIds) => apiFetch('/api/dispatch/assign-orders', { method: 'POST', body: JSON.stringify({ tripId, orderIds }) }),
  updateOrderDetails: (orderId, details) => apiFetch(`/api/dispatch/orders/${orderId}`, { method: 'PUT', body: JSON.stringify(details) }),
  unassignOrder: (orderId) => apiFetch(`/api/dispatch/orders/${orderId}/unassign`, { method: 'PUT' })
}

export const ReconciliationApi = {
  calculateDailySummary: (vendorId, date) => apiFetch(`/api/reconciliation?vendorId=${vendorId}&date=${date}`, { method: 'POST' }),
  summaryExists: (vendorId, date) => apiFetch(`/api/reconciliation/exists?vendorId=${vendorId}&date=${date}`),
  getDailyOverview: (date) => apiFetch(`/api/ledger/daily-overview?date=${date}`),
  recordPayment: (paymentRequest) => apiFetch('/api/ledger/payments', { method: 'POST', body: JSON.stringify(paymentRequest) })
}

export const ReportApi = {
  getDailyTripSummaries: (startDate, endDate) => apiFetch(`/api/reports/daily-trip-summaries?startDate=${startDate}&endDate=${endDate}`) // New endpoint
}
