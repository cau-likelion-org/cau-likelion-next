import { IcLineHorizontal } from '@assets/svg';
import Chip from '@common/chip/Chip';
import { ProjectLinkDto } from 'src/apis/project';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { FiLink } from 'react-icons/fi';
import styled from 'styled-components';

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
          <LinkButton key={link.id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}>
            <FiLink size={20} color="#fff" />
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
