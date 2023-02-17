import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

import PlanDateItem from './PlanDateItem';
import PlanTitleItem from './PlanTitleItem';
import PlanDotItem from './PlanDotItem';

const PlanBox = () => {
  const CurriculumData = [
    {
<<<<<<< HEAD
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
=======
      date: '2월',
      title: '아기사자\n모집',
    },
    {
      date: '3월-7월',
      title: '트랙별\n개별 세션',
    },
    {
      date: '7월-8월',
      title: '아이디어톤\n해커톤',
    },
    {
      date: '방학',
      title: '예정',
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
    },
  ];

  return (
    <BoxContainer>
      <ItemWrapper>
        <RowWrapper>
          {CurriculumData.map((item, i) => (
            <PlanDateItem key={i} date={item.date} />
          ))}
        </RowWrapper>

        <RowWrapper>
          <PlanDotItem />
        </RowWrapper>

        <RowWrapper>
          {CurriculumData.map((item, i) => (
            <PlanTitleItem key={i} title={item.title} />
          ))}
        </RowWrapper>
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
<<<<<<< HEAD
  @media (max-width: 900px) {
    padding: 3rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
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
