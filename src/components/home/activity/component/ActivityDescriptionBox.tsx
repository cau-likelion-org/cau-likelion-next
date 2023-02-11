import styled from 'styled-components';
import { motion } from 'framer-motion';
interface ActivityDescriptionBoxProps {
    text: string;
}

const ActivityDescriptionBox = ({ text }: ActivityDescriptionBoxProps) => {
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
        <BoxWrapper>
            <Text key={text} variants={variants} initial="hidden" animate="visible">
                {text}
            </Text>
        </BoxWrapper>
    );
};

export default ActivityDescriptionBox;

const BoxWrapper = styled.div`
  background: #f2f1ff;
  width: 40%;
  border-radius: 18px;
  display: flex;
  min-height: 300px;
  padding: 3rem;
    @media(max-width: 900px){
        width: 90%;
        min-height: 150px;
  }
`;

const Text = styled(motion.div)`
  font-family: 'Pretendard';
  font-style: normal;
  font-size: 2rem;
  color: black;
  line-height: 3rem;
  font-weight: 500;
`;