import { ReactNode } from 'react';
import { IcBehance, IcGithub, IcLineHorizontal, IcLink } from '@assets/svg';
import Chip from '@common/chip/Chip';
import { LinkPlatform, ProjectLinkDto } from 'src/apis/project';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

const LINK_PLATFORM_ICON: Record<LinkPlatform, ReactNode> = {
  WEB: <IcLink width={20} height={20} />,
  GITHUB: <IcGithub width={20} height={20} />,
  BEHANCE: <IcBehance width={20} height={14} />,
};

// 프로토콜 없이 저장된 링크(예: www.github.com/foo)는 상대경로로 취급되어 현재 주소 뒤에 붙는다
const toAbsoluteUrl = (url: string) => {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
};

interface ProjectDetailMetaPanelProps {
  startDate: string;
  endDate: string;
  stack: string;
  links: ProjectLinkDto[];
}

const ProjectDetailMetaPanel = ({ startDate, endDate, stack, links }: ProjectDetailMetaPanelProps) => {
  const stackItems = stack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const validLinks = links.filter((link) => link.url.trim());

  return (
    <Panel>
      <Row>
        <RowLabel>프로젝트 기간</RowLabel>
        <DateRow>
          <Chip size="small">{startDate}</Chip>
          {endDate && (
            <>
              <IcLineHorizontal width={24} height={24} style={{ color: Label.assistive }} />
              <Chip size="small">{endDate}</Chip>
            </>
          )}
        </DateRow>
      </Row>
      <Column>
        <RowLabel>기술스택</RowLabel>
        <ChipRow>
          {stackItems.map((item) => (
            <Chip key={item} size="small">
              {item}
            </Chip>
          ))}
        </ChipRow>
      </Column>
      <LinkRow>
        {validLinks.map((link) => (
          <LinkButton
            key={link.id}
            href={toAbsoluteUrl(link.url)}
            target="_blank"
            rel="noreferrer"
            aria-label={link.platform}
          >
            {LINK_PLATFORM_ICON[link.platform]}
          </LinkButton>
        ))}
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

  /* 모바일 시안에서는 기술스택과 동일하게 라벨 아래로 값이 내려간다 */
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
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
  color: #fff;
`;
