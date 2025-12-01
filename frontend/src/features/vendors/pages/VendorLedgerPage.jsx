import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VendorApi } from '../../../services/api';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { DollarSign, Receipt, CreditCard, ArrowRightLeft } from 'lucide-react';

import BackButton from '../../../components/ui/BackButton';

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    if (!ledgerData) {
        return <div className="text-center text-slate-500 py-8">No ledger data found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{ledgerData.vendorName}</h1>
                    <p className="text-slate-500 mt-1">Financial Ledger</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Billed</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                ${ledgerData.totalCalculatedAmount.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Receipt className="text-blue-600" size={24} />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Paid</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                ${ledgerData.totalPaidAmount.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CreditCard className="text-green-600" size={24} />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Outstanding Balance</p>
                            <p className={`text-2xl font-bold mt-1 ${ledgerData.totalDueAmount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                ${ledgerData.totalDueAmount.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-red-600" size={24} />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Unified Transaction History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft size={20} className="text-slate-600" />
                        <CardTitle>Transaction History</CardTitle>
                    </div>
                </CardHeader>
                <CardBody>
                    {ledgerData.ledgerEntries.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit (Bill)</TableHead>
                                    <TableHead className="text-right">Credit (Paid)</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgerData.ledgerEntries.map((entry, index) => (
                                    <React.Fragment key={`${entry.referenceId}-${index}`}>
                                        <TableRow>
                                            <TableCell className="font-medium">{entry.date}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={entry.type === 'INVOICE' ? 'warning' : 'success'}>
                                                            {entry.type}
                                                        </Badge>
                                                        <span className="text-slate-700">{entry.description}</span>
                                                    </div>
                                                    {entry.tripDetails && entry.tripDetails.length > 0 && (
                                                        <div className="mt-2 pl-2 border-l-2 border-slate-200">
                                                            <p className="text-xs font-semibold text-slate-500 mb-1">Trip Details:</p>
                                                            <ul className="text-xs text-slate-600 space-y-1">
                                                                {entry.tripDetails.map(trip => (
                                                                    <li key={trip.tripId} className="flex gap-2">
                                                                        <span className="font-medium">#{trip.tripId}</span>
                                                                        <span>{trip.routeName}</span>
                                                                        <span>• {trip.driverName}</span>
                                                                        <span>• {trip.units} units</span>
                                                                        <span>• {trip.weight} kg</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-slate-600">
                                                {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600">
                                                {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">
                                                ${entry.balance.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No transactions found.</p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
