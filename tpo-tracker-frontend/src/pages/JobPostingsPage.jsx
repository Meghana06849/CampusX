import React, { useEffect, useState } from 'react';
import { Link2, Plus, ExternalLink, CheckCircle2, Clock3, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { authAPI, jobPostingsAPI } from '@/services/api';
import { getStoredUser, isAdmin } from '@/utils/auth';
import { formatDate } from '@/utils/formatters';
import socketService from '@/services/socket';

export function JobPostingsPage() {
  const user = getStoredUser();
  const [adminMode, setAdminMode] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationLink: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    const loadCurrentUserRole = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setAdminMode(response.data.student?.role === 'admin');
      } catch (error) {
        setAdminMode(isAdmin());
      } finally {
        setRoleLoading(false);
      }
    };

    loadCurrentUserRole();
    loadJobPostings();

    socketService.connect();
    socketService.on('jobPostingCreated', loadJobPostings);
    socketService.on('jobPostingUpdated', loadJobPostings);
    socketService.on('jobPostingDeleted', loadJobPostings);
    socketService.on('applicationUpdated', loadJobPostings);

    return () => {
      socketService.off('jobPostingCreated', loadJobPostings);
      socketService.off('jobPostingUpdated', loadJobPostings);
      socketService.off('jobPostingDeleted', loadJobPostings);
      socketService.off('applicationUpdated', loadJobPostings);
    };
  }, []);

  const loadJobPostings = async () => {
    try {
      setIsLoading(true);
      const response = await jobPostingsAPI.getAllJobPostings();
      setJobPostings(response.data.jobPostings || []);
    } catch (error) {
      console.error('Error loading job postings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobPostingsAPI.createJobPosting({
        ...formData,
        deadline: formData.deadline || null,
      });
      setFormData({
        companyName: '',
        role: '',
        applicationLink: '',
        description: '',
        deadline: '',
      });
      setShowForm(false);
      loadJobPostings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create job posting');
    }
  };

  const handleApply = async (jobPosting) => {
    try {
      await jobPostingsAPI.applyToJobPosting(jobPosting._id);
      if (jobPosting.applicationLink) {
        window.open(jobPosting.applicationLink, '_blank', 'noopener,noreferrer');
      }
      loadJobPostings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await jobPostingsAPI.deleteJobPosting(id);
      loadJobPostings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job posting');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {roleLoading ? (
          <div className="mb-8 rounded-xl bg-white p-4 shadow text-gray-600">
            Checking access level...
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-2">
              {adminMode ? 'Post application links for students' : 'View jobs and track whether you have applied'}
            </p>
          </div>

          {adminMode && (
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Post Job Link</span>
            </button>
          )}
        </div>

        {adminMode && showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Job Posting</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name"
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Job role"
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleChange}
                placeholder="Application link"
                className="px-4 py-2 border rounded-lg md:col-span-2"
                required
              />
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="px-4 py-2 border rounded-lg md:col-span-2 min-h-28"
              />
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading job postings...</div>
        ) : jobPostings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            No job postings yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobPostings.map((jobPosting) => (
              <div key={jobPosting._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{jobPosting.companyName}</h3>
                    <p className="text-gray-600">{jobPosting.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${jobPosting.appliedByMe ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {jobPosting.appliedByMe ? 'Applied' : 'Not Applied'}
                    </span>
                    {adminMode && (
                      <button onClick={() => handleDelete(jobPosting._id)} className="text-red-600">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {jobPosting.description && <p className="text-gray-700 mb-4">{jobPosting.description}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />
                    <span>Deadline: {jobPosting.deadline ? formatDate(jobPosting.deadline) : 'No deadline'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 size={16} />
                    <span>{jobPosting.applicationLink}</span>
                  </div>
                  {typeof jobPosting.appliedCount === 'number' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{jobPosting.appliedCount} applied</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.open(jobPosting.applicationLink, '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
                  >
                    <ExternalLink size={16} />
                    Open Link
                  </button>

                  {!adminMode && (
                    <button
                      type="button"
                      onClick={() => handleApply(jobPosting)}
                      disabled={jobPosting.appliedByMe}
                      className="inline-flex items-center gap-2 bg-blue-600 disabled:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      {jobPosting.appliedByMe ? 'Already Applied' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default JobPostingsPage;
