import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DocLayout from '../core/DocLayout';
import '../styles.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
  const users = useSelector((state) => state.users);
  const { userInfo, loading, error } = users || { userInfo: null, loading: false, error: null };

  // Chart data: Patients seen per week
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3'],
    datasets: [
      {
        label: 'Patients Seen',
        data: [10, 15, 12], // Placeholder data
        fill: false,
        borderColor: '#28a745',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Patients Seen Trend' },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 5,
      },
    },
  };

  return (
    <DocLayout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : !userInfo ? (
        <div className="alert alert-warning">Please sign in to view the dashboard.</div>
      ) : (
        <>
          <h1 className="mt-4">Welcome {userInfo.name || 'Guest'}</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>

          {/* Summary Cards */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-primary text-white mb-4">
                <div className="card-body">
                  <h5>My Patients</h5>
                  <h3>25</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/patients">
                    View Patients
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-success text-white mb-4">
                <div className="card-body">
                  <h5>Upcoming Appointments</h5>
                  <h3>4</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/appointments">
                    View Details
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white mb-4">
                <div className="card-body">
                  <h5>Pending Lab Results</h5>
                  <h3>3</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/lab-results">
                    View Results
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-danger text-white mb-4">
                <div className="card-body">
                  <h5>New Messages</h5>
                  <h3>5</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/messages">
                    Check Inbox
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Chart and Recent Activity */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-chart-line mr-1" />
                  Patients Seen Trend
                </div>
                <div className="card-body">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-clock mr-1" />
                  Recent Activity
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>New Patient Assigned</strong>
                      <p className="mb-0 small text-muted">John Doe - January 8, 2024</p>
                    </li>
                    <li className="list-group-item">
                      <strong>Lab Result Uploaded</strong>
                      <p className="mb-0 small text-muted">Blood Test - January 10, 2024</p>
                    </li>
                    <li className="list-group-item">
                      <strong>Completed Appointment</strong>
                      <p className="mb-0 small text-muted">Jane Smith - January 12, 2024</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DocLayout>
  );
};

export default DoctorDashboard;
