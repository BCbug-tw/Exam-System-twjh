import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';

export default function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testPaper, setTestPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(100 * 60);

  useEffect(() => {
    api.get(`papers/${id}/`)
      .then(res => setTestPaper(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 20 * 60) {
          alert("⚠️ 注意：剩下20分鐘！");
        }
        if (prev <= 0) {
          clearInterval(timer);
          alert("時間到，已自動提交！");
          forceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = () => {
    const completedCount = Object.keys(answers).length;
    const totalCount = testPaper.questions.length;

    if (completedCount < totalCount) {
      alert(`還有未作答的題目！目前已完成 ${completedCount} / ${totalCount}`);
      return;
    }

    const confirmSubmit = window.confirm("確定要提交答案嗎？提交後將無法修改。");
    if (!confirmSubmit) {
      return;
    }

    forceSubmit();
  };

  const forceSubmit = () => {
    const token = localStorage.getItem("token");

    api.post('submit/', {
      test_paper: testPaper.id,
      answers: answers
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("提交成功:", res.data);
      navigate('/results', { state: { data: res.data } });
    })
    .catch(err => console.error(err));
  };

  if (!testPaper) return <div className="container mt-5">Loading...</div>;

  const completedCount = Object.keys(answers).length;
  const totalCount = testPaper.questions.length;

  const formatTime = () => {
    const min = Math.floor(seconds / 60 % 60);
    const hr = Math.floor(seconds / 60 / 60);
    const sec = seconds % 60;
    return `${hr}:${min}:${('0' + sec).slice(-2)}`;
  };

  return (
    <div className="container mt-4 position-relative">
      <h1 className="mb-4 text-center">{testPaper.title}</h1>

      {/* 固定右上角計時器 */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '20px',
        backgroundColor: '#f8f9fa',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        textAlign: 'left',
        zIndex: 1000
      }}>
        剩餘時間: {formatTime()}<br/>
        已完成: {completedCount} / {totalCount}
      </div>

      {testPaper.questions.map((q, idx) => (
        <div key={q.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{idx + 1}. {q.text}</h5>
            {q.image && (
              <img
                src={`http://127.0.0.1:8000/media/${q.image}`}
                alt="題目圖"
                className="img-fluid mt-3"
                style={{ maxWidth: '300px' }}
              />
            )}
            <ul className="list-group list-group-flush mt-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === opt.id;
                return (
                  <li
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className="list-group-item d-flex"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#d1e7dd' : 'white'
                    }}
                  >
                    <strong className="me-2">
                      {['A', 'B', 'C', 'D'][optIdx]}.
                    </strong>
                    <span>{opt.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <button onClick={handleSubmit} className="btn btn-primary btn-lg px-5">
          提交作答
        </button>
      </div>
    </div>
  );
}
