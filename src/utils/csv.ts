// 엑셀·노션이 한글을 깨지지 않게 UTF-8로 읽도록 BOM을 붙인다
const BOM = '﻿';

const escapeCell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

export const toCsv = (rows: string[][]) => BOM + rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');

export const downloadCsv = (fileName: string, rows: string[][]) => {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
