import React, { useState, useEffect } from 'react';
import { VendorApi, ReconciliationApi } from '../../../services/api';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { DollarSign, Calendar, FileText, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentEntryPage() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendorId, setSelectedVendorId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [notes, setNotes] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
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

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        if (!selectedVendorId || !amount || parseFloat(amount) <= 0 || !paymentMethod || !paymentDate) {
            setError('Please fill all required fields with valid data.');
            return;
        }
        setLoading(true);
        setResult(null);
        setError('');
        try {
            const payment = await ReconciliationApi.recordPayment({
                vendorId: selectedVendorId,
                amount: parseFloat(amount),
                paymentMethod,
                notes,
                paymentDate
            });
            setResult(payment);
            setAmount('');
            setNotes('');
            setPaymentMethod('Cash');
        } catch (e) {
            setError('Failed to record payment: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Record Payment</h1>
                <p className="text-slate-500 mt-1">Record a new payment to a vendor</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard size={20} className="text-primary-600" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleRecordPayment} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <Input
                                        label="Payment Date"
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        icon={Calendar}
                                    />
                                    <Input
                                        label="Amount"
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        icon={DollarSign}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option>Cash</option>
                                                <option>Bank Transfer</option>
                                                <option>Check</option>
                                                <option>Other</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 text-slate-400">
                                                <FileText size={18} />
                                            </div>
                                            <textarea
                                                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all min-h-[100px]"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Any additional notes..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading} className="min-w-[150px]">
                                        {loading ? 'Recording...' : 'Record Payment'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {result && (
                        <Card className="border-green-200 bg-green-50/30">
                            <CardBody>
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600 mb-3">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-800">Payment Recorded!</h3>
                                    <p className="text-green-600 text-sm">Transaction has been successfully saved.</p>
                                </div>

                                <div className="space-y-3 border-t border-green-100 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Vendor</span>
                                        <span className="font-semibold text-green-900">{result.vendor.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Amount</span>
                                        <span className="font-semibold text-green-900">${result.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Date</span>
                                        <span className="font-semibold text-green-900">{result.paymentDate}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Method</span>
                                        <span className="font-semibold text-green-900">{result.paymentMethod}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setResult(null)}
                                >
                                    Record Another
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
