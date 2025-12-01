import React, { useEffect, useState } from 'react';
import { ReconciliationApi } from '../../../services/api';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { Calendar, DollarSign, FileText, CheckCircle, AlertCircle, TrendingUp, CreditCard } from 'lucide-react';

export default function DailyOverviewPage() {
    const [dailyOverview, setDailyOverview] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [finalizingSummaryId, setFinalizingSummaryId] = useState(null);

    const fetchDailyOverview = async () => {
        try {
            setLoading(true);
            const data = await ReconciliationApi.getDailyOverview(date);
            setDailyOverview(data);
            setError('');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyOverview();
    }, [date]);

    const handleFinalizeSummary = async (summaryId) => {
        if (!window.confirm('Are you sure you want to finalize this daily summary? This action cannot be undone.')) {
            return;
        }
        setFinalizingSummaryId(summaryId);
        try {
            await ReconciliationApi.finalizeSummary(summaryId);
            await fetchDailyOverview();
        } catch (e) {
            setError('Failed to finalize summary: ' + e.message);
        } finally {
            setFinalizingSummaryId(null);
        }
    };

    if (loading && !dailyOverview) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;
    if (error && !dailyOverview) return <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error}</div>;
    if (!dailyOverview) return <div className="text-center text-slate-500 py-8">No data for this date.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daily Financial Overview</h1>
                    <p className="text-slate-500 mt-1">Overview of daily transactions and summaries</p>
                </div>
                <div className="w-full md:w-auto">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        icon={Calendar}
                        className="w-full md:w-48"
                    />
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-1">
                                <TrendingUp size={16} /> Total Calculated
                            </div>
                            <div className="text-2xl font-bold text-slate-900">${dailyOverview.totalCalculatedAmount.toFixed(2)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-1">
                                <DollarSign size={16} /> Total Paid
                            </div>
                            <div className="text-2xl font-bold text-green-600">${dailyOverview.totalPaidAmount.toFixed(2)}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-1">
                                <AlertCircle size={16} /> Total Due
                            </div>
                            <div className="text-2xl font-bold text-red-600">${dailyOverview.totalDueAmount.toFixed(2)}</div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText size={20} className="text-primary-600" />
                            Daily Summaries
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {dailyOverview.dailySummaries.length === 0 && <p className="text-center text-slate-500 py-4">No summaries for this date.</p>}
                            {dailyOverview.dailySummaries.map(summary => (
                                <div key={summary.id} className="border rounded-xl p-4 bg-slate-50/50 border-slate-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{summary.vendor.name}</h3>
                                            <p className="text-xs text-slate-500">{summary.summaryDate}</p>
                                        </div>
                                        <Badge variant={summary.isFinalized ? 'success' : 'warning'}>
                                            {summary.isFinalized ? 'Finalized' : 'Pending'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                        <div>
                                            <span className="text-slate-500 block text-xs">Calculated</span>
                                            <span className="font-semibold">${summary.calculatedAmount.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs">Paid</span>
                                            <span className="font-semibold text-green-600">${summary.totalPaid.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs">Due</span>
                                            <span className="font-semibold text-red-600">${summary.dueAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {!summary.isFinalized && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleFinalizeSummary(summary.id)}
                                            disabled={finalizingSummaryId === summary.id}
                                            className="w-full"
                                        >
                                            {finalizingSummaryId === summary.id ? 'Finalizing...' : 'Finalize Summary'}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard size={20} className="text-primary-600" />
                            Payments Recorded
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {dailyOverview.dailyPayments.length === 0 && <p className="text-center text-slate-500 py-4">No payments for this date.</p>}
                            {dailyOverview.dailyPayments.map(payment => (
                                <div key={payment.id} className="border rounded-xl p-4 bg-slate-50/50 border-slate-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{payment.vendor.name}</h3>
                                        <p className="text-xs text-slate-500">{payment.paymentDate} • {payment.paymentMethod}</p>
                                        {payment.notes && <p className="text-xs text-slate-600 mt-1 italic">"{payment.notes}"</p>}
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-bold text-green-600">+${payment.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
