import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchEmployeeRows, parseSalary } from './employeeApi';

const AUDIT_STORAGE_KEY = 'employee_dashboard_audit_image';

type CityData = { city: string; totalSalary: number; count: number };

const CITY_COORDS: Record<string, { x: number; y: number }> = {
  Edinburgh: { x: 240, y: 110 },
  Tokyo: { x: 610, y: 160 },
  'San Francisco': { x: 110, y: 170 },
  'New York': { x: 190, y: 160 },
  London: { x: 230, y: 120 },
  Singapore: { x: 540, y: 240 },
  Sydney: { x: 640, y: 290 },
};

function getFallbackCoord(city: string) {
  const hash = city.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return {
    x: 80 + (hash % 600),
    y: 80 + ((hash * 7) % 220),
  };
}

export default function AnalyticsPage() {
  const { id = '0' } = useParams();
  const location = useLocation();
  const [auditImage, setAuditImage] = useState<string | null>(null);
  const [cityStats, setCityStats] = useState<CityData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mergedFromRoute = (location.state as { mergedImage?: string } | null)?.mergedImage;
    const mergedFromStorage = localStorage.getItem(AUDIT_STORAGE_KEY);
    setAuditImage(mergedFromRoute ?? mergedFromStorage);
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;
    fetchEmployeeRows()
      .then(({ rows }) => {
        if (cancelled) return;
        const byCity = new Map<string, CityData>();
        rows.forEach((row) => {
          const city = String(row.Office ?? 'Unknown');
          const salary = parseSalary(row.Salary);
          const previous = byCity.get(city) ?? { city, totalSalary: 0, count: 0 };
          previous.totalSalary += salary;
          previous.count += 1;
          byCity.set(city, previous);
        });

        const sorted = Array.from(byCity.values())
          .sort((a, b) => b.totalSalary - a.totalSalary)
          .slice(0, 8);
        setCityStats(sorted);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load analytics');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const maxSalary = useMemo(
    () => Math.max(1, ...cityStats.map((item) => item.totalSalary)),
    [cityStats]
  );

  return (
    <div className="analytics-page">
      <h1>Photo Result / Analytics</h1>
      <p className="analytics-subtitle">Details ID: {id}</p>
      {error && <p className="analytics-error">{error}</p>}

      <section className="analytics-card">
        <h2>Audit Image (Photo + Signature)</h2>
        {auditImage ? (
          <img src={auditImage} alt="Merged audit" className="audit-image" />
        ) : (
          <p>No audit image found. Capture and merge on the details page first.</p>
        )}
      </section>

      <section className="analytics-card">
        <h2>Salary Distribution per City (SVG Bars)</h2>
        <svg viewBox="0 0 820 320" className="chart-svg" role="img" aria-label="Salary by city">
          <rect x="0" y="0" width="820" height="320" fill="#f8fafc" />
          {cityStats.map((item, index) => {
            const x = 40 + index * 95;
            const barHeight = (item.totalSalary / maxSalary) * 210;
            const y = 250 - barHeight;
            return (
              <g key={item.city}>
                <rect x={x} y={y} width="55" height={barHeight} rx="4" fill="#3b82f6" />
                <text x={x + 27.5} y="268" textAnchor="middle" fontSize="11" fill="#334155">
                  {item.city}
                </text>
                <text x={x + 27.5} y={y - 8} textAnchor="middle" fontSize="10" fill="#0f172a">
                  ${(item.totalSalary / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      <section className="analytics-card">
        <h2>City Map (SVG Dots)</h2>
        <p className="map-note">
          City points use explicit city-to-coordinate mapping with deterministic fallback for unknown cities.
        </p>
        <svg viewBox="0 0 760 360" className="map-svg" role="img" aria-label="City map">
          <rect x="10" y="10" width="740" height="340" fill="#ecfeff" stroke="#cbd5e1" rx="10" />
          {cityStats.map((item) => {
            const coord = CITY_COORDS[item.city] ?? getFallbackCoord(item.city);
            const radius = Math.max(4, Math.min(12, item.count + 3));
            return (
              <g key={item.city}>
                <circle cx={coord.x} cy={coord.y} r={radius} fill="#f97316" opacity="0.85" />
                <text x={coord.x + 10} y={coord.y - 8} fontSize="11" fill="#0f172a">
                  {item.city}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      <style>{`
        .analytics-page {
          min-height: 100vh;
          padding: 1rem;
          background: #f1f5f9;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        h1 { margin: 0.5rem 0 0; }
        h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
        .analytics-subtitle { margin: 0; color: #475569; }
        .analytics-error { margin: 0; color: #b91c1c; }
        .analytics-card {
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.85rem;
        }
        .audit-image {
          width: min(100%, 640px);
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          display: block;
        }
        .chart-svg, .map-svg {
          width: 100%;
          height: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
        }
        .map-note { margin: 0 0 0.5rem; color: #475569; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
