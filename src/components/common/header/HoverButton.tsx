import { BackgroundColor, Basic, GreyScale, Primary } from '@utils/constant/color';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { IHoverButton } from './NavBar';

interface IHoverButtonProps {
  hover: IHoverButton['hover'];
  dropdown: IHoverButton['dropdown'];
}

const HoverButton = ({ hover, dropdown }: IHoverButtonProps) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  const handleMouseOver = useCallback(() => setDropdownVisibility(true), []);
  const handleMouseOut = useCallback(() => setDropdownVisibility(false), []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.addEventListener('mouseover', handleMouseOver);
    c.addEventListener('mouseout', handleMouseOut);

    return () => {
      c.removeEventListener('mouseover', handleMouseOver);
      c.removeEventListener('mouseout', handleMouseOut);
    };
  }, [ref, handleMouseOut, handleMouseOver]);

  return (
    <Button onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} ref={ref}>
      {hover.title}
      {dropdownVisibility && (
        <DropdownList onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} ref={ref}>
          {dropdown.map((d, i) => (
            <>
              {d.routing && (
                <Link key={d.routing + i} href={d.routing}>
                  <Button className="hover">{d.title}</Button>
                </Link>
              )}
            </>
          ))}
        </DropdownList>
      )}
    </Button>
  );
};

export default HoverButton;

const Button = styled.div`
  background: none;
  padding: 1rem 4rem;
  border: none;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  &.hover {
    border-radius: 5px;
    font-weight: 500;
    &:hover {
      background-color: ${GreyScale.light};
    }
  }
`;

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  padding: 0.8rem;
  width: 100%;
  top: 3.5rem;
  z-index: 1;
  border-radius: 1rem;
  background-color: ${BackgroundColor};
  border-radius: 1rem;
  background-color: ${BackgroundColor};
  box-shadow: 3px 3px 20px 0px #00000014;
`;
