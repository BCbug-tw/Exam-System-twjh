import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      api.get('subjects/')
        .then(res => {
          console.log("取得 subjects:", res.data);
          setSubjects(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [navigate]);

  if (!Array.isArray(subjects)) {
    return <div className="container mt-5">載入中...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">各科目歷屆試題</h1>

      <div className="row">
        {subjects.map(subject => (
          <div key={subject.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header">
                <h4 className="my-0">{subject.name}</h4>
              </div>
              <ul className="list-group list-group-flush">
                {subject.papers.map(paper => (
                  <Link 
                    key={paper.id} 
                    to={`/test/${paper.id}`} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    style={{ textDecoration: 'none' }}
                  >
                    {paper.title}
                    <span className="badge bg-primary rounded-pill">進入測驗</span>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
