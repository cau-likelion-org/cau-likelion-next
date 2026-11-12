// 엑셀·노션이 한글을 깨지지 않게 UTF-8로 읽도록 BOM을 붙인다
const BOM = '﻿';

// 지원자가 쓴 답변이 =, +, -, @로 시작하면 스프레드시트가 수식으로 실행하므로 앞에 '를 붙여 글자로 취급하게 한다
const neutralizeFormula = (value: string) => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

const quoteCell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const escapeCell = (value: string) => quoteCell(neutralizeFormula(value));

export const toCsv = (rows: string[][]) => BOM + rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');

export const downloadCsv = (fileName: string, rows: string[][]) => {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
