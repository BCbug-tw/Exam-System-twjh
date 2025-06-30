import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      api.get('history/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        console.log("取得歷史紀錄:", res.data);
        setRecords(res.data);
      })
      .catch(err => console.error(err));
    }
  }, [navigate, token]);

  if (!records.length) {
    return <div className="container mt-5 text-center">目前沒有任何作答紀錄</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">作答歷程紀錄</h2>

      {records.map(record => (
        <div key={record.id} className="card mb-3 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">
                試卷：{record.test_paper_title}
              </h5>
              <p className="mb-1">作答時間：{new Date(record.created_at).toLocaleString()}</p>
              <p className="mb-0">成績：{record.score} / {record.total}</p>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/results', { state: { data: record } })}
            >
              查看詳情
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
