import styled from 'styled-components';

const PlanTitleItem = ({ title }: { title: string }) => {
  return <Title>{title}</Title>;
};

export default PlanTitleItem;

const Title = styled.div`
  color: black;
  font-size: 1.7rem;
  font-weight: 500;
  white-space: pre;
  font-family: 'Pretendard';
  font-style: normal;
  text-align: center;
  @media (min-width: 1024px) {
    line-height: 30px;
  }
  @media (max-width: 1024px) {
    padding: 1rem;
    font-size: 1.5rem;
  }
`;
