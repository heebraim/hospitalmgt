import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Menu from './Menu';
import '../styles.css';

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: '#ff9900' }
    : { color: '#ffffff' };
};

const PatientLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users);
  const userInfo = users ? users.userInfo : null;

  console.log('users state in PatientLayout:', users);

  if (!userInfo) {
    navigate('/signin');
    return null;
  }

  const patLinks = () => (
    <Fragment>
      <div className="sb-sidenav-menu-heading">Core</div>
      <Link className="nav-link" style={isActive(location, '/')} to="/">
        <div className="sb-nav-link-icon">
          <i className="fas fa-tachometer-alt" />
        </div>
        Dashboard
      </Link>
      <Link
        className="nav-link"
        style={isActive(location, userInfo._id ? `/profile/${userInfo._id}` : '/profile')}
        to={userInfo._id ? `/profile/${userInfo._id}` : '/profile'}
      >
        <div className="sb-nav-link-icon">
          <i className="bi bi-person-badge-fill" />
        </div>
        Update Profile
      </Link>
      {userInfo.isAdmin && (
        <Link className="nav-link" style={isActive(location, '/list/users')} to="/list/users">
          <div className="sb-nav-link-icon">
            <i className="bi bi-people" />
          </div>
          List Users
        </Link>
      )}
    </Fragment>
  );

  const loggedIn = () => (
    <div className="small">Logged in as: {userInfo.name || 'Guest'}</div>
  );

  return (
    <nav className="sb-nav-fixed">
      <Menu />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">{patLinks()}</div>
            </div>
            <div className="sb-sidenav-footer">{loggedIn()}</div>
          </nav>
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </nav>
  );
};

export default PatientLayout;