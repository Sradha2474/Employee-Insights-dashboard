import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEmployeeRows } from './employeeApi';
import type { TableRow } from './employeeApi';

const ROW_HEIGHT = 40;
const BUFFER = 5;

function getScrollInfo(container: HTMLDivElement | null) {
  if (!container) return { scrollTop: 0, containerHeight: 600 };
  return {
    scrollTop: container.scrollTop,
    containerHeight: container.clientHeight,
  };
}

export default function ListPage() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emptyReason, setEmptyReason] = useState<string | null>(null);
  const [scrollInfo, setScrollInfo] = useState({ scrollTop: 0, containerHeight: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEmployeeRows()
      .then(({ rows, raw }) => {
        if (cancelled) return;
        setData(rows);
        if (!rows.length && raw) setEmptyReason(raw.length > 200 ? raw.slice(0, 200) + '…' : raw);
        else setEmptyReason(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load');
          setEmptyReason(null);
          setData([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Measure container when data is available
  useEffect(() => {
    const el = containerRef.current;
    if (!el || data.length === 0) return;
    setScrollInfo((prev) => ({ ...prev, containerHeight: el.clientHeight }));
  }, [data.length]);

  const handleScroll = useCallback(() => {
    setScrollInfo(getScrollInfo(containerRef.current));
  }, []);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);
  const displayColumns = useMemo(() => [...columns, 'Actions'], [columns]);

  const totalHeight = data.length * ROW_HEIGHT;
  const { scrollTop, containerHeight } = scrollInfo;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) - 1 + BUFFER
  );
  const visibleRows = data.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * ROW_HEIGHT;

  return (
    <div className="list-page">
      <header className="list-header">
        <h1>Employee Table</h1>
        <p className="list-user">Logged in as: <strong>{auth.username}</strong></p>
        <button type="button" onClick={() => logout()} className="list-logout">
          Logout
        </button>
      </header>

      {loading && <p className="list-status">Loading…</p>}
      {error && <p className="list-error" role="alert">{error}</p>}

      {!loading && !error && data.length > 0 && (
        <>
          <div className="list-header-row">
            {displayColumns.map((col) => (
              <div key={col} className="list-cell list-cell-header">
                {col}
              </div>
            ))}
          </div>
          <div
            ref={containerRef}
            className="list-scroll"
            onScroll={handleScroll}
            role="grid"
            aria-rowcount={data.length}
            aria-colcount={columns.length}
          >
            <div className="list-total-height" style={{ height: totalHeight }}>
              <div className="list-visible" style={{ transform: `translateY(${offsetY}px)` }}>
                {visibleRows.map((row, i) => {
                  const index = startIndex + i;
                  return (
                    <div
                      key={index}
                      className="list-row"
                      style={{ height: ROW_HEIGHT }}
                      role="row"
                      aria-rowindex={index + 1}
                    >
                      {columns.map((col) => (
                        <div key={col} className="list-cell" role="gridcell">
                          {String(row[col] ?? '')}
                        </div>
                      ))}
                      <div className="list-cell" role="gridcell">
                        <button
                          type="button"
                          className="list-details"
                          onClick={() => navigate(`/details/${index}`, { state: { row } })}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="list-empty">
          <p className="list-status">No data returned from API.</p>
          {emptyReason && (
            <pre className="list-raw-response" aria-label="API response">{emptyReason}</pre>
          )}
        </div>
      )}

      <style>{`
        .list-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        .list-header {
          flex-shrink: 0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .list-header h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        .list-user { margin: 0; font-size: 0.9rem; color: #374151; }
        .list-logout {
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-size: 0.9rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #fff;
        }
        .list-logout:hover { background: #f3f4f6; }
        .list-details {
          border: 1px solid #d1d5db;
          background: #fff;
          border-radius: 5px;
          padding: 0.2rem 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .list-details:hover { background: #f3f4f6; }
        .list-status, .list-error { margin: 0.5rem 0; }
        .list-error { color: #b91c1c; }
        .list-empty { margin-top: 0.5rem; }
        .list-raw-response {
          margin: 0.5rem 0;
          padding: 0.75rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.75rem;
          overflow: auto;
          max-height: 120px;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .list-scroll {
          flex: 1;
          min-height: 200px;
          overflow: auto;
          border: 1px solid #e5e7eb;
          border-radius: 0 0 8px 8px;
          background: #fff;
        }
        .list-total-height { position: relative; width: 100%; }
        .list-visible { position: absolute; left: 0; right: 0; top: 0; }
        .list-header-row {
          display: flex;
          padding: 0 0.75rem;
          height: 36px;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          font-weight: 600;
          font-size: 0.8rem;
          color: #374151;
        }
        .list-row {
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          box-sizing: border-box;
        }
        .list-row:nth-child(even) { background: #fafafa; }
        .list-cell {
          flex: 1;
          min-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.875rem;
        }
        .list-cell-header {
          flex: 1;
          min-width: 80px;
        }
      `}</style>
    </div>
  );
}

// employeeApi defines small helper functions for talking to the backend.
// Keeping API calls here makes it easier to change endpoints or add error handling later.