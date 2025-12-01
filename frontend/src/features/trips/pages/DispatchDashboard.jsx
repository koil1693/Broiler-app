import React, { useEffect, useState, useCallback } from 'react';
import { DispatchApi, VendorApi, DriverApi, TripApi } from '../../../services/api';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NewOrderModal from '../../../components/NewOrderModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { Truck, Calendar, Plus, Check, X, AlertCircle } from 'lucide-react';

// New Trip Modal component
const NewTripModal = ({ isOpen, onClose, onSave, drivers, date }) => {
    const [routeName, setRouteName] = useState('');
    const [driverId, setDriverId] = useState('');
    const [loadedWeight, setLoadedWeight] = useState('');

    useEffect(() => {
        if (isOpen && drivers.length > 0 && !driverId) {
            setDriverId(drivers[0].id);
        }
    }, [isOpen, drivers, driverId]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!routeName || !driverId) {
            toast.error('Please enter a route name and select a driver.');
            return;
        }
        onSave({
            routeName,
            driverId: Number(driverId),
            tripDate: date,
            loadedWeight: loadedWeight ? parseFloat(loadedWeight) : null
        });
        setRouteName('');
        setDriverId('');
        setLoadedWeight('');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <Card className="w-full max-w-md p-6 m-4 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Create New Trip</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">
                    <Input
                        label="Route Name"
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                        placeholder="e.g., North County Run"
                    />
                    <Input
                        label="Loaded Weight (kg)"
                        type="number"
                        value={loadedWeight}
                        onChange={(e) => setLoadedWeight(e.target.value)}
                        placeholder="e.g., 1000"
                    />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Driver</label>
                        <div className="relative">
                            <select
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                            >
                                <option value="">Select a driver...</option>
                                {drivers.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Create Trip</Button>
                </div>
            </Card>
        </div>
    );
};


const ItemTypes = {
    ORDER: 'order',
};

const OrderCard = ({ order }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ORDER,
        item: { order },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-move hover:shadow-md hover:border-primary-300 transition-all duration-200 group ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">{order.vendor.name}</p>
                    <Badge variant="secondary" className="mt-1">{order.assignedUnits} units</Badge>
                </div>
                <div className="text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>
            </div>
        </div>
    );
};

const TripLane = ({ trip, onDrop, onConfirm, isConfirming }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.ORDER,
        drop: (item) => onDrop(item.order, trip.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`p-4 rounded-xl border transition-all duration-200 ${isOver ? 'bg-primary-50 border-primary-300 shadow-inner' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{trip.routeName}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Truck size={16} className="mr-1" />
                        {trip.driver.name}
                    </div>
                </div>
                <Button
                    size="sm"
                    variant={!trip.isDirty || isConfirming ? 'secondary' : 'primary'}
                    onClick={() => onConfirm(trip.id)}
                    disabled={!trip.isDirty || isConfirming}
                    className={!trip.isDirty || isConfirming ? 'opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}
                >
                    {isConfirming ? 'Confirming...' : 'Confirm Changes'}
                </Button>
            </div>
            <div className="space-y-2 min-h-[80px] bg-slate-50/50 rounded-lg p-2 border border-dashed border-slate-200">
                {trip.orders?.map((order) => (
                    <div key={order.id} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                        <span className="font-medium text-sm text-slate-700">{order.vendor.name}</span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{order.assignedUnits}</span>
                    </div>
                ))}
                {(!trip.orders || trip.orders.length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-4">
                        <Plus size={24} className="mb-1 opacity-50" />
                        <span className="text-xs">Drop orders here</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function DispatchDashboard() {
    const [dispatchData, setDispatchData] = useState({ pendingOrders: [], plannedTrips: [] });
    const [allVendors, setAllVendors] = useState([]);
    const [allDrivers, setAllDrivers] = useState([]);
    const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [data, vendors, drivers] = await Promise.all([
                DispatchApi.getDispatchData(date),
                VendorApi.list(),
                DriverApi.list()
            ]);
            const tripsWithState = data.plannedTrips.map(trip => ({ ...trip, isDirty: false }));
            setDispatchData({ ...data, plannedTrips: tripsWithState });
            setAllVendors(vendors);
            setAllDrivers(drivers);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [date, fetchData]);

    const handleDrop = (order, targetId) => {
        setDispatchData(currentData => {
            let newPending = [...currentData.pendingOrders];
            let newTrips = currentData.plannedTrips.map(trip => ({ ...trip, orders: trip.orders ? [...trip.orders] : [] }));

            // Remove order from its current local state location (if it exists there)
            newPending = newPending.filter(o => o.id !== order.id);
            newTrips = newTrips.map(trip => ({
                ...trip,
                orders: trip.orders.filter(o => o.id !== order.id),
                isDirty: trip.orders.some(o => o.id === order.id) ? true : trip.isDirty
            }));

            // Add order to the new target in local state
            if (targetId === 'pending') {
                DispatchApi.unassignOrder(order.id)
                    .then(() => {
                        fetchData();
                    })
                    .catch(err => {
                        console.error("Failed to unassign order on backend:", err);
                        err.text().then(text => {
                            try {
                                const errorBody = JSON.parse(text);
                                toast.error(`Failed to unassign order: ${errorBody.message || errorBody.error || "Unknown error"}`);
                            } catch {
                                toast.error(`Failed to unassign order: ${text || err.message || "Unknown error"}`);
                            }
                        }).catch(() => {
                            toast.error(`Failed to unassign order: ${err.message || "Unknown error"}`);
                        });
                        fetchData();
                    });
            } else { // Dropping into a trip lane
                newTrips = newTrips.map(trip => {
                    if (trip.id === targetId) {
                        if (!trip.orders.some(o => o.id === order.id)) {
                            trip.orders.push({ ...order, trip: { id: targetId } });
                        }
                        return { ...trip, isDirty: true };
                    }
                    return trip;
                });
            }

            return { pendingOrders: newPending, plannedTrips: newTrips };
        });
    };

    const handleConfirmTrip = async (tripId) => {
        const tripToConfirm = dispatchData.plannedTrips.find(t => t.id === tripId);
        if (!tripToConfirm || !tripToConfirm.isDirty) return;

        const orderIds = tripToConfirm.orders.map(o => o.id);

        setIsConfirming(tripId);
        try {
            await DispatchApi.assignOrdersToTrip(tripId, orderIds);
            toast.success('Trip confirmed successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to confirm trip:', error);
            toast.error('Error: Could not confirm trip. ' + error.message);
        } finally {
            setIsConfirming(null);
        }
    };

    const handleCreateOrder = async (newOrder) => {
        try {
            await DispatchApi.createOrder(newOrder);
            setIsNewOrderModalOpen(false);
            toast.success('Order created successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create order:', error);
            toast.error('Error: Could not create order. ' + error.message);
        }
    };

    const handleCreateTrip = async (newTrip) => {
        try {
            await TripApi.createTrip(newTrip);
            setIsNewTripModalOpen(false);
            toast.success('Trip created successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create trip:', error);
            toast.error('Error: Could not create trip. ' + error.message);
        }
    };

    const PendingOrdersDropTarget = ({ children }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ItemTypes.ORDER,
            drop: (item) => handleDrop(item.order, 'pending'),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        return (
            <div ref={drop} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col transition-colors ${isOver ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900">Pending Orders</h2>
                        <p className="text-sm text-slate-500">Drag to assign</p>
                    </div>
                    <Button
                        onClick={() => setIsNewOrderModalOpen(true)}
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                    >
                        <Plus size={20} />
                    </Button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                    {dispatchData.pendingOrders.length === 0 && (
                        <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-100 rounded-xl">
                            <p>No pending orders</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                <NewOrderModal
                    isOpen={isNewOrderModalOpen}
                    onClose={() => setIsNewOrderModalOpen(false)}
                    onSave={handleCreateOrder}
                    vendors={allVendors}
                    date={date}
                />
                <NewTripModal
                    isOpen={isNewTripModalOpen}
                    onClose={() => setIsNewTripModalOpen(false)}
                    onSave={handleCreateTrip}
                    drivers={allDrivers}
                    date={date}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dispatch Operations</h1>
                        <p className="text-slate-500 mt-1">Drag and drop orders to assign them to trips</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
                        <Button onClick={() => setIsNewTripModalOpen(true)} size="sm">Create New Trip</Button>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center px-2">
                            <Calendar size={16} className="text-slate-400 mr-2" />
                            <input
                                type="date"
                                className="border-none bg-transparent text-slate-700 font-medium focus:ring-0 cursor-pointer outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-240px)]">
                    <div className="lg:col-span-1 h-full">
                        <PendingOrdersDropTarget>
                            {dispatchData.pendingOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </PendingOrdersDropTarget>
                    </div>

                    <div className="lg:col-span-3 h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-bold text-xl text-slate-900 mb-6">Planned Trips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
                            {dispatchData.plannedTrips.map((trip) => (
                                <TripLane
                                    key={trip.id}
                                    trip={trip}
                                    onDrop={handleDrop}
                                    onConfirm={handleConfirmTrip}
                                    isConfirming={isConfirming === trip.id}
                                />
                            ))}
                            {dispatchData.plannedTrips.length === 0 && (
                                <div className="col-span-full text-center text-slate-400 py-20 border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-lg">No trips planned for this date.</p>
                                    <Button variant="ghost" onClick={() => setIsNewTripModalOpen(true)} className="mt-2 text-primary-600 hover:text-primary-700">
                                        Create your first trip
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
