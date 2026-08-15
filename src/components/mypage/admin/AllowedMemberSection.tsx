import { useState } from 'react';
import styled from 'styled-components';

import { AllowedUserEmailItem } from '@@types/request';
import ListCell from '@common/listCell/ListCell';
import CircularLoading from '@common/loading/CircularLoading';
import Button from '@common/button/Button';
import EditButton from '@mypage/admin/component/EditButton';
import { IcCaretDown, IcCaretUp, IcPlus } from '@assets/svg';
import { isUnfilled } from '@utils/index';
import { BackgroundColor, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

interface LocalAllowedItem {
  key: string;
  id: number | null;
  name: string;
  email: string;
}

const toLocal = (item: AllowedUserEmailItem): LocalAllowedItem => ({
  key: item.id !== null ? String(item.id) : createId(),
  id: item.id,
  name: item.name,
  email: item.email,
});

interface AllowedMemberSectionProps {
  items: AllowedUserEmailItem[];
  isLoading?: boolean;
  isError?: boolean;
  onSave: (items: AllowedUserEmailItem[]) => void | Promise<unknown>;
  isSaving?: boolean;
}

const AllowedMemberSection = ({
  items,
  isLoading = false,
  isError = false,
  onSave,
  isSaving,
}: AllowedMemberSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<LocalAllowedItem[]>([]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const startEdit = () => {
    setDraft(items.map(toLocal));
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const updateItem = (key: string, patch: Partial<LocalAllowedItem>) => {
    setDraft((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const removeItem = (key: string) => setDraft((prev) => prev.filter((item) => item.key !== key));

  const addItem = () => setDraft((prev) => [...prev, { key: createId(), id: null, name: '', email: '' }]);

  const isDraftInvalid = draft.some((item) => isUnfilled(item.name) || isUnfilled(item.email));

  const handleSave = async () => {
    if (isDraftInvalid) return;
    setIsEditing(false);
    await onSave(draft.map(({ id, name, email }) => ({ id, name, email })));
  };

  return (
    <Wrapper>
      <ListCellBackground $open={isOpen}>
        <ListCell
          label="예비 회원 관리"
          leadingContent={isOpen ? <IcCaretUp width={20} height={20} /> : <IcCaretDown width={20} height={20} />}
          trailingContent={`총 ${items.length}명`}
          verticalAlign="center"
          onClick={toggleOpen}
        />
      </ListCellBackground>
      {isOpen && (
        <Panel>
          <PanelHeaderRow>
            <HeadCell>이름</HeadCell>
            <FlexHeadCell>가입 예정 이메일 (Gmail)</FlexHeadCell>
            {isEditing ? (
              <ButtonGroup>
                <Button color="assistive" size="small" onClick={cancelEdit} disabled={isSaving}>
                  취소
                </Button>
                <Button size="small" onClick={handleSave} loading={isSaving} disabled={isDraftInvalid}>
                  저장
                </Button>
              </ButtonGroup>
            ) : (
              <EditButton onClick={startEdit} />
            )}
          </PanelHeaderRow>

          {isLoading ? (
            <StateWrapper>
              <CircularLoading size={32} />
            </StateWrapper>
          ) : isError ? (
            <ErrorMessage>예비 회원 목록을 불러오지 못했습니다.</ErrorMessage>
          ) : isEditing ? (
            <RowList>
              {draft.map((item) => (
                <EditRow key={item.key}>
                  <NameField
                    value={item.name}
                    placeholder="이름"
                    onChange={(event) => updateItem(item.key, { name: event.target.value })}
                  />
                  <EmailField
                    type="email"
                    value={item.email}
                    placeholder="가입 예정 이메일"
                    onChange={(event) => updateItem(item.key, { email: event.target.value })}
                  />
                  <Button variant="outlined" color="assistive" size="small" onClick={() => removeItem(item.key)}>
                    삭제
                  </Button>
                </EditRow>
              ))}
              <AddButton type="button" onClick={addItem} aria-label="예비 회원 추가">
                <IcPlus width={20} height={20} />
              </AddButton>
            </RowList>
          ) : items.length === 0 ? (
            <ErrorMessage>등록된 예비 회원이 없습니다.</ErrorMessage>
          ) : (
            <RowList>
              {items.map((item, index) => (
                <Row key={item.id ?? index} $divider={index !== items.length - 1}>
                  <NameCell>{item.name}</NameCell>
                  <EmailCell>{item.email}</EmailCell>
                </Row>
              ))}
            </RowList>
          )}
        </Panel>
      )}
    </Wrapper>
  );
};

export default AllowedMemberSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 0 14px;
`;

const ListCellBackground = styled.div<{ $open: boolean }>`
  width: 100%;
  padding: 0 20px;
  border-radius: 8px;
  background-color: rgba(23, 23, 23, ${(props) => (props.$open ? 0.08 : 0.04)});
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  padding: 22px;
  border-radius: 14px;
  background-color: ${Black.b10};
`;

const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const HeadCell = styled.span`
  flex-shrink: 0;
  width: 90px;
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;

const FlexHeadCell = styled(HeadCell)`
  flex: 1 0 0;
  width: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 12px;
`;

const RowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Row = styled.div<{ $divider: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding-bottom: 20px;

  ${(props) => props.$divider && `border-bottom: 1px solid ${Line.normal};`}
`;

const NameCell = styled.span`
  flex-shrink: 0;
  width: 90px;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const EmailCell = styled.span`
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
`;

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: ${Orange.o500};
  color: ${BackgroundColor};
  cursor: pointer;
`;

const NameField = styled.input`
  flex-shrink: 0;
  width: 90px;
  padding: 4px 8px;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: rgba(23, 23, 23, 0.04);
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const EmailField = styled(NameField)`
  flex: 1 0 0;
  width: auto;
  min-width: 0;
  ${typographyCss(Typography.headline2.medium)}
`;

const StateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 120px;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
`;
