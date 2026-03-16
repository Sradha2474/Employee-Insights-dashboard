export const API_URL = 'https://backend.jotish.in/backend_dev/gettabledata.php';
export const API_PAYLOAD = { username: 'test', password: '123456' };

export type TableRow = Record<string, unknown>;

const DEFAULT_HEADERS = ['Name', 'Position', 'Office', 'Extn.', 'Start date', 'Salary'];

function toObjectRows(rows: unknown[]): TableRow[] {
  if (rows.length === 0) return [];
  const first = rows[0];

  if (Array.isArray(first)) {
    return rows.map((row) => {
      const arr = row as unknown[];
      const obj: TableRow = {};
      arr.forEach((cell, i) => {
        const key = DEFAULT_HEADERS[i] ?? `Column ${i}`;
        obj[key] = cell;
      });
      return obj;
    });
  }

  return rows as TableRow[];
}

export function parseEmployeeRows(json: unknown): TableRow[] {
  let rows: unknown[] = [];

  if (Array.isArray(json)) {
    rows = json;
  } else if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;

    if (obj.TABLE_DATA && typeof obj.TABLE_DATA === 'object') {
      const tableData = (obj.TABLE_DATA as Record<string, unknown>).data;
      if (Array.isArray(tableData)) rows = tableData;
    }

    if (!rows.length) {
      for (const key of ['data', 'rows', 'records', 'table', 'result', 'items']) {
        const val = obj[key];
        if (Array.isArray(val)) {
          rows = val;
          break;
        }
        if (val && typeof val === 'object' && Array.isArray((val as Record<string, unknown>).rows)) {
          rows = (val as { rows: unknown[] }).rows;
          break;
        }
        if (typeof val === 'string') {
          try {
            const parsed = JSON.parse(val) as unknown;
            if (Array.isArray(parsed)) {
              rows = parsed;
              break;
            }
          } catch {
            // ignore
          }
        }
      }
    }
  }

  if (!Array.isArray(rows) || rows.length === 0) return [];
  return toObjectRows(rows);
}

export async function fetchEmployeeRows(): Promise<{ rows: TableRow[]; raw: string }> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(API_PAYLOAD),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const raw = await response.text();
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON from API');
  }

  return { rows: parseEmployeeRows(json), raw };
}

export function parseSalary(value: unknown): number {
  if (typeof value !== 'string') return Number(value) || 0;
  const normalized = value.replace(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

// employeeApi defines small helper functions for talking to the backend.
// Keeping API calls here makes it easier to change endpoints or add error handling later.