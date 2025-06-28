import React, { useState, useEffect } from 'react';
import { getAllDevices, assignDeviceToPig, removeDeviceFromPig, getDeviceAssignments } from '../../services/deviceService';
import { getAllPigs } from '../../services/dashboardService';
import { FaMicrochip, FaPiggyBank, FaThermometerHalf, FaHeartbeat, FaUnlink } from 'react-icons/fa';

const DeviceManagement = () => {
    const [pigs, setPigs] = useState([]);
    const [devices, setDevices] = useState([]);
    const [assignedDevices, setAssignedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        device_id: '',
        pig_id: ''
    });

    useEffect(() => {
        loadPigs();
        loadDevices();
        loadAssignedDevices();
    }, []);

    const loadPigs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getAllPigs();
            console.log('Pigs response:', response); // Debug log

            // The response should be an array of pigs
            if (Array.isArray(response)) {
                console.log('Setting pigs:', response); // Debug log
                setPigs(response);
            } else {
                console.error('Invalid pigs data format:', response);
                setError('Failed to load pigs. Invalid data format.');
                setPigs([]);
            }
        } catch (err) {
            console.error('Error loading pigs:', err);
            setError(err.response?.data?.message || 'Failed to load pigs');
            setPigs([]);
        } finally {
            setLoading(false);
        }
    };

    const loadDevices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllDevices();
            console.log('Available devices response:', response);
            if (Array.isArray(response)) {
                setDevices(response);
            } else if (response && Array.isArray(response.data)) {
                setDevices(response.data);
            } else {
                console.error('Invalid devices data format:', response);
                setError('Failed to load devices. Invalid data format.');
                setDevices([]);
            }
        } catch (err) {
            console.error('Error loading devices:', err);
            setError('Failed to load devices');
            setDevices([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAssignedDevices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDeviceAssignments();
            console.log('Assigned devices response:', response);
            // The response is already an array of assignments
            if (Array.isArray(response)) {
                setAssignedDevices(response);
            } else {
                console.error('Invalid assignments data format:', response);
                setAssignedDevices([]);
            }
        } catch (err) {
            console.error('Error loading assigned devices:', err);
            setError('Failed to load assigned devices');
            setAssignedDevices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Check if device exists
            const device = devices.find(d => d.device_id === formData.device_id);
            console.log('Found device:', device); // Debug log

            if (!device) {
                setError('Device ID not found in database');
                return;
            }

            // Check if device is already assigned
            if (device.current_pig) {
                setError('Device is already assigned to a pig');
                return;
            }

            // Check if selected pig already has a device
            const pigHasDevice = devices.some(d => d.current_pig?.id === parseInt(formData.pig_id));
            if (pigHasDevice) {
                setError('This pig already has a device assigned');
                return;
            }

            // Assign device to pig
            await assignDeviceToPig(formData.device_id, formData.pig_id);
            
            setSuccess('Device successfully assigned to pig');
            setFormData({
                device_id: '',
                pig_id: ''
            });
            await loadDevices(); // Reload devices to get updated assignments
        } catch (err) {
            console.error('Assignment error:', err); // Debug log
            setError(err.response?.data?.message || 'Failed to assign device');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDevice = async (deviceId) => {
        try {
            await removeDeviceFromPig(deviceId);
            setSuccess('Device successfully removed from pig');
            await loadAssignedDevices(); // Reload assigned devices
            await loadDevices(); // Reload available devices
        } catch (err) {
            setError('Failed to remove device');
        }
    };

    // Get available pigs (pigs without devices)
    const getAvailablePigs = () => {
        const pigsWithDevices = new Set(devices
            .filter(d => d.current_pig)
            .map(d => d.current_pig.id));
        return pigs.filter(pig => !pigsWithDevices.has(pig.id));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Device Management</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {/* Device Assignment Form */}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Assign Device to Pig</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Device ID</label>
                        <select
                            value={formData.device_id}
                            onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a device</option>
                            {devices
                                .filter(device => !device.current_pig)
                                .map((device) => (
                                    <option key={device.id} value={device.device_id}>
                                        {device.name} (ID: {device.device_id})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Select Pig</label>
                        <select
                            value={formData.pig_id}
                            onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a pig</option>
                            {getAvailablePigs().map((pig) => (
                                <option key={pig.id} value={pig.id}>
                                    {pig.name} (ID: {pig.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Assign Device'}
                    </button>
                </form>
            </div>

            {/* Assigned Devices List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">My Assigned Devices</h2>
                {assignedDevices.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No devices currently assigned to your pigs</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignedDevices.map((assignment) => (
                            <div key={assignment.assignment_id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FaMicrochip className="text-blue-500" />
                                        <h3 className="font-semibold">{assignment.device_name}</h3>
                                    </div>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Device ID:</span> {assignment.device_id}</p>
                                    
                                    <div className="mt-2 pt-2 border-t">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaPiggyBank className="text-purple-500" />
                                                <p><span className="font-medium">Assigned to:</span> {assignment.pig_name}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveDevice(assignment.device_id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Remove device from pig"
                                            >
                                                <FaUnlink />
                                            </button>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            <p>Assigned on: {new Date(assignment.assigned_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Devices List */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Available Devices</h2>
                {devices.filter(device => !device.current_pig).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No available devices</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {devices
                            .filter(device => !device.current_pig)
                            .map((device) => (
                            <div key={device.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FaMicrochip className="text-blue-500" />
                                        <h3 className="font-semibold">{device.name}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {device.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Device ID:</span> {device.device_id}</p>
                                    <p><span className="font-medium">Description:</span> {device.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceManagement; 