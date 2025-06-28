import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import { 
  getVaccinations, 
  createVaccination, 
  updateVaccination, 
  deleteVaccination,
  getVetPigsUnderCare,
  getAllVaccinations 
} from '../../services/vetService';
import { FaSearch, FaFilter, FaPiggyBank, FaUser, FaCalendarAlt, FaSyringe, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaFile, FaTimes } from 'react-icons/fa';

const VetVaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [selectedPigId, setSelectedPigId] = useState(null);
  const [formData, setFormData] = useState({
    pig_id: '',
    vaccine_name: '',
    date_given: '',
    next_due_date: '',
    administered_by: '',
    notes: '',
    batch_number: '',
    manufacturer: '',
    document: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all vaccinations with pagination
      const vaccinationsResponse = await getAllVaccinations(currentPage, perPage);
      console.log('Vaccinations data:', vaccinationsResponse);
      
      // Check if the response is an array
      if (Array.isArray(vaccinationsResponse)) {
        setVaccinations(vaccinationsResponse);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: vaccinationsResponse.length,
          total: vaccinationsResponse.length
        });
      } else if (vaccinationsResponse.vaccinations) {
        setVaccinations(vaccinationsResponse.vaccinations);
        setPagination(vaccinationsResponse.pagination);
      } else {
        setVaccinations([]);
        setError('No vaccinations found');
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
      setVaccinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Add filtering logic
  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = 
      vaccination.vaccine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.pig?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = (() => {
      const nextDueDate = new Date(vaccination.next_due_date);
      const today = new Date();
      
      switch (filterStatus) {
        case 'upcoming':
          return nextDueDate > today;
        case 'overdue':
          return nextDueDate < today;
        case 'completed':
          return nextDueDate <= today;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus;
  });

  const handlePigChange = async (pigId) => {
    if (!pigId) {
      setVaccinations([]);
      setSelectedPigId(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedPigId(pigId);
      const vaccinationsData = await getVaccinations(pigId);
      setVaccinations(Array.isArray(vaccinationsData) ? vaccinationsData : []);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError('Failed to fetch vaccinations. Please try again.');
      setVaccinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.pig_id) {
        setError('Please select a pig');
        return;
      }

      if (selectedVaccination) {
        await updateVaccination(selectedVaccination.id, formData);
      } else {
        await createVaccination(formData);
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedVaccination(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving vaccination:', err);
      setError(err.message || 'Failed to save vaccination. Please try again.');
    }
  };

  const handleEdit = (vaccination) => {
    if (!vaccination || !vaccination.id) {
      setError('Invalid vaccination record');
      return;
    }

    setSelectedVaccination(vaccination);
    setFormData({
      pig_id: vaccination.pig_id || '',
      vaccine_name: vaccination.vaccine_name || '',
      date_given: vaccination.date_given ? vaccination.date_given.split('T')[0] : '',
      next_due_date: vaccination.next_due_date ? vaccination.next_due_date.split('T')[0] : '',
      administered_by: vaccination.administered_by || '',
      notes: vaccination.notes || '',
      batch_number: vaccination.batch_number || '',
      manufacturer: vaccination.manufacturer || '',
      document: vaccination.document ? new File([vaccination.document], vaccination.vaccine_name) : null
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid vaccination ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this vaccination record?')) return;
    
    try {
      await deleteVaccination(id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting vaccination:', err);
      setError('Failed to delete vaccination. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      pig_id: '',
      vaccine_name: '',
      date_given: '',
      next_due_date: '',
      administered_by: '',
      notes: '',
      batch_number: '',
      manufacturer: '',
      document: null
    });
  };

  // Update the handleDocumentPreview function
  const handleDocumentPreview = (documentPath) => {
    if (documentPath) {
      // Create a full URL to the document
      const documentUrl = `${process.env.REACT_APP_API_URL}/storage/${documentPath}`;
      setSelectedDocument({ url: documentUrl });
      setShowDocumentPreview(true);
    }
  };

  if (loading) {
    return (
      <VetLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </VetLayout>
    );
  }

  if (error) {
    return (
      <VetLayout>
        <div className="flex justify-center items-center h-screen text-red-600">
          {error}
        </div>
      </VetLayout>
    );
  }

  return (
    <VetLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Vaccination Records</h1>
            <p className="text-gray-600">Manage and track pig vaccination records</p>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedPigId || ''}
              onChange={(e) => handlePigChange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a pig</option>
              {pigs.map(pig => (
                <option key={pig.id} value={pig.id}>
                  {pig.name} - {pig.breed?.name || 'Unknown Breed'}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!selectedPigId) {
                  setError('Please select a pig first');
                  return;
                }
                resetForm();
                setFormData(prev => ({ ...prev, pig_id: selectedPigId }));
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add Vaccination
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search vaccinations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Records</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vaccination Records Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pig</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vaccinations && vaccinations.length > 0 ? (
                    vaccinations.map((vaccination) => (
                      <tr key={vaccination.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaPiggyBank className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">Pig ID: {vaccination.pig_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vaccination.vaccine_name}</div>
                          <div className="text-sm text-gray-500">Batch: {vaccination.batch_number}</div>
                          <div className="text-sm text-gray-500">By: {vaccination.administered_by}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vaccination.date_given).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vaccination.next_due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            new Date(vaccination.next_due_date) > new Date() ? 'bg-green-100 text-green-800' :
                            new Date(vaccination.next_due_date) < new Date() ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {new Date(vaccination.next_due_date) > new Date() ? 'Active' :
                             new Date(vaccination.next_due_date) < new Date() ? 'Overdue' :
                             'Due Soon'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {vaccination.document_path ? (
                            <button
                              onClick={() => handleDocumentPreview(vaccination.document_path)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
                            >
                              <FaFile className="text-lg" />
                              View Document
                            </button>
                          ) : (
                            <span className="text-gray-500">No document</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(vaccination)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(vaccination.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No vaccination records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination controls */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, pagination.total)} of {pagination.total} records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                  disabled={currentPage === pagination.last_page}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {filteredVaccinations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No vaccination records found matching your criteria</p>
              </div>
            )}

            {/* Document Preview Modal */}
            {showDocumentPreview && selectedDocument && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => {
                        setShowDocumentPreview(false);
                        setSelectedDocument(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                  <div className="max-h-[calc(90vh-8rem)] overflow-auto">
                    {selectedDocument.url?.includes('.pdf') ? (
                      <iframe
                        src={selectedDocument.url}
                        className="w-full h-[70vh]"
                        title="Document Preview"
                      />
                    ) : (
                      <img
                        src={selectedDocument.url}
                        alt="Document Preview"
                        className="max-w-full h-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Add/Edit Vaccination Modal */}
            {(showAddModal || showEditModal) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-8">
                <div className="bg-white rounded-lg p-6 w-full max-w-md my-4">
                  <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">
                      {selectedVaccination ? 'Edit Vaccination Record' : 'Add Vaccination Record'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pig
                          </label>
                          <select
                            value={formData.pig_id}
                            onChange={(e) => setFormData({...formData, pig_id: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select a pig</option>
                            {pigs.map(pig => (
                              <option key={pig.id} value={pig.id}>
                                {pig.name} - {pig.breed?.name || 'Unknown Breed'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vaccine Name
                          </label>
                          <input
                            type="text"
                            value={formData.vaccine_name}
                            onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Given
                          </label>
                          <input
                            type="date"
                            value={formData.date_given}
                            onChange={(e) => setFormData({...formData, date_given: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Next Due Date
                          </label>
                          <input
                            type="date"
                            value={formData.next_due_date}
                            onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Administered By
                          </label>
                          <input
                            type="text"
                            value={formData.administered_by}
                            onChange={(e) => setFormData({...formData, administered_by: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Number
                          </label>
                          <input
                            type="text"
                            value={formData.batch_number}
                            onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Manufacturer
                          </label>
                          <input
                            type="text"
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document (PDF/Image)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setFormData({...formData, document: e.target.files[0]})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          {selectedVaccination ? 'Update Record' : 'Add Record'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddModal(false);
                            setShowEditModal(false);
                            setSelectedVaccination(null);
                            resetForm();
                          }}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </VetLayout>
  );
};

export default VetVaccinations; 