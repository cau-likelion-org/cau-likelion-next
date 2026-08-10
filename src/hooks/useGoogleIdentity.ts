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

const useGoogleIdentity = (onCredential: (idToken: string) => void) => {
  const callbackRef = useRef(onCredential);

  useEffect(() => {
    callbackRef.current = onCredential;
  });

  useEffect(() => {
    const initialize = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
        callback: (response) => callbackRef.current(response.credential),
      });
    };

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
    return () => script?.removeEventListener('load', initialize);
  }, []);

  const promptLogin = () => {
    window.google?.accounts.id.prompt();
  };

  return { promptLogin };
};

export default useGoogleIdentity;
