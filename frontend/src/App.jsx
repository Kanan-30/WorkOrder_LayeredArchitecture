import { useState, useEffect } from 'react';
import axios from 'axios';

// Configuration
const API_URL = "http://localhost:9095/api/work-orders";

function App() {
  // --- STATE ---
  const [view, setView] = useState('PLANNER'); // PLANNER, MANAGER, FIELD_TECH
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Planner Form State
  const [formData, setFormData] = useState({
    description: '',
    latitude: 40.7128,
    longitude: -74.0065,
    radiusMeters: 10
  });

  // --- EFFECT: Load Data (F11 View Shared Calendar) ---
  useEffect(() => {
    fetchOrders();
  }, [view]); // Refresh when switching roles

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // --- ACTIONS ---

  // F07: Create Work Order
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      alert("Work Order Submitted!");
      fetchOrders(); // Refresh list
      setFormData({...formData, description: ''}); // Reset desc
    } catch (error) {
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  // F10 & F12: Update Status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}/status?status=${newStatus}`);
      fetchOrders();
    } catch (error) {
      alert("Error updating status");
    }
  };

  // --- RENDER HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFLICT_DETECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* Header / Role Switcher */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">UtilityOps Platform</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Current Role:</span>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="bg-slate-700 text-white p-1 rounded border border-slate-600"
            >
              <option value="PLANNER">Planner (Create & View)</option>
              <option value="MANAGER">Ops Manager (Approve)</option>
              <option value="FIELD_TECH">Field Tech (Update)</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">

        {/* --- VIEW: PLANNER (F07, F08, F09, F11) --- */}
        {view === 'PLANNER' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Create Form (F07) */}
            <div className="bg-white p-6 rounded-lg shadow col-span-1 h-fit">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">New Work Order</h2>
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <input type="text" className="w-full border p-2 rounded"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required placeholder="e.g. Trenching" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Lat</label>
                    <input type="number" step="any" className="w-full border p-2 rounded"
                      value={formData.latitude}
                      onChange={e => setFormData({...formData, latitude: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Lon</label>
                    <input type="number" step="any" className="w-full border p-2 rounded"
                      value={formData.longitude}
                      onChange={e => setFormData({...formData, longitude: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Radius (m)</label>
                  <input type="number" className="w-full border p-2 rounded"
                    value={formData.radiusMeters}
                    onChange={e => setFormData({...formData, radiusMeters: e.target.value})} required />
                </div>
                <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                  {loading ? 'Analyzing...' : 'Submit Order'}
                </button>
              </form>
              <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <strong>Simulation Hint:</strong> <br/>
                Lat: 40.7128, Lon: -74.0060 causes a <strong>Conflict</strong>.<br/>
                Change Lon to -74.0080 for <strong>Success</strong>.
              </div>
            </div>

            {/* Shared Calendar / List (F11) */}
            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Work Calendar (F11)</h2>
              <div className="space-y-3">
                {orders.length === 0 && <p className="text-gray-400">No work orders found.</p>}
                {orders.map(order => (
                  <div key={order.id} className="border p-3 rounded flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <h3 className="font-bold text-gray-800">{order.description}</h3>
                      <p className="text-sm text-gray-500">
                        Lat: {order.latitude}, Lon: {order.longitude} | Radius: {order.radiusMeters}m
                      </p>
                      {order.conflictReason && order.status === 'CONFLICT_DETECTED' && (
                        <p className="text-xs text-red-600 mt-1 font-bold">⚠ {order.conflictReason}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: MANAGER (F10) --- */}
        {view === 'MANAGER' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Approval Queue (F10)</h2>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'PENDING_APPROVAL').length === 0
                && <p className="text-gray-400 italic">No pending approvals.</p>}

              {orders.filter(o => o.status === 'PENDING_APPROVAL').map(order => (
                <div key={order.id} className="flex justify-between items-center border p-4 rounded bg-yellow-50 border-yellow-200">
                  <div>
                    <h3 className="font-bold">{order.description}</h3>
                    <p className="text-sm text-gray-600">Location: {order.latitude}, {order.longitude}</p>
                    <p className="text-xs text-green-700 font-bold mt-1">✓ No Conflicts Detected</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-300">
                      Reject
                    </button>
                    <button onClick={() => handleStatusUpdate(order.id, 'APPROVED')}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 shadow">
                      Approve
                    </button>
                  </div>
                </div>
              ))}

              <h3 className="text-md font-bold mt-8 mb-2 text-gray-500">Recently Processed</h3>
              {orders.filter(o => ['APPROVED', 'REJECTED'].includes(o.status)).map(order => (
                <div key={order.id} className="text-sm text-gray-500 border-b py-2 flex justify-between">
                  <span>{order.description}</span>
                  <span className={order.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: FIELD TECH (F12) --- */}
        {view === 'FIELD_TECH' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">My Field Tasks (F12)</h2>

            <div className="space-y-4">
              {/* Ready to Start */}
              {orders.filter(o => o.status === 'APPROVED').map(order => (
                <div key={order.id} className="border p-4 rounded-l-4 border-l-blue-500 bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">READY</span>
                      <h3 className="font-bold text-lg mt-1">{order.description}</h3>
                      <p className="text-sm text-gray-500">Drive to: {order.latitude}, {order.longitude}</p>
                    </div>
                    <button onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Start Work
                    </button>
                  </div>
                </div>
              ))}

              {/* In Progress */}
              {orders.filter(o => o.status === 'IN_PROGRESS').map(order => (
                <div key={order.id} className="border p-4 rounded-l-4 border-l-indigo-500 bg-indigo-50 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded animate-pulse">IN PROGRESS</span>
                      <h3 className="font-bold text-lg mt-1">{order.description}</h3>
                      <p className="text-sm text-gray-500">Site Active</p>
                    </div>
                    <button onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}

              {/* Completed History */}
              <h3 className="text-md font-bold mt-8 mb-2 text-gray-500">Completed Today</h3>
              {orders.filter(o => o.status === 'COMPLETED').map(order => (
                <div key={order.id} className="text-sm text-gray-400 border-b py-2 flex justify-between">
                  <span className="line-through">{order.description}</span>
                  <span>Done</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;