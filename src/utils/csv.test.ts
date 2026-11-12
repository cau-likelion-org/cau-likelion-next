import { describe, expect, it } from 'vitest';

import { toCsv } from './csv';

describe('toCsv', () => {
  it('첫 줄에 BOM을 붙이고 행은 CRLF, 칸은 쉼표로 잇는다', () => {
    expect(
      toCsv([
        ['이름', '학번'],
        ['홍길동', '20231234'],
      ]),
    ).toBe('﻿이름,학번\r\n홍길동,20231234');
  });

  it('쉼표·따옴표·줄바꿈이 있는 칸은 따옴표로 감싸고 따옴표는 두 번 쓴다', () => {
    expect(toCsv([['a,b', '그는 "안녕"이라 했다', '첫 줄\n둘째 줄']])).toBe(
      '﻿"a,b","그는 ""안녕""이라 했다","첫 줄\n둘째 줄"',
    );
  });

  it('빈 칸은 그대로 비워 둔다', () => {
    expect(toCsv([['', '값', '']])).toBe('﻿,값,');
  });

  it('수식으로 실행될 수 있는 =, +, -, @로 시작하는 칸은 앞에 작은따옴표를 붙인다', () => {
    expect(toCsv([['=1+1', '+82', '-cmd', '@SUM(A1)', '1-2']])).toBe("﻿'=1+1,'+82,'-cmd,'@SUM(A1),1-2");
  });

  it('작은따옴표를 붙인 뒤에도 쉼표가 있으면 따옴표로 감싼다', () => {
    expect(toCsv([['=HYPERLINK("http://x","y")']])).toBe('﻿"\'=HYPERLINK(""http://x"",""y"")"');
  });
});
