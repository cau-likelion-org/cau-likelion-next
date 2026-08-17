type ReactGa = typeof import('react-ga4').default;

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WPZ880EJTD';

// react-ga4를 정적으로 import하면 _app 청크에 들어가 첫 화면 렌더를 막는다.
// 첫 페이지뷰를 보내는 시점에 내려받고 그때 initialize한다.
let gaPromise: Promise<ReactGa> | null = null;

const loadGa = (): Promise<ReactGa> | null => {
  if (typeof window === 'undefined' || !GA_ID) return null;
  if (!gaPromise) {
    gaPromise = import('react-ga4').then((module) => {
      module.default.initialize(GA_ID);
      return module.default;
    });
  }
  return gaPromise;
};

export const sendPageView = (page: string) => {
  void loadGa()?.then((ga) => ga.send({ hitType: 'pageview', page }));
};
