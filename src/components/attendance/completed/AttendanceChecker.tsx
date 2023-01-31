import styled from 'styled-components';
import Image, { StaticImageData } from 'next/image';

import { MemberStackKor } from '@@types/request';

import { GreyScale } from '@utils/constant/color';

import PMattendanceImg from '@image/PMattendance.png';
import DesignattendanceImg from '@image/Designattendance.png';
import FrontattendanceImg from '@image/Frontattendance.png';
import BackattendanceImg from '@image/Backattendance.png';

const image: Record<MemberStackKor, StaticImageData> = {
  기획: PMattendanceImg,
  디자인: DesignattendanceImg,
  프론트엔드: FrontattendanceImg,
  백엔드: BackattendanceImg,
};
interface IProps {
  color: string;
  number: number;
  userData: string[];
  type: MemberStackKor;
}

const AttendanceChecker = ({ color, number, userData, type }: IProps) => {
  const IS_ATTENDANCED = number < userData.length;
  if (IS_ATTENDANCED) {
    return (
      <ImageWrapper>
        <Image src={image[type]} alt={type} width={127} height={127} />
        <ImageText>{userData[number]}</ImageText>
      </ImageWrapper>
    );
  }

  return <Circle color={color}>{number}</Circle>;
};

export default AttendanceChecker;
const Circle = styled.div`
  width: 127px;
  height: 127px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 3rem;
  color: ${GreyScale.default};
`;
const ImageWrapper = styled.div`
  position: relative;
  object-fit: cover;
  width: 127px;
  height: 127px;
`;
const ImageText = styled.div`
  position: absolute;
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 30px;
  text-align: center;
  color: #fefeff;
  transform: rotate(-30deg);
  top: 36%;
  left: 19%;
`;
