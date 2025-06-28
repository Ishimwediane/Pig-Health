import React, { useEffect, useState } from "react";
import { getAllPigs, fetchHealthRecords, fetchVaccinationRecords, deletePigById, updatePig } from "../../services/dashboardService";
import { getAllDevices, assignDeviceToPig, removeDeviceFromPig } from "../../services/deviceService";
import AddPigModal from "./AddPigModal";
import { FaEdit, FaTrash, FaPlus, FaHeartbeat, FaSyringe, FaUserMd, FaMicrochip, FaThermometerHalf, FaTimes, FaPencilAlt } from "react-icons/fa";

const PigHealth = () => {
  const [pigs, setPigs] = useState([]);
  const [selectedPig, setSelectedPig] = useState(null);
  const [showAddPigModal, setShowAddPigModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [vetRequests, setVetRequests] = useState([]);
  const [devices, setDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    temperature: '',
    heartbeat: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editPigData, setEditPigData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    health_status: '',
    notes: ''
  });

  useEffect(() => {
    loadPigs();
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await getAllDevices();
      setDevices(data);
    } catch (error) {
      console.error("Failed to load devices:", error);
    }
  };

  const loadPigs = async () => {
    try {
      const data = await getAllPigs();
      setPigs(data);
    } catch (error) {
      console.error("Failed to load pigs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPig = () => {
    setShowAddPigModal(true);
  };

  const handlePigAdded = async () => {
    setShowAddPigModal(false);
    await loadPigs();
  };

  const handleDeletePig = async (pigId) => {
    if (window.confirm("Are you sure you want to delete this pig?")) {
      try {
        await deletePigById(pigId);
        await loadPigs();
      } catch (error) {
        console.error("Failed to delete pig:", error);
      }
    }
  };

  const handlePigSelect = async (pig) => {
    setSelectedPig(pig);
    try {
      // Load health records
      const healthData = await fetchHealthRecords(pig.id);
      console.log('Health data for pig:', healthData);
      setHealthRecords(healthData || []);

      // Load vaccination records
      const vaccinationData = await fetchVaccinationRecords(pig.id);
      setVaccinationRecords(vaccinationData || []);
      
      // Find device assigned to this pig
      console.log('Available devices:', devices);
      const assignedDevice = devices.find(d => {
        console.log('Checking device:', d);
        return d.current_pig && d.current_pig.id === pig.id;
      });
      console.log('Found assigned device:', assignedDevice);
      
      if (assignedDevice) {
        setDeviceData(assignedDevice);
      } else {
        setDeviceData(null);
      }
    } catch (error) {
      console.error("Failed to load pig details:", error);
      setHealthRecords([]);
      setVaccinationRecords([]);
      setDeviceData(null);
    }
  };

  const handleAssignDevice = async (deviceId, pigId) => {
    try {
      console.log('Assigning device:', deviceId, 'to pig:', pigId);
      await assignDeviceToPig(deviceId, pigId);
      await loadDevices(); // Reload devices to get updated assignments
      
      // Update device data if this is the selected pig
      if (selectedPig?.id === pigId) {
        const updatedDevices = await getAllDevices();
        const updatedDevice = updatedDevices.find(d => d.device_id === deviceId);
        console.log('Updated device after assignment:', updatedDevice);
        setDeviceData(updatedDevice);
      }
    } catch (error) {
      console.error("Failed to assign device:", error);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    try {
      await removeDeviceFromPig(deviceId);
      await loadDevices();
      setDeviceData(null);
    } catch (error) {
      console.error("Failed to remove device:", error);
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setEditFormData({
      temperature: record.temperature,
      heartbeat: record.heartbeat,
      notes: record.notes
    });
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement updateHealthRecord service call
      await updateHealthRecord(editingRecord.id, editFormData);
      setEditingRecord(null);
      // Reload health records
      const healthData = await fetchHealthRecords(selectedPig.id);
      setHealthRecords(healthData);
    } catch (error) {
      console.error("Failed to update health record:", error);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this health record?")) {
      try {
        // TODO: Implement deleteHealthRecord service call
        await deleteHealthRecord(recordId);
        // Reload health records
        const healthData = await fetchHealthRecords(selectedPig.id);
        setHealthRecords(healthData);
      } catch (error) {
        console.error("Failed to delete health record:", error);
      }
    }
  };

  const handleEditPig = (pig) => {
    setEditPigData({
      name: pig.name,
      breed: pig.breed,
      age: pig.age,
      weight: pig.weight,
      gender: pig.gender,
      health_status: pig.health_status,
      notes: pig.notes || ''
    });
    setIsEditing(true);
  };

  const handleUpdatePig = async (e) => {
    e.preventDefault();
    try {
      await updatePig(selectedPig.id, editPigData);
      setIsEditing(false);
      await loadPigs(); // Reload pigs to get updated data
      // Update selected pig with new data
      const updatedPig = await getAllPigs().then(pigs => pigs.find(p => p.id === selectedPig.id));
      setSelectedPig(updatedPig);
    } catch (error) {
      console.error("Failed to update pig:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pig Health Management</h1>
          <button
            onClick={handleAddPig}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add New Pig
          </button>
        </div>

        {/* Pigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pigs.map((pig) => (
            <div
              key={pig.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{pig.name}</h3>
                    <p className="text-sm text-gray-600">Breed: {pig.breed?.name || "Unknown"}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    pig.health_status?.toLowerCase().includes("sick")
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {pig.health_status || "Healthy"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{pig.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{pig.gender}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => handlePigSelect(pig)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePig(pig.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Pig Details Modal */}
        {selectedPig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editPigData.name}
                        onChange={(e) => setEditPigData({ ...editPigData, name: e.target.value })}
                        className="text-2xl font-bold text-gray-800 border rounded p-1"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-800">{selectedPig.name}</h2>
                    )}
                    <p className="text-sm text-gray-600">Breed: {selectedPig.breed?.name || "Unknown"}</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdatePig}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditPig(selectedPig)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPig(null);
                        setIsEditing(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                </div>

                {/* Pig Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Age</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPigData.age}
                        onChange={(e) => setEditPigData({ ...editPigData, age: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <p className="font-medium">{selectedPig.age} years</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Gender</p>
                    {isEditing ? (
                      <select
                        value={editPigData.gender}
                        onChange={(e) => setEditPigData({ ...editPigData, gender: e.target.value })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <p className="font-medium capitalize">{selectedPig.gender}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Health Status</p>
                    {isEditing ? (
                      <select
                        value={editPigData.health_status}
                        onChange={(e) => setEditPigData({ ...editPigData, health_status: e.target.value })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="healthy">Healthy</option>
                        <option value="sick">Sick</option>
                        <option value="under_observation">Under Observation</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedPig.health_status || "Healthy"}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Weight</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPigData.weight}
                        onChange={(e) => setEditPigData({ ...editPigData, weight: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <p className="font-medium">{selectedPig.weight || "N/A"} kg</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Notes</p>
                      <textarea
                        value={editPigData.notes}
                        onChange={(e) => setEditPigData({ ...editPigData, notes: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows="3"
                        placeholder="Add any additional notes about the pig..."
                      />
                    </div>
                  </div>
                )}

                {/* Device Management Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMicrochip className="text-purple-600" />
                    <h3 className="text-lg font-semibold">Device Management</h3>
                  </div>
                  
                  {deviceData ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{deviceData.name}</p>
                          <p className="text-sm text-gray-600">Device ID: {deviceData.device_id}</p>
                          <p className="text-sm text-gray-600">Status: {deviceData.status}</p>
                          {deviceData.health_monitoring && deviceData.health_monitoring[0] && (
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <FaThermometerHalf className="text-orange-500" />
                                <p className="text-sm text-gray-600">
                                  Temperature: {deviceData.health_monitoring[0].temperature}°C
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaHeartbeat className="text-red-500" />
                                <p className="text-sm text-gray-600">
                                  Heartbeat: {deviceData.health_monitoring[0].heartbeat} bpm
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDevice(deviceData.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove Device
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-500">No device assigned</p>
                      <div className="flex flex-wrap gap-2">
                        {devices.filter(d => !d.current_pig).map(device => (
                          <button
                            key={device.id}
                            onClick={() => handleAssignDevice(device.device_id, selectedPig.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                          >
                            Assign {device.name} ({device.device_id})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Health Records Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaHeartbeat className="text-red-600" />
                    <h3 className="text-lg font-semibold">Health Records</h3>
                  </div>
                  {healthRecords.length > 0 ? (
                    <div className="space-y-3">
                      {healthRecords.map((record) => (
                        <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                          {editingRecord?.id === record.id ? (
                            <form onSubmit={handleUpdateRecord} className="space-y-3">
                              <div>
                                <label className="block text-sm text-gray-600">Temperature (°C)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={editFormData.temperature}
                                  onChange={(e) => setEditFormData({ ...editFormData, temperature: e.target.value })}
                                  className="w-full p-2 border rounded"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600">Heartbeat (bpm)</label>
                                <input
                                  type="number"
                                  value={editFormData.heartbeat}
                                  onChange={(e) => setEditFormData({ ...editFormData, heartbeat: e.target.value })}
                                  className="w-full p-2 border rounded"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600">Notes</label>
                                <textarea
                                  value={editFormData.notes}
                                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                  className="w-full p-2 border rounded"
                                  rows="3"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRecord(null)}
                                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Date: {new Date(record.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-800">{record.notes || 'No notes'}</p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Temperature: {record.temperature || 0}°C
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Heartbeat: {record.heartbeat || 0} bpm
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditRecord(record)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit record"
                                >
                                  <FaPencilAlt />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete record"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">No health records available</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">Temperature: 0°C</p>
                        <p className="text-sm text-gray-600">Heartbeat: 0 bpm</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vaccination Records Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaSyringe className="text-blue-600" />
                    <h3 className="text-lg font-semibold">Vaccination Records</h3>
                  </div>
                  {vaccinationRecords.length > 0 ? (
                    <div className="space-y-3">
                      {vaccinationRecords.map((record, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{record.vaccine_name}</p>
                              <p className="text-sm text-gray-600">
                                Date: {new Date(record.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No vaccination records available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddPigModal && (
          <AddPigModal
            onClose={() => setShowAddPigModal(false)}
            onSubmit={handlePigAdded}
          />
        )}
      </div>
    </div>
  );
};

export default PigHealth; 