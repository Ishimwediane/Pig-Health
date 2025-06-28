import React, { useState, useEffect } from 'react';
import { FaUserMd, FaPhone, FaEnvelope, FaComments, FaFileAlt, FaCheck, FaTimes, FaClock, FaSyringe, FaCalendarAlt } from 'react-icons/fa';
import VetRequestModal from './VetRequestModal';
import ChatSystem from './ChatSystem';
import { 
  getVeterinarians, 
  getFarmerRequests, 
  createVetRequest,
  updateRequestStatus,
  rescheduleRequest,
  getVaccinationRecords
} from '../../services/vetService';

const VeterinaryService = () => {
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [vetRequests, setVetRequests] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch veterinarians
      console.log('Starting to fetch veterinarians...');
      const vetsData = await getVeterinarians();
      console.log('Received vets data:', vetsData);
      
      if (Array.isArray(vetsData) && vetsData.length > 0) {
        console.log('Setting vets data:', vetsData);
        setVets(vetsData);
      } else {
        console.warn('No vets data received or empty array');
        setVets([]);
      }

      // Fetch farmer's vet requests
      const requestsData = await getFarmerRequests();
      console.log('Requests Data:', requestsData);
      setVetRequests(requestsData);

      // Fetch vaccination records
      const vaccinationData = await getVaccinationRecords();
      console.log('Vaccination Data:', vaccinationData);
      setVaccinationRecords(vaccinationData);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestVet = (vet) => {
    setSelectedVet(vet);
    setShowRequestModal(true);
  };

  const handleChatWithVet = (vet) => {
    const acceptedRequest = vetRequests.find(
      request => request.vet_id === vet.id && request.status === 'accepted'
    );
    
    if (acceptedRequest) {
      setSelectedVet(vet);
      setSelectedRequest(acceptedRequest);
      setShowChat(true);
    } else {
      alert('You can only chat with veterinarians who have accepted your request.');
    }
  };

  const handleSubmitRequest = async (requestData) => {
    try {
      const newRequest = await createVetRequest({
        ...requestData,
        vet_id: selectedVet.id
      });
      setVetRequests(prev => [newRequest, ...prev]);
      setShowRequestModal(false);
    } catch (error) {
      alert('Failed to submit request. Please try again.');
      console.error('Error submitting request:', error);
    }
  };

  const handleRescheduleRequest = (request) => {
    setSelectedRequest(request);
    setShowRescheduleModal(true);
  };

  const handleUpdateSchedule = async (newDateTime) => {
    try {
      await rescheduleRequest(selectedRequest.id, newDateTime);
      // Update the request in the list
      setVetRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, scheduled_time: newDateTime }
          : req
      ));
      setShowRescheduleModal(false);
    } catch (error) {
      alert('Failed to update schedule. Please try again.');
      console.error('Error updating schedule:', error);
    }
  };

  // Helper function to get vet details
  const getVetDetails = (vetId) => {
    const vet = vets.find(v => v.id === vetId);
    return vet || null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Veterinary Services</h1>
          <p className="text-gray-600">Find and connect with qualified veterinary professionals</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Veterinarians</h2>
              <div className="space-y-4">
                {vets.map((vet) => {
                  const hasAcceptedRequest = vetRequests.some(
                    request => request.vet_id === vet.id && request.status === 'accepted'
                  );
                  
                  return (
                    <div key={vet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <FaUserMd className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{vet.name || vet.user?.name}</h3>
                            <p className="text-sm text-gray-600">{vet.specialization}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FaPhone className="text-gray-400" /> {vet.phone || vet.user?.phone}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FaEnvelope className="text-gray-400" /> {vet.email || vet.user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600">License #{vet.license_number}</p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleRequestVet(vet)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              Request Service
                            </button>
                            {hasAcceptedRequest && (
                              <button
                                onClick={() => handleChatWithVet(vet)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                              >
                                <FaComments className="inline mr-1" /> Chat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vet Requests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Requests</h2>
              <div className="space-y-4">
                {vetRequests.map((request) => {
                  const vetDetails = getVetDetails(request.vet_id);
                  return (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {vetDetails?.name || vetDetails?.user?.name || request.vet_name || 'Unknown Vet'}
                          </h3>
                          <p className="text-sm text-gray-600">{request.purpose}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Pig:</span> {request.pig?.name || request.pig_name || 'Unknown Pig'}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Scheduled:</span> {new Date(request.scheduled_time).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Urgency:</span> {request.urgency_level || 'Medium'}
                            </p>
                            {vetDetails && (
                              <>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Email:</span> {vetDetails.email || vetDetails.user?.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Phone:</span> {vetDetails.phone || vetDetails.user?.phone}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && (
                            <span className="flex items-center gap-1 text-yellow-600">
                              <FaClock /> Pending
                            </span>
                          )}
                          {request.status === 'accepted' && (
                            <span className="flex items-center gap-1 text-green-600">
                              <FaCheck /> Accepted
                            </span>
                          )}
                          {request.status === 'rejected' && (
                            <span className="flex items-center gap-1 text-red-600">
                              <FaTimes /> Rejected
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {request.status === 'accepted' && (
                          <button
                            onClick={() => handleChatWithVet({ id: request.vet_id })}
                            className="text-green-600 text-sm hover:text-green-800 font-medium"
                          >
                            <FaComments className="inline mr-1" /> Chat with Vet
                          </button>
                        )}
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleRescheduleRequest(request)}
                            className="text-blue-600 text-sm hover:text-blue-800 font-medium"
                          >
                            <FaCalendarAlt className="inline mr-1" /> Reschedule
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination Records */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaSyringe className="text-green-600" /> Vaccination Records
            </h2>
            <div className="space-y-4">
              {vaccinationRecords.length > 0 ? (
                vaccinationRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{record.vaccine_name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Pig:</span> {record.pig_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Date:</span> {new Date(record.vaccination_date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Next Due:</span> {new Date(record.next_due_date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Administered By:</span> {record.administered_by}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No vaccination records found</p>
              )}
            </div>
          </div>
        </div>

        {/* Vet Request Modal */}
        {showRequestModal && selectedVet && (
          <VetRequestModal
            vet={selectedVet}
            onClose={() => setShowRequestModal(false)}
            onSubmit={handleSubmitRequest}
          />
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reschedule Visit</h3>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => handleUpdateSchedule(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat System */}
        {showChat && selectedVet && selectedRequest && (
          <ChatSystem
            vet={selectedVet}
            requestId={selectedRequest.id}
            onClose={() => {
              setShowChat(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VeterinaryService; 