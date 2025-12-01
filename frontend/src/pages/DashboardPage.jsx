import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { TripApi, DispatchApi, VendorApi, ReportApi } from '../services/api'; // Import ReportApi
import { Link } from 'react-router-dom';
import NewOrderModal from '../components/NewOrderModal';

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().slice(0, 10);

// Simple Bar Chart Component
const BarChart = ({ data, labels, title, yAxisLabel }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous render
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartHeight = canvas.height - 40; // Leave space for labels
    const chartWidth = canvas.width - 40; // Leave space for labels
    const barWidth = chartWidth / data.length / 1.5;
    const spacing = chartWidth / data.length / 3;

    const maxValue = Math.max(...data);
    const scale = chartHeight / maxValue;

    // Draw Y-axis label
    ctx.font = '10px Arial';
    ctx.fillStyle = '#666';
    ctx.save();
    ctx.translate(20, chartHeight / 2 + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();

    // Draw X-axis labels and bars
    data.forEach((value, index) => {
      const x = 40 + index * (barWidth + spacing);
      const y = chartHeight + 20 - value * scale;
      const height = value * scale;

      // Bar
      ctx.fillStyle = '#4F46E5'; // Brand color
      ctx.fillRect(x, y, barWidth, height);

      // Value label on top of bar
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(0), x + barWidth / 2, y - 5);

      // X-axis label
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, chartHeight + 35);
    });

    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, chartHeight + 20); // Y-axis
    ctx.lineTo(chartWidth + 40, chartHeight + 20); // X-axis
    ctx.stroke();

    // Draw title
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 15);

  }, [data, labels, title, yAxisLabel]);

  return <canvas ref={canvasRef} width="600" height="300" className="w-full h-auto"></canvas>;
};


export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]); // State for historical data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [allVendors, setAllVendors] = useState([]);

  const today = formatDate(new Date());

  const fetchData = async (signal) => {
    try {
      const now = new Date();
      const endDate = formatDate(now);
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      const startDate = formatDate(sevenDaysAgo);

      const [tripsRes, vendorsRes, dailySummariesRes] = await Promise.all([
        TripApi.todays({ signal }),
        VendorApi.list(),
        ReportApi.getDailyTripSummaries(startDate, endDate) // Fetch historical data
      ]);
      setTrips(tripsRes);
      setAllVendors(vendorsRes);
      setDailySummaries(dailySummariesRes); // Set historical data
      setError('');
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Failed to fetch data:", e);
        setError("Could not load dashboard data. Please try again later.");
      }
    } finally { setLoading(false) }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const handleCreateOrder = async (newOrder) => {
    try {
      await DispatchApi.createOrder(newOrder);
      setIsNewOrderModalOpen(false);
      fetchData(new AbortController().signal);
    } catch (e) {
      console.error('Failed to create order:', e);
      setError('Error: Could not create order. ' + e.message);
    }
  };

  // Prepare data for the chart
  const chartLabels = dailySummaries.map(s => s.date.slice(5)); // e.g., "11-25"
  const chartData = dailySummaries.map(s => s.totalTrips);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSave={handleCreateOrder}
        vendors={allVendors}
        date={today}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Today's Overview</h1>
            <p className="text-slate-500 mt-1">Manage your daily trips and orders</p>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg px-5 py-2.5 shadow-lg shadow-brand-500/30 transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Create New Order
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Today's Trips Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Trips</h2>
              {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map(t => (
                    <Link key={t.id} to={`/trips/${t.id}`} className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1a2 2 0 00-2-2v0a2 2 0 00-2 2"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{t.routeName || 'Unnamed Route'}</h3>
                        <div className="flex items-center text-sm text-slate-500 mb-4">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          {t.driver?.name || 'Unassigned Driver'}
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span>View Details</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No trips scheduled</h3>
                  <p className="text-slate-500 mt-1">Get started by creating a new order or trip.</p>
                </div>
              )}
            </div>

            {/* Trip History Graphical Representation Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Trip History (Last 7 Days)</h2>
              {dailySummaries.length > 0 ? (
                <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
                  <BarChart 
                    data={chartData} 
                    labels={chartLabels} 
                    title="Total Trips per Day" 
                    yAxisLabel="Number of Trips" 
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500">No historical trip data available for the last 7 days.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
