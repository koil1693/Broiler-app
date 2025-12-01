import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { X } from 'lucide-react';

const NewOrderModal = ({ isOpen, onClose, onSave, vendors, date }) => {
  const [vendorId, setVendorId] = useState('');
  const [assignedUnits, setAssignedUnits] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen && vendors.length > 0 && !vendorId) {
      setVendorId(vendors[0].id.toString());
    }
    if (!isOpen) {
      setVendorId('');
      setAssignedUnits('');
      setFormError('');
    }
  }, [isOpen, vendors, vendorId]);

  if (!isOpen) return null;

  const handleSave = () => {
    setFormError('');
    if (!vendorId) {
      setFormError('Please select a vendor.');
      return;
    }
    if (!assignedUnits || assignedUnits <= 0) {
      setFormError('Units must be a positive number.');
      return;
    }
    onSave({
      vendorId: Number(vendorId),
      assignedUnits: Number(assignedUnits),
      orderDate: date,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <Card className="w-full max-w-md p-6 m-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add New Order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center">
            <span className="mr-2">⚠️</span> {formError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor</label>
            <div className="relative">
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
              >
                <option value="">Select a vendor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <Input
            label="Units"
            type="number"
            value={assignedUnits}
            onChange={(e) => setAssignedUnits(e.target.value)}
            placeholder="e.g., 150"
          />
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Order</Button>
        </div>
      </Card>
    </div>
  );
};

export default NewOrderModal;
