import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import axios from 'axios';
import { FaSearch, FaFilter, FaPiggyBank, FaUser, FaCalendarAlt, FaChartBar, FaDownload, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa';

const VetReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    report_type: '',
    date_range: {
      start: '',
      end: ''
    },
    description: '',
    findings: '',
    recommendations: '',
    attachments: []
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/vet/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setReports(response.data.reports);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reports');
      setLoading(false);
      console.error('Error fetching reports:', err);
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      Object.keys(newReport).forEach(key => {
        if (key === 'attachments') {
          newReport[key].forEach(file => {
            formData.append('attachments[]', file);
          });
        } else if (key === 'date_range') {
          formData.append('start_date', newReport[key].start);
          formData.append('end_date', newReport[key].end);
        } else {
          formData.append(key, newReport[key]);
        }
      });

      await axios.post('http://127.0.0.1:8000/api/vet/reports', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowAddModal(false);
      setNewReport({
        title: '',
        report_type: '',
        date_range: {
          start: '',
          end: ''
        },
        description: '',
        findings: '',
        recommendations: '',
        attachments: []
      });
      fetchReports();
    } catch (err) {
      console.error('Error adding report:', err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setNewReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.report_type === filterType;
    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Veterinary Reports</h1>
            <p className="text-gray-600">Manage and track veterinary reports and analytics</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add Report
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="monthly">Monthly Summary</option>
                <option value="health">Health Analysis</option>
                <option value="treatment">Treatment Review</option>
                <option value="incident">Incident Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaChartBar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.report_type}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  report.report_type === 'monthly' ? 'bg-green-100 text-green-800' :
                  report.report_type === 'health' ? 'bg-blue-100 text-blue-800' :
                  report.report_type === 'treatment' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {report.report_type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  Period: {new Date(report.start_date).toLocaleDateString()} - {new Date(report.end_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {report.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Findings:</span> {report.findings}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Recommendations:</span> {report.recommendations}
                </p>
                {report.attachments?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600 mb-1">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FaFileAlt />
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <FaDownload /> Download
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                  <FaFileAlt /> View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No reports found matching your criteria</p>
          </div>
        )}

        {/* Add Report Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Report</h2>
              <form onSubmit={handleAddReport}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Title
                    </label>
                    <input
                      type="text"
                      value={newReport.title}
                      onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <select
                      value={newReport.report_type}
                      onChange={(e) => setNewReport({...newReport, report_type: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select report type</option>
                      <option value="monthly">Monthly Summary</option>
                      <option value="health">Health Analysis</option>
                      <option value="treatment">Treatment Review</option>
                      <option value="incident">Incident Report</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newReport.date_range.start}
                        onChange={(e) => setNewReport({
                          ...newReport,
                          date_range: {...newReport.date_range, start: e.target.value}
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newReport.date_range.end}
                        onChange={(e) => setNewReport({
                          ...newReport,
                          date_range: {...newReport.date_range, end: e.target.value}
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Findings
                    </label>
                    <textarea
                      value={newReport.findings}
                      onChange={(e) => setNewReport({...newReport, findings: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recommendations
                    </label>
                    <textarea
                      value={newReport.recommendations}
                      onChange={(e) => setNewReport({...newReport, recommendations: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {newReport.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newReport.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg p-2"
                          >
                            <span className="text-sm truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </VetLayout>
  );
};

export default VetReports; 