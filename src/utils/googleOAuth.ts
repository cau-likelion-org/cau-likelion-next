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

// Strict Mode 이중 호출 대응용 캐시. 다음 tick엔 비워서, 나중에 /login이 다시 마운트돼도
// 이미 소비된 idToken을 재사용하지 않게 한다.
let cachedResult: GoogleLoginRedirectResult | undefined;

const setCachedResult = (result: GoogleLoginRedirectResult) => {
  cachedResult = result;
  setTimeout(() => {
    cachedResult = undefined;
  }, 0);
  return result;
};

export const consumeGoogleLoginRedirect = (): GoogleLoginRedirectResult => {
  if (cachedResult !== undefined) return cachedResult;

  if (typeof window === 'undefined' || !window.location.hash) {
    return setCachedResult(null);
  }

  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.has('id_token') && !params.has('error')) {
    return setCachedResult(null);
  }

  const storedNonce = sessionStorage.getItem(GOOGLE_OAUTH_NONCE_KEY);
  sessionStorage.removeItem(GOOGLE_OAUTH_NONCE_KEY);
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  const error = params.get('error');
  if (error) {
    return setCachedResult({ error });
  }

  const idToken = params.get('id_token');
  return setCachedResult(
    !idToken || !storedNonce || decodeIdTokenNonce(idToken) !== storedNonce ? { error: 'invalid_token' } : { idToken },
  );
};
