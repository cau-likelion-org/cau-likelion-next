// 작성 중인 지원서를 같은 브라우저에서 이어 쓸 수 있도록 지원자 비밀번호로 암호화해 localStorage에 둔다
// (공용 PC에서 다른 사람이 개발자 도구로 내용을 읽지 못하게 하려는 것으로, 비밀번호를 재설정하면 열 수 없다)

export interface ApplyBasicDraft {
  studentId: string;
  major: string;
  grade: string;
  semester: string;
  enrollmentStatus: string;
  referral: string;
  part: string;
  interviewSlots: string[];
}

export interface ApplyAnswersDraft {
  texts: Record<string, string>;
  choices: Record<string, string[]>;
}

export interface ApplyDraft {
  basic: ApplyBasicDraft;
  answers: ApplyAnswersDraft;
  // 첨부 파일은 저장하지 않으므로, 불러온 뒤 다시 올려 달라고 안내할지 판단하는 데만 쓴다
  hasFiles: boolean;
}

interface StoredDraft {
  expiresAt: string;
  iv: string;
  data: string;
}

const KEY_PREFIX = 'applyDraft:';
const PBKDF2_ITERATIONS = 200_000;

const BASE64_CHUNK_SIZE = 0x8000;

// 긴 답변은 바이트 수가 함수 인자 수 제한을 넘을 수 있어 나눠서 문자열로 바꾼다
const toBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let index = 0; index < bytes.length; index += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(index, index + BASE64_CHUNK_SIZE));
  }
  return btoa(binary);
};
const fromBase64 = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

// 저장소 키에 이메일이 그대로 드러나지 않게 해시로 만든다
const getStorageKey = async (email: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase()));
  return KEY_PREFIX + toBase64(new Uint8Array(digest));
};

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // 저장소를 쓸 수 없는 환경이면 지울 것도 없다
  }
};

export const deriveDraftKey = async (email: string, password: string) => {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(email.toLowerCase()),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

// 저장소가 꽉 찼거나 막혀 있으면 false를 돌려준다
export const saveApplyDraft = async (email: string, key: CryptoKey, draft: ApplyDraft, expiresAt: string) => {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(JSON.stringify(draft)),
    );
    const stored: StoredDraft = { expiresAt, iv: toBase64(iv), data: toBase64(new Uint8Array(encrypted)) };
    localStorage.setItem(await getStorageKey(email), JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
};

// 저장본이 없거나, 만료됐거나, 다른 비밀번호로 잠겨 있으면 null
export const loadApplyDraft = async (email: string, key: CryptoKey, now = new Date()) => {
  const storageKey = await getStorageKey(email);
  const raw = readStorage(storageKey);
  if (!raw) return null;
  try {
    const stored: StoredDraft = JSON.parse(raw);
    if (new Date(stored.expiresAt) <= now) {
      removeStorage(storageKey);
      return null;
    }
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(stored.iv) },
      key,
      fromBase64(stored.data),
    );
    return JSON.parse(new TextDecoder().decode(decrypted)) as ApplyDraft;
  } catch {
    return null;
  }
};

export const clearApplyDraft = async (email: string) => removeStorage(await getStorageKey(email));
