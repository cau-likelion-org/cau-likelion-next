import styled from 'styled-components';
import { motion } from 'framer-motion';
interface TrackDescriptionBoxProps {
  type: string;
  title: string;
  text: string;
}

const TrackDescriptionBox = ({ type, title, text }: TrackDescriptionBoxProps) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <BoxWrapper type={type}>
      <BoldText key={title + text} variants={variants} initial="hidden" animate="visible">
        {title}
      </BoldText>
      <Text key={text} variants={variants} initial="hidden" animate="visible">
        {text}
      </Text>
    </BoxWrapper>
  );
};

export default TrackDescriptionBox;

const BoxWrapper = styled.div<{ type: string; }>`
  background: #f2f1ff;
  border-radius: 18px;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  gap: 3.6rem;
  @media (min-width: 1200px) {
    flex-basis: ${(props) => (props.type === 'recommend' ? '33%' : '66%')};
    min-height: 370px;
  }
  @media (max-width: 1200px) {
    margin: 0;
  }
  @media(max-width: 900px) {
    padding: 3rem;
  }

`;

const Text = styled(motion.div)`
  font-family: 'Pretendard';
  font-style: normal;
  font-size: 2rem;
  line-height: 3rem;
  color: black;
  font-weight: 500;
  @media (max-width: 900px) {
    font-size: 1.5rem;
    line-height: 2rem;
  }
`;

const BoldText = styled(Text)`
  font-weight: 700;
`;
