import React, { useEffect, useState } from 'react';
import { DriverApi } from '../../../services/api';

export default function DriverMasterPage() {
    const [drivers, setDrivers] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    const [newDriverUsername, setNewDriverUsername] = useState('');
    const [newDriverPassword, setNewDriverPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const d = await DriverApi.list();
            setDrivers(d);
            setError('');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleCreateDriver = async (e) => {
        e.preventDefault();
        try {
            await DriverApi.create({
                name: newDriverName,
                username: newDriverUsername,
                password: newDriverPassword
            });
            setNewDriverName('');
            setNewDriverUsername('');
            setNewDriverPassword('');
            await fetchDrivers();
        } catch (e) {
            setError('Failed to create driver: ' + e.message);
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Driver Master</h1>

                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Driver</h2>
                    <form onSubmit={handleCreateDriver} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newDriverName}
                                onChange={(e) => setNewDriverName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newDriverUsername}
                                onChange={(e) => setNewDriverUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newDriverPassword}
                                onChange={(e) => setNewDriverPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-semibold rounded-md px-4 py-2">
                            Create Driver
                        </button>
                    </form>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">All Drivers</h2>
                    {loading ? (
                        <p>Loading drivers...</p>
                    ) : (
                        <div className="space-y-4">
                            {drivers.map(driver => (
                                <div key={driver.id} className="border-b pb-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{driver.name}</p>
                                        <p className="text-sm text-gray-600">Username: {driver.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
