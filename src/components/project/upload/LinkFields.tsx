import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { IcAdd, IcTrash } from '@assets/svg';
import { Fill, Label } from '@utils/constant/color';
import LinkTypeSelect from './LinkTypeSelect';

export const LINK_TYPE_OPTIONS = ['Web', 'GitHub', 'Behance'];

export interface LinkRow {
  id: number;
  type: string;
  url: string;
}

const LinkFields = ({
  rows,
  onChange,
  nextId,
}: {
  rows: LinkRow[];
  onChange: Dispatch<SetStateAction<LinkRow[]>>;
  nextId: () => number;
}) => {
  const handleAddLinkRow = () => {
    onChange((prev) => [...prev, { id: nextId(), type: LINK_TYPE_OPTIONS[0], url: '' }]);
  };

  const handleRemoveLinkRow = (id: number) => {
    onChange((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <>
      {rows.map((row, index) => (
        <LinkRowWrapper key={row.id}>
          <LinkTypeSelect
            value={row.type}
            options={LINK_TYPE_OPTIONS}
            onChange={(type) => onChange((prev) => prev.map((r) => (r.id === row.id ? { ...r, type } : r)))}
          />
          <TextField
            placeholder="복사한 링크를 붙여넣어 주세요."
            value={row.url}
            onChange={(event) =>
              onChange((prev) => prev.map((r) => (r.id === row.id ? { ...r, url: event.target.value } : r)))
            }
          />
          {index > 0 && (
            <DeleteLinkButton type="button" onClick={() => handleRemoveLinkRow(row.id)} aria-label="링크 삭제">
              <IcTrash width={24} height={24} />
            </DeleteLinkButton>
          )}
        </LinkRowWrapper>
      ))}
      <AddLinkButton type="button" onClick={handleAddLinkRow} aria-label="링크 추가">
        <IcAdd width={20} height={20} />
      </AddLinkButton>
    </>
  );
};

export default LinkFields;

const LinkRowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const DeleteLinkButton = styled.button`
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

const AddLinkButton = styled.button`
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
