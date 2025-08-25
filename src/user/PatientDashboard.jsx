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
import PatientLayout from '../core/PatientLayout';
import '../styles.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientDashboard = () => {
  const users = useSelector((state) => state.users);
  const { userInfo, loading, error } = users || { userInfo: null, loading: false, error: null };

  console.log('users state in PatientDashboard:', users);

  // Currency formatter for Nigerian Naira
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Chart data for Vital Signs Trend
  const chartData = {
    labels: ['Jan 1', 'Jan 8', 'Jan 15'],
    datasets: [
      {
        label: 'Blood Pressure (mmHg)',
        data: [120, 122, 118], // Placeholder data
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Vital Signs Trend' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 140,
      },
    },
  };

  return (
    <PatientLayout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : !userInfo ? (
        <div className="alert alert-warning">Please sign in to view the dashboard.</div>
      ) : (
        <>
          <h1 className="mt-4">Welcome back, {userInfo.name || 'Guest'}</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>

          {/* Summary Cards */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-primary text-white mb-4">
                <div className="card-body">
                  <h5>Upcoming Appointments</h5>
                  <h3>2</h3>
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
              <div className="card bg-success text-white mb-4">
                <div className="card-body">
                  <h5>Active Prescriptions</h5>
                  <h3>2</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/prescriptions">
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
                  <h5>Pending Tests</h5>
                  <h3>1</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/test-results">
                    View Details
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
                  <h5>Outstanding Balance</h5>
                  <h3>{formatCurrency(350)}</h3>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/billing">
                    Pay Now
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
                  Vital Signs Trend
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
                      <strong>Blood Test Completed</strong>
                      <p className="mb-0 small text-muted">Results: Normal - January 8, 2024</p>
                    </li>
                    <li className="list-group-item">
                      <strong>Appointment Scheduled</strong>
                      <p className="mb-0 small text-muted">Check-up with Dr. Smith - January 15, 2024</p>
                    </li>
                    <li className="list-group-item">
                      <strong>Prescription Reminder</strong>
                      <p className="mb-0 small text-muted">Amoxicillin - 7 days remaining</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PatientLayout>
  );
};

export default PatientDashboard;