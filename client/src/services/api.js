import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({ baseURL: API_BASE });

// JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('placivio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──
export const registerStudent = (data) => apiClient.post('/auth/student/register', data);
export const loginStudent = (data) => apiClient.post('/auth/student/login', data);
export const registerTpo = (data) => apiClient.post('/auth/tpo/register', data);
export const loginTpo = (data) => apiClient.post('/auth/tpo/login', data);
export const getMe = () => apiClient.get('/auth/me');

// ── Students ──
export const createStudent = (data) => apiClient.post('/students', data);
export const getStudent = (id) => apiClient.get(`/students/${id}`);

// ── Roadmap ──
export const generateRoadmap = (studentId) => apiClient.post('/roadmap/generate', { studentId });
export const getRoadmap = (studentId) => apiClient.get(`/roadmap/${studentId}`);

// ── Progress ──
export const submitProgress = (data) => apiClient.post('/progress', data);

// ── Dashboard ──
export const getDashboard = (studentId) => apiClient.get(`/dashboard/${studentId}`);

// ── Chat ──
export const sendChatMessage = (studentId, message) => apiClient.post(`/chat/${studentId}`, { message });

// ── Companies ──
export const getCompanyMatches = (studentId) => apiClient.get(`/companies/matches/${studentId}`);

// ── Drives ──
export const getDrivesForCollege = (college) => apiClient.get(`/drives/college/${encodeURIComponent(college)}`);
export const getDriveDetails = (driveId) => apiClient.get(`/drives/${driveId}`);
export const postDrive = (data) => apiClient.post('/drives', data);
export const updateDriveStatus = (driveId, status) => apiClient.patch(`/drives/${driveId}/status`, { status });
export const aiShortlist = (driveId) => apiClient.post(`/drives/${driveId}/ai-shortlist`);
export const updateApplicantStatus = (driveId, appId, status) => apiClient.patch(`/drives/${driveId}/applicants/${appId}`, { status });

// ── Applications ──
export const applyToDrive = (driveId) => apiClient.post('/applications', { driveId });
export const getStudentApplications = (studentId) => apiClient.get(`/applications/student/${studentId}`);
export const getDriveApplications = (driveId) => apiClient.get(`/applications/drive/${driveId}`);

// ── Notifications ──
export const getNotifications = (userId) => apiClient.get(`/notifications/${userId}`);
export const getUnreadCount = (userId) => apiClient.get(`/notifications/unread/${userId}`);
export const markNotificationRead = (id) => apiClient.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = (userId) => apiClient.patch(`/notifications/read-all/${userId}`);
export const markAllAlertsRead = (userId) => apiClient.patch(`/notifications/read-all/${userId}`);
export const sendNotifications = (data) => apiClient.post('/notifications/send', data);

// ── Achievements ──
export const getAchievements = (studentId) => apiClient.get(`/achievements/${studentId}`);

// ── TPO ──
export const getTpoDashboard = () => apiClient.get('/tpo/dashboard');
export const getTpoStudents = () => apiClient.get('/tpo/students');
export const getTpoStudentProfile = (studentId) => apiClient.get(`/tpo/students/${studentId}/profile`);
export const generateBatchReport = () => apiClient.post('/tpo/batch-report');
export const runDriveRecommendations = () => apiClient.post('/tpo/run-recommendations');
export const getTpoDrives = (tpoId) => apiClient.get(`/drives/tpo/${tpoId}`);

// ── Legacy compat ──
export const completeWeek = (studentId, weekNumber) => apiClient.post('/progress', { studentId, weekNumber, skillsLearned: [], hoursSpent: 0, selfRating: 3 });
