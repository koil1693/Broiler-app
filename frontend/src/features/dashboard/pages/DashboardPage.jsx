import React, { useEffect, useState } from 'react';
import { TripApi, DispatchApi, VendorApi, ReportApi } from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NewOrderModal from '../../../components/NewOrderModal';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Truck, Plus, TrendingUp, Calendar, User, MapPin, Package, Scale, ArrowRight } from 'lucide-react';

const formatDate = (date) => date.toISOString().slice(0, 10);

export default function DashboardPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [recentTrips, setRecentTrips] = useState([]);
    const [dailySummaries, setDailySummaries] = useState([]);
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

            const [tripsRes, recentTripsRes, vendorsRes, dailySummariesRes] = await Promise.all([
                TripApi.todays({ signal }),
                TripApi.recent({ signal }),
                VendorApi.list(),
                ReportApi.getDailyTripSummaries(startDate, endDate)
            ]);
            setTrips(tripsRes);
            setRecentTrips(recentTripsRes);
            setAllVendors(vendorsRes);
            setDailySummaries(dailySummariesRes);
            setError('');
        } catch (e) {
            if (e.name !== 'AbortError') {
                console.error("Failed to fetch data:", e);
                setError("Could not load dashboard data. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
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

    const totalTrips = dailySummaries.reduce((acc, s) => acc + s.totalTrips, 0);
    const avgTripsPerDay = dailySummaries.length > 0 ? (totalTrips / dailySummaries.length).toFixed(1) : 0;

    return (
        <>
            <NewOrderModal
                isOpen={isNewOrderModalOpen}
                onClose={() => setIsNewOrderModalOpen(false)}
                onSave={handleCreateOrder}
                vendors={allVendors}
                date={today}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{t('todays_overview')}</h1>
                        <p className="text-slate-500 mt-1">{t('manage_daily_trips')}</p>
                    </div>
                    <Button onClick={() => setIsNewOrderModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={20} />
                        {t('create_new_order')}
                    </Button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardBody className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">{t('todays_trips')}</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{trips.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <Truck className="text-primary-600" size={24} />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total (7 Days)</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{totalTrips}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="text-green-600" size={24} />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Avg Per Day</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{avgTripsPerDay}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Today's Trips */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('todays_trips')}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {trips.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {trips.map((t) => (
                                            <Link
                                                key={t.id}
                                                to={`/trips/${t.id}`}
                                                className="group p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                                        <Truck className="text-primary-600 group-hover:text-white" size={20} />
                                                    </div>
                                                    <Badge variant="info">{t.id}</Badge>
                                                </div>
                                                <h4 className="font-semibold text-slate-900 mb-1">{t.routeName || 'Unnamed Route'}</h4>
                                                <p className="text-sm text-slate-600">{t.driver?.name || 'Unassigned Driver'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Truck className="text-slate-400" size={32} />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">{t('no_trips_scheduled')}</h3>
                                        <p className="text-slate-500 mt-1">{t('get_started_by_creating')}</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Recent Trip History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Trip History</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {recentTrips.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Trip ID</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Route</TableHead>
                                                <TableHead>Driver</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Orders</TableHead>
                                                <TableHead className="text-right">Weight</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentTrips.map((trip) => {
                                                const totalWeight = trip.orders?.reduce((sum, o) => sum + (o.weight || 0), 0) || 0;
                                                return (
                                                    <TableRow key={trip.id} className="hover:bg-slate-50">
                                                        <TableCell className="font-medium">#{trip.id}</TableCell>
                                                        <TableCell>{trip.tripDate}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={16} className="text-slate-400" />
                                                                {trip.routeName}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <User size={16} className="text-slate-400" />
                                                                {trip.driver?.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={trip.status === 'COMPLETED' ? 'success' : 'info'}>
                                                                {trip.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Package size={16} className="text-slate-400" />
                                                                {trip.orders?.length || 0}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Scale size={16} className="text-slate-400" />
                                                                {totalWeight.toFixed(2)} kg
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/trips/${trip.id}`)}
                                                                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                                            >
                                                                View <ArrowRight size={16} className="ml-1" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-slate-500 py-8">{t('no_historical_data')}</p>
                                )}
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}
