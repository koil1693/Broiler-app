import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { VendorApi } from '../services/api';
import { Link } from 'react-router-dom'; // Import Link

export default function VendorMasterPage() {
    const [vendors, setVendors] = useState([]);
    const [newVendorName, setNewVendorName] = useState('');
    const [newVendorOffset, setNewVendorOffset] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const v = await VendorApi.list();
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
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Vendor Master</h1>
                
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Vendor</h2>
                    <form onSubmit={handleCreateVendor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newVendorName}
                                onChange={(e) => setNewVendorName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rate Offset</label>
                            <input
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newVendorOffset}
                                onChange={(e) => setNewVendorOffset(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-semibold rounded-md px-4 py-2">
                            Create Vendor
                        </button>
                    </form>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">All Vendors</h2>
                    {loading ? (
                        <p>Loading vendors...</p>
                    ) : (
                        <div className="space-y-4">
                            {vendors.map(vendor => (
                                <div key={vendor.id} className="border-b pb-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{vendor.name}</p>
                                        <p className="text-sm text-gray-600">Rate Offset: {vendor.rateOffset}</p>
                                    </div>
                                    <Link to={`/vendors/${vendor.id}/ledger`} className="text-blue-600 hover:underline text-sm font-semibold">
                                        View Ledger
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
