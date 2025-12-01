import React, { useEffect, useState } from 'react';
import { VendorApi } from '../../../services/api';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Users, ExternalLink } from 'lucide-react';

export default function VendorMasterPage() {
    const [vendors, setVendors] = useState([]);
    const [newVendorName, setNewVendorName] = useState('');
    const [newVendorOffset, setNewVendorOffset] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            // Fetch financial summaries which includes vendor details
            const v = await VendorApi.getFinancials();
            setVendors(v);
            setError('');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleCreateVendor = async (e) => {
        e.preventDefault();
        try {
            await VendorApi.create({ name: newVendorName, rateOffset: newVendorOffset });
            setNewVendorName('');
            setNewVendorOffset(0);
            await fetchVendors();
        } catch (e) {
            setError('Failed to create vendor: ' + e.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Vendor Master</h1>
                <p className="text-slate-500 mt-1">Manage your vendor relationships</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Vendor</CardTitle>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleCreateVendor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <Input
                            label="Vendor Name"
                            value={newVendorName}
                            onChange={(e) => setNewVendorName(e.target.value)}
                            required
                        />
                        <Input
                            label="Rate Offset"
                            type="number"
                            step="0.01"
                            value={newVendorOffset}
                            onChange={(e) => setNewVendorOffset(e.target.value)}
                            required
                        />
                        <Button type="submit">Create Vendor</Button>
                    </form>
                    {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-slate-600" />
                        <CardTitle>All Vendors</CardTitle>
                    </div>
                </CardHeader>
                <CardBody>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                        </div>
                    ) : vendors.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor Name</TableHead>
                                    <TableHead className="text-right">Total Billed</TableHead>
                                    <TableHead className="text-right">Total Paid</TableHead>
                                    <TableHead className="text-right">Outstanding Balance</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.map(vendor => (
                                    <TableRow key={vendor.vendorId}>
                                        <TableCell className="font-semibold">{vendor.vendorName}</TableCell>
                                        <TableCell className="text-right text-slate-600">${vendor.totalBilled.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-green-600">${vendor.totalPaid.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right font-bold ${vendor.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                            ${vendor.outstandingBalance.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                to={`/vendors/${vendor.vendorId}/ledger`}
                                                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                                            >
                                                View Ledger
                                                <ExternalLink size={14} />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No vendors found. Create one to get started.</p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
