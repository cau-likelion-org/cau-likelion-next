import axios from 'axios';

import { getServerMessage } from '@utils/index';
import type { AssignmentFileInfo, AssignmentSubmission, AssignmentSubmitRequest } from './assignment';

export const SUBMIT_FAILED_MESSAGE = '제출에 실패했습니다. 다시 시도해 주세요.';
export const SUBMIT_UNVERIFIED_MESSAGE = '제출 여부를 확인하지 못했습니다. 제출 내역을 확인한 뒤 다시 시도해 주세요.';

export interface AssignmentBatchItem {
  id: string;
  format: 'file' | 'link';
  value: {
    files: File[];
    keptFiles: AssignmentFileInfo[];
    link: string;
    description: string;
  };
}

export interface AssignmentBatchDeps {
  upload: (file: File) => Promise<string>;
  submit: (assignmentId: number, payload: AssignmentSubmitRequest) => Promise<unknown>;
  // 재시도 때 이미 올라간 파일을 다시 올리지 않도록 화면이 들고 있는 캐시
  uploadCache?: Map<File, string>;
}

export interface AssignmentBatchResult {
  succeededIds: string[];
  // 서버가 거절했거나, 제출 요청 전 단계(업로드)에서 멈춘 건 — 서버에 반영되지 않았다
  failed: Record<string, string>;
  // 제출 요청은 나갔는데 응답을 못 받은 건 — 서버 반영 여부를 모른다
  unknownIds: string[];
}

// 응답 자체가 없는 실패(타임아웃·네트워크 끊김)는 서버가 처리했을 수도 있다
const isResultUnknown = (error: unknown) => axios.isAxiosError(error) && !error.response;

const uploadOnce = async (file: File, deps: AssignmentBatchDeps) => {
  const cached = deps.uploadCache?.get(file);
  if (cached) return cached;
  const url = await deps.upload(file);
  deps.uploadCache?.set(file, url);
  return url;
};

// 과제 여러 건을 차례로 제출하고, 건별 결과를 성공/실패/결과 불명으로 나눠 돌려준다.
// 한 건이 실패해도 나머지는 계속 진행한다.
export async function submitAssignmentBatch(
  items: AssignmentBatchItem[],
  deps: AssignmentBatchDeps,
): Promise<AssignmentBatchResult> {
  const result: AssignmentBatchResult = { succeededIds: [], failed: {}, unknownIds: [] };

  for (const { id, format, value } of items) {
    let files: AssignmentFileInfo[] | undefined;
    try {
      files =
        format === 'file'
          ? [
              ...value.keptFiles,
              ...(await Promise.all(
                value.files.map(async (file) => ({
                  fileUrl: await uploadOnce(file, deps),
                  originalFilename: file.name,
                })),
              )),
            ]
          : undefined;
    } catch (error) {
      // 업로드 단계 실패는 제출 요청 전이라 응답이 없어도 반영되지 않은 게 확실하다
      result.failed[id] = getServerMessage(error) ?? SUBMIT_FAILED_MESSAGE;
      continue;
    }

    try {
      await deps.submit(Number(id), {
        content: value.description.trim() || undefined,
        url: format === 'link' ? value.link.trim() : undefined,
        files,
      });
      result.succeededIds.push(id);
    } catch (error) {
      if (isResultUnknown(error)) result.unknownIds.push(id);
      else result.failed[id] = getServerMessage(error) ?? SUBMIT_FAILED_MESSAGE;
    }
  }

  return result;
}

// 최신 제출이 바뀌었는지 비교하는 키. 수정 제출은 같은 id에 submittedAt만 바뀔 수 있어 둘 다 본다
export const submissionFingerprint = (submission?: Pick<AssignmentSubmission, 'id' | 'submittedAt'>) =>
  submission ? `${submission.id}:${submission.submittedAt}` : null;

// 결과 불명 건을 제출 전/후 최신 제출 비교로 판정한다.
// latest가 없으면(이력 재조회 실패) 판정하지 않고 확인 불가로 남긴다.
export function resolveUnknownSubmissions(
  unknownIds: string[],
  before: Record<string, string | null>,
  latest: Record<string, string | null> | null,
): { appliedIds: string[]; failed: Record<string, string> } {
  const appliedIds: string[] = [];
  const failed: Record<string, string> = {};

  for (const id of unknownIds) {
    if (!latest) failed[id] = SUBMIT_UNVERIFIED_MESSAGE;
    else if (latest[id] != null && latest[id] !== before[id]) appliedIds.push(id);
    else failed[id] = SUBMIT_FAILED_MESSAGE;
  }

  return { appliedIds, failed };
}
