import React, { useEffect, useState } from 'react';
import { TripApi, DispatchApi } from '../../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { Truck, Calendar, CheckCircle, AlertCircle, Package, DollarSign, Scale, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

import BackButton from '../../../components/ui/BackButton';

export default function TripDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editDeliveredUnits, setEditDeliveredUnits] = useState('');
    const [editPaymentAmount, setEditPaymentAmount] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [isClosingTrip, setIsClosingTrip] = useState(false);

    // New state for editing loaded weight
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [newLoadedWeight, setNewLoadedWeight] = useState('');

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

    const handleUpdateWeight = async () => {
        try {
            await TripApi.update(id, {
                loadedWeight: parseFloat(newLoadedWeight),
            });
            setIsEditingWeight(false);
            await fetchTripDetails();
            toast.success('Loaded weight updated');
        } catch (error) {
            console.error('Failed to update weight:', error);
            toast.error('Failed to update weight');
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrderId(order.id);
        setEditDeliveredUnits(order.deliveredUnits !== null ? order.deliveredUnits : '');
        setEditPaymentAmount(order.paymentAmount !== null ? order.paymentAmount : '');
        setEditWeight(order.weight !== null ? order.weight : '');
    };

    const handleSaveOrderDetails = async (orderId) => {
        try {
            const updatedDetails = {
                deliveredUnits: editDeliveredUnits !== '' ? Number(editDeliveredUnits) : null,
                paymentAmount: editPaymentAmount !== '' ? Number(editPaymentAmount) : null,
                weight: editWeight !== '' ? Number(editWeight) : null,
            };
            await DispatchApi.updateOrderDetails(orderId, updatedDetails);
            setEditingOrderId(null);
            await fetchTripDetails();
            toast.success('Order details updated');
        } catch (e) {
            setError('Failed to update order details: ' + e.message);
            toast.error('Failed to update order details');
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
            toast.success('Trip closed successfully');
        } catch (e) {
            setError('Failed to close trip: ' + e.message);
            toast.error('Failed to close trip');
        } finally {
            setIsClosingTrip(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;
    if (error) return <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error}</div>;
    if (!trip) return <div className="text-center text-slate-500 py-8">Trip not found.</div>;

    const totalAssignedUnits = trip.orders?.reduce((sum, order) => sum + (order.assignedUnits || 0), 0) || 0;
    const totalDeliveredUnits = trip.orders?.reduce((sum, order) => sum + (order.deliveredUnits || 0), 0) || 0;
    const totalPayments = trip.orders?.reduce((sum, order) => sum + (parseFloat(order.paymentAmount) || 0), 0) || 0;
    const totalWeight = trip.orders?.reduce((sum, order) => sum + (parseFloat(order.weight) || 0), 0) || 0;
    const isTripCompleted = trip.status === 'COMPLETED';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <BackButton />
            </div>
            <Card>
                <CardBody>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">Trip #{trip.id}</h1>
                                <Badge variant={isTripCompleted ? 'success' : 'info'}>{trip.status}</Badge>
                            </div>
                            <p className="text-lg font-medium text-slate-700">{trip.routeName}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Truck size={16} /> {trip.driver?.name}</span>
                                <span className="flex items-center gap-1"><Calendar size={16} /> {trip.tripDate}</span>
                            </div>
                        </div>
                        {!isTripCompleted && (
                            <Button
                                variant="danger"
                                onClick={handleCloseTrip}
                                disabled={isClosingTrip}
                            >
                                {isClosingTrip ? 'Closing...' : 'Close Trip'}
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">Assigned Units</p>
                            <p className="text-xl font-bold text-slate-900">{totalAssignedUnits}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">Delivered Units</p>
                            <p className="text-xl font-bold text-slate-900">{totalDeliveredUnits}</p>
                        </div>
                        <div className="text-center group relative">
                            <p className="text-sm text-slate-500 mb-1">Loaded Weight</p>
                            {isEditingWeight ? (
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 text-sm border rounded"
                                        value={newLoadedWeight}
                                        onChange={(e) => setNewLoadedWeight(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateWeight} className="text-green-600 hover:text-green-700">
                                        <Check size={16} />
                                    </button>
                                    <button onClick={() => setIsEditingWeight(false)} className="text-red-600 hover:text-red-700">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-xl font-bold text-blue-600">{trip.loadedWeight ? `${trip.loadedWeight} kg` : '-'}</p>
                                    {!isTripCompleted && (
                                        <button
                                            onClick={() => {
                                                setNewLoadedWeight(trip.loadedWeight || '');
                                                setIsEditingWeight(true);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">Delivered Weight</p>
                            <p className="text-xl font-bold text-slate-900">{totalWeight.toFixed(2)} kg</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">Remaining Stock</p>
                            <p className={`text-xl font-bold ${trip.stockWeight < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {trip.stockWeight ? `${trip.stockWeight} kg` : '-'}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">Total Payments</p>
                            <p className="text-xl font-bold text-green-600">${totalPayments.toFixed(2)}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {(trip.orders || []).length === 0 && <div className="text-center text-slate-500 py-8">No orders assigned to this trip.</div>}
                        {trip.orders?.sort((a, b) => a.id - b.id).map((order) => (
                            <div
                                key={order.id}
                                className={`border rounded-xl p-5 transition-colors ${order.deliveredUnits !== null && order.assignedUnits !== null && order.deliveredUnits !== order.assignedUnits
                                    ? 'border-yellow-200 bg-yellow-50/50'
                                    : 'border-slate-200 bg-slate-50/50'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-slate-900">{order.vendor?.name}</h3>
                                    <Badge variant={order.status === 'DELIVERED' ? 'success' : 'info'}>
                                        {order.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <Package size={16} />
                                            Assigned
                                        </div>
                                        <div className="font-semibold text-slate-900">{order.assignedUnits}</div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <CheckCircle size={16} />
                                            Delivered
                                        </div>
                                        {editingOrderId === order.id ? (
                                            <Input
                                                type="number"
                                                value={editDeliveredUnits}
                                                onChange={(e) => setEditDeliveredUnits(e.target.value)}
                                                className="h-9"
                                            />
                                        ) : (
                                            <div className="font-semibold text-slate-900">{order.deliveredUnits !== null ? order.deliveredUnits : '-'}</div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <Scale size={16} />
                                            Weight (kg)
                                        </div>
                                        {editingOrderId === order.id ? (
                                            <Input
                                                type="number"
                                                value={editWeight}
                                                onChange={(e) => setEditWeight(e.target.value)}
                                                className="h-9"
                                            />
                                        ) : (
                                            <div className="font-semibold text-slate-900">{order.weight !== null ? order.weight : '-'}</div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <DollarSign size={16} />
                                            Payment
                                        </div>
                                        {editingOrderId === order.id ? (
                                            <Input
                                                type="number"
                                                value={editPaymentAmount}
                                                onChange={(e) => setEditPaymentAmount(e.target.value)}
                                                className="h-9"
                                            />
                                        ) : (
                                            <div className="font-semibold text-green-600">
                                                {order.paymentAmount !== null ? `$${parseFloat(order.paymentAmount).toFixed(2)}` : '-'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    {editingOrderId === order.id ? (
                                        <>
                                            <Button variant="ghost" size="sm" onClick={() => setEditingOrderId(null)}>Cancel</Button>
                                            <Button size="sm" onClick={() => handleSaveOrderDetails(order.id)}>Save Changes</Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEditOrder(order)}
                                            disabled={isTripCompleted}
                                        >
                                            Edit Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
