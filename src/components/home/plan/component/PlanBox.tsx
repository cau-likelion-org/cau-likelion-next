import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

import PlanDateItem from './PlanDateItem';
import PlanTitleItem from './PlanTitleItem';
import PlanDotItem from './PlanDotItem';

const PlanBox = () => {
  const CurriculumData = [
    {
      date: '3월',
      title: '트랙별\n세션 시작',
    },
    {
      date: '6월',
      title: '아이디어톤',
    },
    {
      date: '8월',
      title: '해커톤',
    },
    {
      date: '9월',
      title: '트랙별\n스터디 시작',
    },
    {
      date: '12월',
      title: '중앙대\n해커톤',
    },
  ];

  return (
    <BoxContainer>
      <ItemWrapper>
        <DateWrapper>
          {CurriculumData.map((item, i) => (
            <PlanDateItem key={i} date={item.date} />
          ))}
        </DateWrapper>

        <RowWrapper>
          <PlanDotItem />
        </RowWrapper>

        <TitleWrapper>
          {CurriculumData.map((item, i) => (
            <PlanTitleItem key={i} title={item.title} />
          ))}
        </TitleWrapper>
      </ItemWrapper>
    </BoxContainer>
  );
};

export default PlanBox;

const BoxContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: ${Primary.light};
  border-radius: 30px;
  flex-direction: column;
  justify-content: center;
  padding: 78px 102px;
  @media (max-width: 900px) {
    padding: 3rem;
  }
  position: relative;

  z-index: 2;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 50px;
  align-items: center;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;

  align-items: center;
`;

const DateWrapper = styled.div`
  display: flex;
  width: 106%;
  margin-left: 0.5rem;
  justify-content: space-between;
  position: relative;

  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 105%;
  margin-right: 1.5rem;
  justify-content: space-between;
  position: relative;
  align-items: center;
`;
