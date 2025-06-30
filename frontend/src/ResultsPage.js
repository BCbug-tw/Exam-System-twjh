import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state.data) {
      navigate('/home');
    }
    window.scrollTo(0, 0);
  }, [state, navigate]);

  if (!state || !state.data) return null;

  const record = state.data;
  const correctCount = record.score;
  const totalCount = record.total;
  const correctRate = ((correctCount / totalCount) * 100).toFixed(1);

  const handleRetry = () => {
    navigate(`/test/${record.test_paper_id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">作答結果分析</h1>

      <div className="card mb-4 shadow-sm text-center">
        <div className="card-body">
          <h4 className="card-title">✅ 答對 {correctCount} / {totalCount} 題</h4>
          <p className="card-text">正確率 {correctRate}%</p>
        </div>
      </div>

      {record.details.map((detail, idx) => (
        <div key={idx} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">第 {detail.question} 題</h5>
            <ul className="list-group list-group-flush mt-3">
              {detail.allOptions.map((opt, optIdx) => {
                let itemClass = "list-group-item d-flex";
                let style = { cursor: 'default' };

                if (opt.id === detail.correctOptionId) {
                  itemClass += " bg-success text-white";
                }
                if (opt.id === detail.selectedOptionId && opt.id !== detail.correctOptionId) {
                  itemClass += " bg-danger text-white";
                }

                return (
                  <li
                    key={opt.id}
                    className={itemClass}
                    style={style}
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
        <button
          onClick={() => navigate('/home')}
          className="btn btn-primary btn-lg me-3 px-4"
        >
          回首頁
        </button>
        <button
          onClick={handleRetry}
          className="btn btn-success btn-lg px-4"
        >
          再次挑戰
        </button>
      </div>
    </div>
  );
}
