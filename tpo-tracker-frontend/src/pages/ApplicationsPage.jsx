import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ApplicationTable from '@/components/ApplicationTable';
import { applicationsAPI } from '@/services/api';
import socketService from '@/services/socket';

export function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    companyName: '',
    role: '',
    salary: '',
    location: '',
  });

  useEffect(() => {
    loadApplications();

    // Connect socket and listen for updates
    socketService.connect();
    socketService.on('applicationUpdated', loadApplications);
    const pollingTimer = setInterval(loadApplications, 15000);

    return () => {
      socketService.off('applicationUpdated', loadApplications);
      clearInterval(pollingTimer);
    };
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await applicationsAPI.getAllApplications();
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationsAPI.deleteApplication(id);
        loadApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await applicationsAPI.updateApplication(editingApp._id, formData);
      } else {
        await applicationsAPI.createApplication(formData);
      }
      loadApplications();
      setShowForm(false);
      setFormData({
        studentId: '',
        companyName: '',
        role: '',
        salary: '',
        location: '',
      });
      setEditingApp(null);
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-2">
              {applications.length} applications tracked
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingApp(null);
              setFormData({
                studentId: '',
                companyName: '',
                role: '',
                salary: '',
                location: '',
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Plus size={20} />
            <span>New Application</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleFormChange}
                    required
                    placeholder="Student ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    required
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (Optional)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleFormChange}
                    placeholder="e.g., 500000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g., Bangalore"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingApp ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applications Table */}
        <ApplicationTable
          applications={applications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default ApplicationsPage;
