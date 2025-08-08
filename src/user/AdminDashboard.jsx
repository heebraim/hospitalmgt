import React, { useEffect, useRef } from "react";
import Layout from "../core/Layout";
import { useSelector, useDispatch } from "react-redux";
import { listUsers } from "../store/slices/userSlice";
import { listPrescriptions } from "../store/slices/prescriptionSlice";
import { listExpenses } from "../store/slices/expensesSlice";
import { listTestsResults } from "../store/slices/testSlice";
import { listVacApp } from "../store/slices/vaccineAppointmentSlice";
import { Link } from "react-router-dom";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Register Chart.js components

// Add CSS to control chart size and table overflow
const styles = `
  .chart-container {
    position: relative;
    height: 300px; /* Fixed height for charts */
    width: 100%;
    max-width: 500px; /* Prevent charts from growing too wide */
    margin: 0 auto; /* Center charts */
  }
  .card-body {
    padding: 1.5rem;
  }
  .table-responsive {
    max-height: 400px; /* Limit table height */
    overflow-y: auto; /* Scrollable table */
  }
  @media (max-width: 768px) {
    .chart-container {
      height: 250px; /* Smaller height on mobile */
      max-width: 100%;
    }
  }
`;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users);
  const { usersList: users, loading, error } = userList;
  const expenses = useSelector((state) => state.expense.expenses);
  const appointments = useSelector((state) => state.vaccineAppointments.appointments);
  const prescList = useSelector((state) => state.prescription);
  const { prescriptions } = prescList;
  const listTestResult = useSelector((state) => state.test);
  const { tests } = listTestResult;

  // Log state for debugging
  console.log("Users state:", users);
  console.log("Expenses state:", expenses);
  console.log("Appointments state:", appointments);
  console.log("Prescriptions state:", prescriptions);
  console.log("Tests state:", tests);

  // Refs for chart canvases
  const userChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const appointmentChartRef = useRef(null);
  const vaccineChartRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(listUsers());
    dispatch(listPrescriptions());
    dispatch(listTestsResults());
    dispatch(listExpenses());
    dispatch(listVacApp());
  }, [dispatch]);

  // Cleanup chart instances
  const destroyChart = (chartRef) => {
    if (chartRef.current?.chartInstance) {
      chartRef.current.chartInstance.destroy();
      chartRef.current.chartInstance = null;
    }
  };

  // Chart cleanup on unmount
  useEffect(() => {
    return () => {
      destroyChart(userChartRef);
      destroyChart(expenseChartRef);
      destroyChart(appointmentChartRef);
      destroyChart(vaccineChartRef);
    };
  }, []);

  // User types chart data
  const getUserChartData = () => {
    const admin = users?.filter((user) => user.role === 0).length || 0;
    const doc = users?.filter((user) => user.role === 1).length || 0;
    const patient = users?.filter((user) => user.role === 2).length || 0;
    const staff = users?.filter((user) => user.role === 3).length || 0;
    const nurse = users?.filter((user) => user.role === 4).length || 0;
    const usersList = [admin, doc, patient, staff, nurse];
    const labels = ["Admin", "Doctors", "Patients", "Staff", "Nurses"];
    const customLabels = labels.map((label, index) => `${label}: ${usersList[index]}`);
    console.log("User chart data:", { labels, customLabels, usersList });
    return { labels, customLabels, usersList };
  };

  // Expense chart data
  const getExpensesData = () => {
    const amountList = expenses?.map((expense) => parseInt(expense.amount) || 0) || [];
    const expenseNames = expenses?.map((expense) => expense.name) || [];
    const customLabels = expenseNames.map((label, index) => `${label}: ${amountList[index]}`);
    console.log("Expenses chart data:", { amountList, expenseNames, customLabels });
    return { amountList, expenseNames, customLabels };
  };

  // Appointment chart data
  const getAppointmentData = () => {
    let vaccinated = 0, notVaccinated = 0;
    appointments
      ?.filter((filtered) => filtered.vaccine?.name === "CoronaVirus")
      .forEach((data) => {
        if (data.taken === "Yes") vaccinated++;
        else notVaccinated++;
      });
    const appointmentList = [vaccinated, notVaccinated];
    const labels = ["Vaccinated", "Not Vaccinated"];
    const customLabels = labels.map((label, index) => `${label}: ${appointmentList[index]}`);
    console.log("Appointment chart data:", { labels, customLabels, appointmentList });
    return { labels, customLabels, appointmentList };
  };

  // Vaccine chart data
  const getVaccineData = () => {
    let malaria = 0, coronaVirus = 0;
    appointments?.forEach((data) => {
      if (data.vaccine?.name === "CoronaVirus") coronaVirus++;
      else if (data.vaccine?.name === "Malaria") malaria++;
    });
    const vaccineCount = [coronaVirus, malaria];
    const labels = ["Covid", "Malaria"];
    const customLabels = labels.map((label, index) => `${label}: ${vaccineCount[index]}`);
    console.log("Vaccine chart data:", { vaccineCount, customLabels });
    return { vaccineCount, customLabels };
  };

  // Calculate counts and totals
  const countAdmins = () => users?.filter((user) => user.role === 0).length || 0;
  const countDoctors = () => users?.filter((user) => user.role === 1).length || 0;
  const countPatients = () => users?.filter((user) => user.role === 2).length || 0;

  const totalExpenses = () =>
    expenses?.reduce((acc, curr) => acc + (parseInt(curr.amount) || 0), 0) || 0;

  const totalCollected = () =>
    prescriptions?.reduce((acc, curr) => {
      if (curr.paid === "Paid") acc += parseInt(curr.treatment?.cost) || 0;
      return acc;
    }, 0) || 0;

  const totalCollected1 = () =>
    tests?.reduce((acc, curr) => {
      if (curr.paid === "Paid") acc += parseInt(curr.testName?.cost) || 0;
      return acc;
    }, 0) || 0;

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  const showError = () =>
    error && (
      <div className="alert alert-danger">
        {error}
      </div>
    );

  // Chart options for consistent sizing
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1, // Square charts
    plugins: {
      legend: {
        position: 'bottom', // Move legend to bottom to save space
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  return (
    <Layout title="Dashboard">
      {/* Inject CSS */}
      <style>{styles}</style>
      {loading ? (
        showLoading()
      ) : error ? (
        showError()
      ) : (
        <div className="row">
          {/* Cards */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">Admin Users</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to={`/list/users`}>
                  {countAdmins()}
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body">Doctors</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to={`/list/users`}>
                  {countDoctors()}
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">Payments</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href="#">
                  Ksh {totalCollected() + totalCollected1()}
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card bg-danger text-white">
              <div className="card-body">Expenses</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href="#">
                  Ksh {totalExpenses()}
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-pie mr-1" />
                User Types
              </div>
              <div className="card-body">
                <div className="chart-container">
                  {users?.length > 0 ? (
                    <Pie
                      ref={userChartRef}
                      data={{
                        labels: getUserChartData().customLabels,
                        datasets: [
                          {
                            backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745", "#11ede9"],
                            data: getUserChartData().usersList,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p>No user data available</p>
                  )}
                </div>
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-pie mr-1" />
                Expenses Types
              </div>
              <div className="card-body">
                <div className="chart-container">
                  {expenses?.length > 0 ? (
                    <Doughnut
                      ref={expenseChartRef}
                      data={{
                        labels: getExpensesData().customLabels,
                        datasets: [
                          {
                            backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],
                            data: getExpensesData().amountList,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p>No expenses data available</p>
                  )}
                </div>
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-pie mr-1" />
                CoronaVirus
              </div>
              <div className="card-body">
                <div className="chart-container">
                  {appointments?.length > 0 ? (
                    <Doughnut
                      ref={appointmentChartRef}
                      data={{
                        labels: getAppointmentData().customLabels,
                        datasets: [
                          {
                            backgroundColor: ["#28a745", "#dc3545"],
                            data: getAppointmentData().appointmentList,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p>No appointment data available</p>
                  )}
                </div>
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-pie mr-1" />
                Types of Vaccines Taken
              </div>
              <div className="card-body">
                <div className="chart-container">
                  {appointments?.length > 0 ? (
                    <Pie
                      ref={vaccineChartRef}
                      data={{
                        labels: getVaccineData().customLabels,
                        datasets: [
                          {
                            backgroundColor: ["#007bff", "#dc3545"],
                            data: getVaccineData().vaccineCount,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p>No vaccine data available</p>
                  )}
                </div>
              </div>
              <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
            </div>
          </div>

          {/* User Table */}
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">Users</div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.length > 0 ? (
                        users.map((user, i) => (
                          <tr key={i}>
                            <th scope="row">{user._id}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.role === 0 ? (
                                <button type="button" className="btn btn-primary btn-sm">
                                  Admin
                                </button>
                              ) : user.role === 1 ? (
                                <button type="button" className="btn btn-secondary btn-sm">
                                  Doctor
                                </button>
                              ) : user.role === 2 ? (
                                <button type="button" className="btn btn-info btn-sm">
                                  Patient
                                </button>
                              ) : user.role === 4 ? (
                                <button type="button" className="btn btn-dark btn-sm">
                                  Nurse
                                </button>
                              ) : (
                                <button type="button" className="btn btn-warning btn-sm">
                                  Staff
                                </button>
                              )}
                            </td>
                            <td>
                              <Link to={`/update/users/${user._id}`}>
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                            </td>
                            <td>
                              <i className="bi bi-trash" />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No users available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;