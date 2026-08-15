// FCM 백그라운드 알림 처리용 서비스 워커.
// public/ 파일이라 번들러를 거치지 않아 환경변수를 못 읽는다.
// 그래서 등록할 때(src/lib/pushNotification.ts) 쿼리스트링으로 config를 넘겨받는다.

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const params = new URL(self.location).searchParams;

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
});

const DEFAULT_URL = '/mypage/assignment';

firebase.messaging().onBackgroundMessage((payload) => {
  // payload에 notification이 있으면 브라우저가 알아서 표시하므로,
  // 여기서 또 showNotification을 호출하면 알림이 두 번 뜬다.
  if (payload.notification) return;

  const data = payload.data || {};
  self.registration.showNotification(data.title || '중앙대 멋쟁이사자처럼', {
    body: data.body,
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-96x96.png',
    data,
  });
});

// 알림을 누르면 이미 열려 있는 탭을 재사용하고, 없으면 새로 연다
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || DEFAULT_URL;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const client = clientList.find((item) => 'focus' in item);
      if (client) return client.focus().then((focused) => focused.navigate(url));
      return self.clients.openWindow(url);
    }),
  );
});
