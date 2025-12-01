import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { VendorApi } from '../services/api';

export default function VendorLedgerPage() {
    const { vendorId } = useParams();
    const [ledgerData, setLedgerData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                setLoading(true);
                const data = await VendorApi.getLedger(vendorId);
                setLedgerData(data);
                setError('');
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLedger();
    }, [vendorId]);

    if (loading) return <div><Navbar /><div className="p-6">Loading ledger...</div></div>;
    if (error) return <div><Navbar /><div className="p-6 text-red-600">{error}</div></div>;
    if (!ledgerData) return <div><Navbar /><div className="p-6">No ledger data found.</div></div>;

    const outstandingBalance = ledgerData.summaries.reduce((acc, summary) => acc + summary.dueAmount, 0);

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h1 className="text-2xl font-bold">{ledgerData.vendorName} - Financial Ledger</h1>
                    <div className="mt-2 text-lg">
                        <span className="font-semibold">Outstanding Balance:</span>
                        <span className={`ml-2 font-bold ${outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${outstandingBalance.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Daily Summaries (Invoices)</h2>
                        <div className="space-y-3">
                            {ledgerData.summaries.map(summary => (
                                <div key={summary.id} className="border-b pb-2">
                                    <p className="font-semibold">Date: {summary.summaryDate}</p>
                                    <p>Calculated Amount: ${summary.calculatedAmount.toFixed(2)}</p>
                                    <p>Total Paid: ${summary.totalPaid.toFixed(2)}</p>
                                    <p className="font-bold">Due: ${summary.dueAmount.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Payments Received</h2>
                        <div className="space-y-3">
                            {ledgerData.payments.map(payment => (
                                <div key={payment.id} className="border-b pb-2">
                                    <p className="font-semibold">Date: {payment.paymentDate}</p>
                                    <p>Amount: ${payment.amount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Method: {payment.paymentMethod}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
