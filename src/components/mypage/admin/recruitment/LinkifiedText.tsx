import { Fragment } from 'react';
import styled from 'styled-components';

// 서버에는 순수 텍스트로 저장되므로, 읽기 전용 미리보기에서만 URL을 링크로 인식해 보여준다
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

const LinkifiedText = ({ text, className }: LinkifiedTextProps) => (
  <span className={className}>
    {text.split(URL_REGEX).map((part, index) =>
      index % 2 === 1 ? (
        <Link key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </Link>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    )}
  </span>
);

export default LinkifiedText;

const Link = styled.a`
  color: inherit;
  text-decoration: underline;
`;
