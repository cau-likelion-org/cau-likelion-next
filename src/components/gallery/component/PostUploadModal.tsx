import { useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '@common/button/Button';
import Radio from '@common/radio/Radio';
import Select from '@common/select/Select';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import IcAdd from '@assets/svg/ic-add.svg';
import IcCalender from '@assets/svg/ic-calender.svg';
import IcLineHorizontal from '@assets/svg/ic-line-horizontal.svg';
import IcXButton from '@assets/svg/ic-XButton.svg';
import { BackgroundColor, Fill, Label, Line, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const THUMBNAIL_COUNT = 9;
const CONTENT_PLACEHOLDER = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

export type PostType = 'session' | 'project' | 'gallery';

export interface PostUploadModalProps {
  onClose: () => void;
  postType: PostType;
  categoryLabel?: string;
  categoryOptions?: string[];
  showWeekField?: boolean;
  dateFieldLabel: string;
  dateMode: 'single' | 'range';
}

const PostUploadModal = ({
  onClose,
  postType,
  categoryLabel,
  categoryOptions,
  showWeekField = false,
  dateFieldLabel,
  dateMode,
}: PostUploadModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [generation, setGeneration] = useState('');
  const [category, setCategory] = useState('');
  const [week, setWeek] = useState('');

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Information>
          <ImageUploadGroup>
            <MainThumbnail>
              <FeaturedChip>대표</FeaturedChip>
            </MainThumbnail>
            <ThumbnailRow>
              <AddThumbnailButton type="button" aria-label="이미지 추가">
                <IcAdd width={24} height={24} />
              </AddThumbnailButton>
              {Array.from({ length: THUMBNAIL_COUNT }, (_, index) => (
                <ThumbnailSlot key={index} $featured={index === 0}>
                  <RemoveThumbnailButton type="button" aria-label="이미지 삭제">
                    <IcXButton width={24} height={24} />
                  </RemoveThumbnailButton>
                </ThumbnailSlot>
              ))}
            </ThumbnailRow>
          </ImageUploadGroup>

          <FieldGroup>
            <FieldHeading>
              제목
              <Required>*</Required>
            </FieldHeading>
            <TitleTextarea
              placeholder="메시지를 입력해 주세요."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              resize="fixed"
              bottomTrailingContent={<Counter>{title.length}/70</Counter>}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldHeading>
              내용
              <Required>*</Required>
            </FieldHeading>
            <ContentTextarea
              placeholder={CONTENT_PLACEHOLDER}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              resize="fixed"
              bottomTrailingContent={<Counter>{content.length}/300</Counter>}
            />
          </FieldGroup>

          <Row>
            <NarrowField>
              <TextField
                heading="기수 구분"
                required
                placeholder="숫자 입력"
                value={generation}
                onChange={(event) => setGeneration(event.target.value)}
              />
            </NarrowField>
            {categoryLabel && categoryOptions && (
              <CategorySelect label={categoryLabel} options={categoryOptions} value={category} onChange={setCategory} />
            )}
            {showWeekField && (
              <NarrowField>
                <TextField
                  heading="주차 구분"
                  required
                  placeholder="숫자 입력"
                  value={week}
                  onChange={(event) => setWeek(event.target.value)}
                />
              </NarrowField>
            )}
          </Row>

          <Row>
            <RowField $gap={8}>
              <FieldHeadingSmall>
                게시물 유형
                <RequiredSmall>*</RequiredSmall>
              </FieldHeadingSmall>
              <RadioRow>
                <RadioItem>
                  <Radio
                    label="세션"
                    checked={postType === 'session'}
                    disabled={postType !== 'session'}
                    onChange={() => {}}
                  />
                </RadioItem>
                <RadioItem>
                  <Radio
                    label="프로젝트"
                    checked={postType === 'project'}
                    disabled={postType !== 'project'}
                    onChange={() => {}}
                  />
                </RadioItem>
                <RadioItem>
                  <Radio
                    label="추억"
                    checked={postType === 'gallery'}
                    disabled={postType !== 'gallery'}
                    onChange={() => {}}
                  />
                </RadioItem>
              </RadioRow>
            </RowField>
            <RowField $gap={8}>
              <FieldHeadingSmall>
                {dateFieldLabel}
                <RequiredSmall>*</RequiredSmall>
              </FieldHeadingSmall>
              <DateField mode={dateMode} />
            </RowField>
          </Row>
        </Information>
        <Actions>
          <Button variant="outlined" color="assistive" size="large" onClick={onClose}>
            취소
          </Button>
          <Button variant="solid" color="primary" size="large" onClick={onClose}>
            등록하기
          </Button>
        </Actions>
      </Modal>
    </Backdrop>
  );
};

export default PostUploadModal;

const CategorySelect = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NarrowSelectWrapper>
      <Select
        heading={label}
        required
        placeholder="선택"
        value={value}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      />
      {isOpen && (
        <OptionList role="listbox">
          {options.map((option) => (
            <Option
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </Option>
          ))}
        </OptionList>
      )}
    </NarrowSelectWrapper>
  );
};

const SingleDateInput = ({ placeholder, ariaLabel }: { placeholder: string; ariaLabel: string }) => {
  const [date, setDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DateInputWrapper onClick={() => inputRef.current?.showPicker?.()}>
      <IcCalender width={22} height={22} />
      <DateValue $placeholder={!date}>{date || placeholder}</DateValue>
      <HiddenDateInput
        ref={inputRef}
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        aria-label={ariaLabel}
      />
    </DateInputWrapper>
  );
};

const DateField = ({ mode }: { mode: 'single' | 'range' }) => {
  if (mode === 'single') {
    return <SingleDateInput placeholder="캘린더 선택" ariaLabel="일자" />;
  }

  return (
    <DateRangeRow>
      <DateRangeItem>
        <SingleDateInput placeholder="시작일 선택" ariaLabel="시작일" />
      </DateRangeItem>
      <DateRangeDivider width={16} height={16} />
      <DateRangeItem>
        <SingleDateInput placeholder="종료일 선택" ariaLabel="종료일" />
      </DateRangeItem>
    </DateRangeRow>
  );
};

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  width: 1040px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  z-index: 10000;
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
`;

const ImageUploadGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

const MainThumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 22px;
  background-color: ${Fill.subtle};
`;

const FeaturedChip = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 9px 12px;
  border-radius: 10px;
  background-color: rgba(255, 96, 0, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 96, 0, 0.43);
  color: ${Orange.o500};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const ThumbnailRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 16px 4px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const AddThumbnailButton = styled.button`
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
`;

const ThumbnailSlot = styled.div<{ $featured: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  border-radius: 4px;
  background-color: ${Fill.subtle};
  box-shadow: ${(props) => (props.$featured ? `inset 0 0 0 2px ${Orange.o500}` : 'none')};
`;

const RemoveThumbnailButton = styled.button`
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  padding: 0;
  cursor: pointer;
`;

const FieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const FieldHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.title3.bold)}
  color: ${Label.neutral};
`;

const FieldHeadingSmall = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.label1Normal.bold)}
  color: ${Label.neutral};
`;

const Required = styled.span`
  color: #ff4242;
  ${typographyCss(Typography.title3.bold)}
`;

const RequiredSmall = styled.span`
  color: #ff4242;
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Counter = styled.span`
  padding: 0 4px;
  opacity: 0.74;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

const TitleTextarea = styled(Textarea)`
  textarea {
    min-height: 26px;
  }
`;

const ContentTextarea = styled(Textarea)`
  textarea {
    min-height: 172px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const RowField = styled.div<{ $gap?: number }>`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.$gap ?? 0}px;
`;

const NarrowField = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

const NarrowSelectWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 160px;
`;

const RadioRow = styled.div`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RadioItem = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  color: ${Label.normal};
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
  cursor: pointer;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const DateRangeRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateRangeItem = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

const DateValue = styled.span<{ $placeholder: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  ${typographyCss(Typography.body1Normal.regular)}
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
`;

const OptionList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  z-index: 1;
`;

const Option = styled.button`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: none;
  text-align: left;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Fill.subtle};
  }
`;

const Actions = styled.div`
  width: 100%;
  padding: 0 28px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 24px;
`;
