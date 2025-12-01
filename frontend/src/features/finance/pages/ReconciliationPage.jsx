import React, { useState, useEffect } from 'react';
import { VendorApi, ReconciliationApi } from '../../../services/api';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Calculator, Calendar, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

export default function ReconciliationPage() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendorId, setSelectedVendorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [summaryAlreadyExists, setSummaryAlreadyExists] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const v = await VendorApi.list();
                setVendors(v);
                if (v.length > 0) {
                    setSelectedVendorId(v[0].id);
                }
            } catch (e) {
                setError(e.message);
            }
        };
        fetchVendors();
    }, []);

    useEffect(() => {
        const checkSummaryExists = async () => {
            if (selectedVendorId && selectedDate) {
                try {
                    const exists = await ReconciliationApi.summaryExists(selectedVendorId, selectedDate);
                    setSummaryAlreadyExists(exists);
                } catch (e) {
                    console.error("Failed to check summary existence:", e);
                    setSummaryAlreadyExists(false);
                }
            }
        };
        checkSummaryExists();
    }, [selectedVendorId, selectedDate]);


    const handleCalculate = async (e) => {
        e.preventDefault();
        if (!selectedVendorId || !selectedDate) {
            setError('Please select a vendor and a date.');
            return;
        }
        if (summaryAlreadyExists) {
            setError('A summary for this vendor and date already exists. Cannot create a duplicate.');
            return;
        }

        setLoading(true);
        setResult(null);
        setError('');
        try {
            const summary = await ReconciliationApi.calculateDailySummary(selectedVendorId, selectedDate);
            setResult(summary);
            setSummaryAlreadyExists(true);
        } catch (e) {
            if (e.message && e.message.includes("A summary for this vendor and date already exists")) {
                setError('A summary for this vendor and date already exists. Please select a different date or vendor.');
                setSummaryAlreadyExists(true);
            } else {
                setError('Failed to calculate summary: ' + e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Daily Reconciliation</h1>
                <p className="text-slate-500 mt-1">Calculate and save daily financial summaries for vendors</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator size={20} className="text-primary-600" />
                        Calculate Summary
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor</label>
                            <div className="relative">
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                                    value={selectedVendorId}
                                    onChange={(e) => setSelectedVendorId(e.target.value)}
                                >
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Input
                                label="Date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                icon={Calendar}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || summaryAlreadyExists}
                            className="w-full md:w-auto"
                        >
                            {loading ? 'Calculating...' : 'Calculate & Save'}
                        </Button>
                    </form>

                    {summaryAlreadyExists && !loading && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            A summary for this vendor and date already exists.
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                </CardBody>
            </Card>

            {result && (
                <Card className="border-green-200 bg-green-50/30">
                    <CardBody>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Summary Created Successfully!</h3>
                                <p className="text-green-600 text-sm">The daily summary has been saved to the ledger.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-green-100 pt-4">
                            <div>
                                <p className="text-sm text-green-600 mb-1">Date</p>
                                <p className="font-semibold text-green-900">{result.summaryDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-600 mb-1">Calculated Amount</p>
                                <p className="font-semibold text-green-900 text-lg">${result.calculatedAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-600 mb-1">Due Amount</p>
                                <p className="font-semibold text-green-900 text-lg">${result.dueAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
