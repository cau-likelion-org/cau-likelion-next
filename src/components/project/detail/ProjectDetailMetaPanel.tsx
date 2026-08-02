import { IProjectDetail } from '@@types/request';
import { IcLineHorizontal } from '@assets/svg';
import Chip from '@common/chip/Chip';
import { DEV_STACK } from '@utils/constant';
import { Typography, typographyCss } from '@utils/constant/typography';
import githubIcon from '@image/github.png';
import webLinkIcon from '@image/weblink.png';
import youtubeIcon from '@image/youtube.png';
import Image from 'next/image';
import styled from 'styled-components';

const LINK_ICON = { web: webLinkIcon, github: githubIcon, youtube: youtubeIcon } as const;

interface ProjectDetailMetaPanelProps {
  date: string;
  devStack: IProjectDetail['dev_stack'];
  link: IProjectDetail['link'];
}

const ProjectDetailMetaPanel = ({ date, devStack, link }: ProjectDetailMetaPanelProps) => {
  const [startDate, endDate] = date.split('~');

  return (
    <Panel>
      <Row>
        <RowLabel>프로젝트 기간</RowLabel>
        <DateRow>
          <Chip size="small">{startDate}</Chip>
          {endDate && (
            <>
              <IcLineHorizontal width={24} height={24} />
              <Chip size="small">{endDate}</Chip>
            </>
          )}
        </DateRow>
      </Row>
      <Column>
        <RowLabel>기술스택</RowLabel>
        <ChipRow>
          {devStack?.map((stack) => (
            <Chip key={stack} size="small">
              {DEV_STACK[stack]}
            </Chip>
          ))}
        </ChipRow>
      </Column>
      <LinkRow>
        {(Object.keys(LINK_ICON) as Array<keyof typeof LINK_ICON>).map(
          (type) =>
            link[type] && (
              <LinkButton key={type} href={link[type]} target="_blank" rel="noreferrer" aria-label={type}>
                <Image src={LINK_ICON[type]} alt={type} width={20} height={20} />
              </LinkButton>
            ),
        )}
      </LinkRow>
    </Panel>
  );
};

export default ProjectDetailMetaPanel;

const Panel = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 22px;
  padding: 22px;
  border-radius: 16px;
  background-color: #f5f7f9;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const RowLabel = styled.span`
  flex-shrink: 0;
  color: #000;
  ${typographyCss(Typography.heading1.bold)}
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LinkButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 10px;
  background-color: #ff6000;
`;
