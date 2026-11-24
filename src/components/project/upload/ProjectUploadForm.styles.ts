import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import { IcLineHorizontal } from '@assets/svg';
import { AccentTint, BackgroundColor, Black, Fill, Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss } from '@utils/constant/breakpoint';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${containerCss}
  padding-bottom: 80px;
`;

export const PageTitle = styled.h2`
  margin: 0 0 42px;
  color: ${Black.b900};
  ${typographyCss(Typography.display3.bold)}
`;

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
  width: 100%;
`;

export const ImageUploadGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

export const MainThumbnail = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22px;
  background-color: ${(props) => (props.$hasImage ? '#f5f7f9' : '#f4f4f5')};
  cursor: pointer;
`;

export const MainThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const UploadGuide = styled.p`
  ${typographyCss(Typography.body2Normal.regular)}
  color: ${Orange.o500};
  text-align: center;
  margin: 0;
`;

export const FeaturedChip = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 9px 12px;
  border-radius: 10px;
  background-color: ${Orange.o50};
  box-shadow:
    inset 0 0 0 9999px rgba(255, 96, 0, 0.05),
    inset 0 0 0 1px ${AccentTint.border};
  color: ${Orange.o500};
  ${typographyCss(Typography.body2Normal.medium)}
`;

export const ThumbnailRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ThumbnailSlot = styled.label<{ $active?: boolean; $dragging?: boolean; $dropTarget?: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.$active ? `2px solid ${Orange.o500}` : 'none')};
  border-radius: 8px;
  background-color: ${Fill.subtle};
  color: ${Line.normal};
  cursor: pointer;
  padding: 0;
  opacity: ${(props) => (props.$dragging ? 0.4 : 1)};
  outline: ${(props) => (props.$dropTarget ? `2px dashed ${Orange.o500}` : 'none')};
  outline-offset: 2px;
`;

export const RemoveThumbnailButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;

  ${ThumbnailSlot}:hover &,
  ${ThumbnailSlot}:focus-within & {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const FieldHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.title3.bold)}
  color: ${Label.neutral};
`;

export const FieldHeadingSmall = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.label1Normal.bold)}
  color: ${Label.neutral};
`;

export const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.title3.bold)}
`;

export const RequiredSmall = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;

export const TitleTextarea = styled(Textarea)`
  textarea {
    min-height: 26px;
  }
`;

export const ContentTextarea = styled(Textarea)`
  textarea {
    min-height: 172px;
  }
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

export const NarrowField = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

export const TeamRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

export const TeamColumn = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
`;

export const ExtraPartGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const ExtraPartHeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const PartNameInput = styled.input`
  flex-shrink: 0;
  width: 94px;
  padding: 4px 6px;
  margin: 0 -6px;
  border: none;
  border-radius: 6px;
  outline: none;
  background-color: rgba(0, 0, 0, 0.04);
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.medium)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

export const DateFieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const DateRangeRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DateDescription = styled.p`
  margin: 0;
  width: 100%;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;

export const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

export const LinkHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

export const LinkRowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const DeleteLinkButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

export const AddLinkButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 375px;
  max-width: 100%;
  margin: 0 auto;

  button {
    width: 100%;
  }
`;

export const EditActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  width: 100%;
`;

export const ActionDescription = styled.p`
  margin: 0;
  text-align: center;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;
