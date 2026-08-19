const GOOGLE_OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_OAUTH_NONCE_KEY = 'googleOAuthNonce';

export const redirectToGoogleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.');
    return;
  }

  const nonce = crypto.randomUUID();
  sessionStorage.setItem(GOOGLE_OAUTH_NONCE_KEY, nonce);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${window.location.origin}/login`,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce,
    prompt: 'select_account',
  });
  window.location.href = `${GOOGLE_OAUTH_ENDPOINT}?${params.toString()}`;
};

const decodeIdTokenNonce = (idToken: string): string | null => {
  try {
    const payload = idToken.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))).nonce ?? null;
  } catch {
    return null;
  }
};

export type GoogleLoginRedirectResult = { idToken: string } | { error: string } | null;

// URL fragment를 지우는 부수효과가 있어 두 번 호출하면 결과가 달라진다. React Strict Mode의
// 이중 호출과 무관하게 페이지당 한 번만 파싱하도록 모듈 스코프에 캐싱한다.
let cachedResult: GoogleLoginRedirectResult | undefined;

export const consumeGoogleLoginRedirect = (): GoogleLoginRedirectResult => {
  if (cachedResult !== undefined) return cachedResult;

  if (typeof window === 'undefined' || !window.location.hash) {
    cachedResult = null;
    return cachedResult;
  }

  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.has('id_token') && !params.has('error')) {
    cachedResult = null;
    return cachedResult;
  }

  const storedNonce = sessionStorage.getItem(GOOGLE_OAUTH_NONCE_KEY);
  sessionStorage.removeItem(GOOGLE_OAUTH_NONCE_KEY);
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  const error = params.get('error');
  if (error) {
    cachedResult = { error };
    return cachedResult;
  }

  const idToken = params.get('id_token');
  cachedResult =
    !idToken || !storedNonce || decodeIdTokenNonce(idToken) !== storedNonce ? { error: 'invalid_token' } : { idToken };
  return cachedResult;
};
