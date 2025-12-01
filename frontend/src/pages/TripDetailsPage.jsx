import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { TripApi, DispatchApi } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editDeliveredUnits, setEditDeliveredUnits] = useState('');
  const [editPaymentAmount, setEditPaymentAmount] = useState('');
  const [editWeight, setEditWeight] = useState(''); // New state for weight
  const [isClosingTrip, setIsClosingTrip] = useState(false);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const t = await TripApi.details(id);
      setTrip(t);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setEditDeliveredUnits(order.deliveredUnits !== null ? order.deliveredUnits : '');
    setEditPaymentAmount(order.paymentAmount !== null ? order.paymentAmount : '');
    setEditWeight(order.weight !== null ? order.weight : ''); // Set weight state
  };

  const handleSaveOrderDetails = async (orderId) => {
    try {
      const updatedDetails = {
        deliveredUnits: editDeliveredUnits !== '' ? Number(editDeliveredUnits) : null,
        paymentAmount: editPaymentAmount !== '' ? Number(editPaymentAmount) : null,
        weight: editWeight !== '' ? Number(editWeight) : null, // Add weight to request
      };
      await DispatchApi.updateOrderDetails(orderId, updatedDetails);
      setEditingOrderId(null);
      await fetchTripDetails();
    } catch (e) {
      setError('Failed to update order details: ' + e.message);
    }
  };

  const handleCloseTrip = async () => {
    if (!window.confirm('Are you sure you want to close this trip? All unconfirmed orders will be marked as delivered with 0 units and 0 payment.')) {
      return;
    }
    setIsClosingTrip(true);
    try {
      await TripApi.close(id);
      await fetchTripDetails();
    } catch (e) {
      setError('Failed to close trip: ' + e.message);
    } finally {
      setIsClosingTrip(false);
    }
  };

  if (loading) return <div><Navbar /><div className='p-6 text-center'>Loading trip details...</div></div>;
  if (error) return <div><Navbar /><div className='p-6 text-red-600 text-center'>{error}</div></div>;
  if (!trip) return <div><Navbar /><div className='p-6 text-center'>Trip not found.</div></div>;

  const totalAssignedUnits = trip.orders?.reduce((sum, order) => sum + (order.assignedUnits || 0), 0) || 0;
  const totalDeliveredUnits = trip.orders?.reduce((sum, order) => sum + (order.deliveredUnits || 0), 0) || 0;
  const totalPayments = trip.orders?.reduce((sum, order) => sum + (parseFloat(order.paymentAmount) || 0), 0) || 0;
  const totalWeight = trip.orders?.reduce((sum, order) => sum + (parseFloat(order.weight) || 0), 0) || 0; // Calculate total weight
  const isTripCompleted = trip.status === 'COMPLETED';

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Trip #{trip.id} — {trip.routeName}</h1>
              <div className="text-md text-gray-700">Driver: {trip.driver?.name}</div>
              <div className="text-md text-gray-700">Date: {trip.tripDate}</div>
              <div className={`text-md font-semibold ${isTripCompleted ? 'text-green-600' : 'text-blue-600'}`}>Status: {trip.status}</div>
            </div>
            {!isTripCompleted && (
              <button
                onClick={handleCloseTrip}
                disabled={isClosingTrip}
                className="bg-red-600 text-white font-semibold rounded px-6 py-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isClosingTrip ? 'Closing...' : 'Close Trip'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 text-center border-t pt-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Total Assigned Units</div>
              <div className="text-xl font-bold">{totalAssignedUnits}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Delivered Units</div>
              <div className="text-xl font-bold">{totalDeliveredUnits}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Weight</div>
              <div className="text-xl font-bold">{totalWeight.toFixed(2)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Payments</div>
              <div className="text-xl font-bold">${totalPayments.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-xl mb-4">Orders on this Trip</h2>
          <div className="space-y-4">
            {(trip.orders || []).length === 0 && <div className="text-sm text-gray-500 text-center">No orders assigned to this trip yet.</div>}
            {trip.orders?.sort((a, b) => a.id - b.id).map((order) => (
              <div key={order.id} className={`border rounded-lg p-4 ${order.deliveredUnits !== null && order.assignedUnits !== null && order.deliveredUnits !== order.assignedUnits ? 'border-yellow-500 bg-yellow-50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{order.vendor?.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="text-sm text-gray-600">Assigned Units</div>
                    <div className="font-medium">{order.assignedUnits}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Delivered Units</label>
                    {editingOrderId === order.id ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-full"
                        value={editDeliveredUnits}
                        onChange={(e) => setEditDeliveredUnits(e.target.value)}
                      />
                    ) : (
                      <div className="font-medium">{order.deliveredUnits !== null ? order.deliveredUnits : 'N/A'}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Weight (kg)</label>
                    {editingOrderId === order.id ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-full"
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                      />
                    ) : (
                      <div className="font-medium">{order.weight !== null ? order.weight : 'N/A'}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Payment Amount</label>
                    {editingOrderId === order.id ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-full"
                        value={editPaymentAmount}
                        onChange={(e) => setEditPaymentAmount(e.target.value)}
                      />
                    ) : (
                      <div className="font-medium">${order.paymentAmount !== null ? parseFloat(order.paymentAmount).toFixed(2) : 'N/A'}</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  {editingOrderId === order.id ? (
                    <>
                      <button onClick={() => handleSaveOrderDetails(order.id)} className="bg-blue-600 text-white rounded px-4 py-2 text-sm mr-2">Save</button>
                      <button onClick={() => setEditingOrderId(null)} className="bg-gray-200 text-gray-800 rounded px-4 py-2 text-sm">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditOrder(order)} className="bg-indigo-600 text-white rounded px-4 py-2 text-sm" disabled={isTripCompleted}>Edit Details</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
