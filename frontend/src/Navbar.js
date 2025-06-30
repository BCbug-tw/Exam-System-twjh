import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          國中會考歷屆試題系統
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {token && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">首頁</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">學習歷程</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">個人資料</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-danger ms-3">
                  登出
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
