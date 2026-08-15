import { useEffect, useRef } from 'react';

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const useGoogleIdentity = (onCredential: (idToken: string) => void, onUnavailable: () => void) => {
  const callbackRef = useRef(onCredential);
  const onUnavailableRef = useRef(onUnavailable);
  const isReadyRef = useRef(false);

  useEffect(() => {
    callbackRef.current = onCredential;
    onUnavailableRef.current = onUnavailable;
  });

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.');
      return;
    }

    const initialize = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => callbackRef.current(response.credential),
      });
      isReadyRef.current = true;
    };

    const handleScriptError = () => onUnavailableRef.current();

    if (window.google?.accounts?.id) {
      initialize();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = GIS_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', initialize);
    script.addEventListener('error', handleScriptError);
    return () => {
      script?.removeEventListener('load', initialize);
      script?.removeEventListener('error', handleScriptError);
    };
  }, []);

  // Case 1(스크립트 로드 전 클릭), Case 2(광고 차단 등으로 스크립트 자체가 안 뜨는 경우) 모두
  // window.google이 아직 없거나 initialize가 끝나지 않은 상태라 동일하게 처리한다.
  const promptLogin = () => {
    if (!isReadyRef.current || !window.google?.accounts?.id) {
      onUnavailableRef.current();
      return;
    }
    window.google.accounts.id.prompt();
  };

  return { promptLogin };
};

export default useGoogleIdentity;
