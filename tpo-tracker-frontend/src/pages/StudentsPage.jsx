import React, { useState, useEffect } from 'react';
import { Search, UserPlus, CheckCircle2, XCircle, X, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { applicationsAPI, studentsAPI } from '@/services/api';
import socketService from '@/services/socket';
import { formatDate } from '@/utils/formatters';

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterApplied, setFilterApplied] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentApplications, setStudentApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();

    // Connect socket and listen for new students
    socketService.connect();
    socketService.on('studentAdded', loadStudents);

    return () => {
      socketService.off('studentAdded', loadStudents);
    };
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentsAPI.getAllStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = students;

    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBranch) {
      result = result.filter((s) => s.branch === filterBranch);
    }

    if (filterYear) {
      result = result.filter((s) => s.year === parseInt(filterYear));
    }

    if (filterApplied !== 'all') {
      result = result.filter((student) => {
        const applied = !!student.hasApplied;
        return filterApplied === 'applied' ? applied : !applied;
      });
    }

    setFiltered(result);
  }, [students, searchTerm, filterBranch, filterYear, filterApplied]);

  const openStudentDetails = async (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setModalLoading(true);

    try {
      const response = await applicationsAPI.getAllApplications({ studentId: student._id });
      setStudentApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error loading student applications:', error);
      setStudentApplications([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentApplications([]);
  };

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'BT'];
  const years = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">
            {students.length} students registered
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>

            <select
              value={filterApplied}
              onChange={(e) => setFilterApplied(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="not-applied">Not Applied</option>
            </select>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition">
              <UserPlus size={20} />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No students found</p>
              </div>
            ) : (
              filtered.map((student) => (
                <div
                  key={student._id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 ${student.latestApplicationStatus !== 'Not Applied' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {student.latestApplicationStatus !== 'Not Applied' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {student.latestApplicationStatus !== 'Not Applied' ? student.latestApplicationStatus : 'Not Applied'}
                      </span>
                      {student.isPlaced && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Placed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Branch:</span> {student.branch}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Year:</span> {student.year}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">CGPA:</span> {student.cgpa}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Applications:</span> {student.applicationsCount || 0}
                    </p>
                  </div>

                  {student.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => openStudentDetails(student)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Latest Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedStudent.latestApplicationStatus || 'Not Applied'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Applications</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedStudent.applicationsCount || 0}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Applied Jobs</h3>
                {modalLoading ? (
                  <div className="text-gray-600">Loading applications...</div>
                ) : studentApplications.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-600">
                    No applications found for this student.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentApplications.map((application) => (
                      <div key={application._id} className="border rounded-xl p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{application.companyName}</h4>
                            <p className="text-sm text-gray-600">{application.role}</p>
                          </div>
                          <span className="inline-flex self-start bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {application.status}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-4">
                          <span>Applied: {formatDate(application.appliedDate)}</span>
                          <span>Status: {application.status}</span>
                        </div>
                        {application.jobPostingId && (
                          <button
                            onClick={() => window.open(`/jobs`, '_blank')}
                            className="mt-3 inline-flex items-center gap-2 text-blue-600 text-sm font-medium"
                          >
                            <ExternalLink size={16} />
                            Open Jobs
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentsPage;
