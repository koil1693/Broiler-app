import React, { useEffect, useState } from 'react';
import { RateApi } from '../../../services/api';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { DollarSign, Save, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const initialRateCard = { baseRate: 0, vendorOffsets: [] };

export default function RateManagementPage() {
    const [rateCard, setRateCard] = useState(initialRateCard);
    const [status, setStatus] = useState({ loading: true, error: null, success: null });

    useEffect(() => {
        fetchRateCard();
    }, []);

    const fetchRateCard = async () => {
        try {
            setStatus({ loading: true, error: null, success: null });
            const data = await RateApi.getRateCard();
            setRateCard(data);
            setStatus({ loading: false, error: null, success: null });
        } catch (err) {
            setStatus({ loading: false, error: 'Failed to load rate card. ' + err.message, success: null });
        }
    };

    const handleBaseRateChange = (e) => {
        setRateCard({ ...rateCard, baseRate: Number(e.target.value) });
    };

    const handleOffsetChange = (vendorId, newOffset) => {
        const updatedOffsets = rateCard.vendorOffsets.map(v =>
            v.vendorId === vendorId ? { ...v, offset: Number(newOffset) } : v
        );
        setRateCard({ ...rateCard, vendorOffsets: updatedOffsets });
    };

    const handleSaveChanges = async () => {
        try {
            setStatus({ loading: true, error: null, success: null });
            await RateApi.saveRateCard(rateCard);
            setStatus({ loading: false, error: null, success: 'Rate card updated successfully!' });
            setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 3000);
        } catch (err) {
            setStatus({ loading: false, error: 'Failed to save changes. ' + err.message, success: null });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Rate Management</h1>
                    <p className="text-slate-500 mt-1">Manage daily base rates and vendor-specific adjustments</p>
                </div>
                <Button
                    onClick={handleSaveChanges}
                    disabled={status.loading}
                    className="flex items-center gap-2"
                >
                    {status.loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    {status.error}
                </div>
            )}
            {status.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle size={20} />
                    {status.success}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-600" />
                        Daily Base Rate
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="max-w-xs">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-slate-500 font-medium">$</span>
                            </div>
                            <input
                                type="number"
                                className="w-full border border-slate-300 rounded-lg pl-7 pr-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-lg font-medium text-slate-900"
                                value={rateCard.baseRate}
                                onChange={handleBaseRateChange}
                                disabled={status.loading}
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">This is the standard rate applied to all trips before adjustments.</p>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign size={20} className="text-primary-600" />
                        Vendor Offsets
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {rateCard.vendorOffsets.map(v => (
                            <div key={v.vendorId} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:border-primary-200">
                                <div className="font-medium text-slate-900">{v.vendorName}</div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-500">Offset:</span>
                                    <div className="relative w-32">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 font-medium">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-right font-medium"
                                            value={v.offset}
                                            onChange={(e) => handleOffsetChange(v.vendorId, e.target.value)}
                                            disabled={status.loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {rateCard.vendorOffsets.length === 0 && (
                            <div className="text-center py-8 text-slate-400">No vendors found.</div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
