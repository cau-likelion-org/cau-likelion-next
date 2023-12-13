import Script from 'next/script';

const GA = () => (
  // { ga_id }: { ga_id: string }
  <>
    {/* <Script
      async
      src={`https://www.googletagmanager.com/gtag/js? 
      id=${ga_id}`}
    ></Script>
    <Script
      id="google-analytics"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${ga_id}');
        `,
      }}
    ></Script> */}
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js? 
      id=G-3V9ZQGVHVM`}
    ></Script>
    <Script
      id="google-analytics"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3V9ZQGVHVM');
        `,
      }}
    ></Script>
  </>
);
export default GA;
