import styled from 'styled-components';

import TextButton from '@common/textButton/TextButton';
import { AssignmentSubmission } from 'src/apis/assignment';
import { IcDocument, IcDownload, IcLink } from '@assets/svg';
import { BackgroundColor, Label, Line, Material } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AssignmentSubmissionModalProps {
  submission: AssignmentSubmission;
  onClose: () => void;
}

const AssignmentSubmissionModal = ({ submission, onClose }: AssignmentSubmissionModalProps) => {
  return (
    <Overlay role="dialog" aria-modal="true" aria-label="제출물 보기">
      <Dimmer onClick={onClose} />
      <Modal>
        <Information>
          <Field>
            <FieldLabel>과제 설명</FieldLabel>
            <ContentBox>{submission.content}</ContentBox>
          </Field>

          <Resources>
            {submission.url && (
              <ResourceRow>
                <Resource href={submission.url} target="_blank" rel="noopener noreferrer">
                  <IcLink width={22} height={22} />
                  <ResourceText>{submission.url}</ResourceText>
                </Resource>
              </ResourceRow>
            )}
            {submission.files.map((file) => (
              <ResourceRow key={file.id}>
                <Resource href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                  <IcDocument width={22} height={22} />
                  <ResourceText>{file.originalFilename}</ResourceText>
                </Resource>
                <DownloadLink href={file.fileUrl} download aria-label={`${file.originalFilename} 다운로드`}>
                  <IcDownload width={22} height={22} />
                </DownloadLink>
              </ResourceRow>
            ))}
          </Resources>
        </Information>

        <Actions>
          <TextButton color="primary" onClick={onClose}>
            닫기
          </TextButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default AssignmentSubmissionModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

const Modal = styled.div`
  position: relative;
  width: 502px;
  max-width: 100%;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  overflow: hidden;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const ContentBox = styled.p`
  margin: 0;
  padding: 12px 16px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  box-shadow: 0 1px 2px -1px rgba(23, 23, 23, 0.1);
  color: ${Label.normal};
  white-space: pre-wrap;
  word-break: break-word;
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Resources = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Resource = styled.a`
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  box-shadow: 0 1px 2px -1px rgba(23, 23, 23, 0.1);
  color: ${Label.normal};
  text-decoration: none;
`;

const ResourceText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: underline;
  ${typographyCss(Typography.body1Normal.regular)}
`;

const DownloadLink = styled.a`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${Label.normal};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 28px 20px;
`;
