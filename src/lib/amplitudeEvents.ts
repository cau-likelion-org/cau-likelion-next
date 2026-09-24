// 이 사이트에서 보내는 Amplitude 이벤트 전체 카탈로그.
// track()이 이 타입만 받게 해서, 이벤트명 오타나 프로퍼티 누락을 컴파일 시점에 잡는다.
// 새 이벤트를 추가할 땐 여기에 먼저 등록하고 써야 한다.
export interface AmplitudeEventProperties {
  'Page Viewed': {
    page_path: string;
    referrer_path: string;
    is_logged_in: boolean;
  };
  'Login Started': {
    button_label: string;
  };
  'Login Completed': {
    login_method: string;
    is_new_signup: boolean;
    // 신규가입 완료일 때만, Signup Required부터 이어진 시도를 같은 id로 묶어준다
    attempt_session_id?: string;
  };
  'Login Failed': {
    login_method: string;
  };
  'Signup Required': {
    login_method: string;
    attempt_session_id: string;
  };
  'Signup Submitted': {
    attempt_session_id: string;
    attempt_number: number;
  };
  'Signup Failed': {
    attempt_session_id: string;
    attempt_number: number;
    failure_reason: 'validation_error' | 'network_error' | 'server_error';
  };
  'GNB Tab Clicked': {
    tab_name: string;
    is_external: boolean;
    is_logged_in: boolean;
    device_type: string;
  };
  'Attendance Screen Viewed': {
    is_target: boolean;
    device_type: string;
    attempt_session_id: string;
  };
  'Attendance Submitted': {
    attempt_session_id: string;
    attempt_number: number;
    trigger_type: 'button_click' | 'enter_key';
    device_type: string;
  };
  'Attendance Failed': {
    attempt_session_id: string;
    attempt_number: number;
    failure_reason: 'wrong_password' | 'network_error' | 'server_error';
    device_type: string;
  };
  'Attendance Completed': {
    device_type: string;
    click_count_since_login: number;
    attendance_retry_count: number;
    trigger_type: 'button_click' | 'enter_key';
    attempt_session_id: string;
  };
  'Archiving Card Clicked': {
    archiving_type: 'session' | 'project' | 'gallery';
    item_id: number;
    item_title: string;
    card_position: number;
    referrer_path: string;
  };
  'Image Load Completed': {
    page_path: string;
    load_duration_ms: number;
    image_count: number;
    device_type: string;
  };
  'Archiving Scroll Depth Reached': {
    depth_percent: number;
    page_path: string;
    archiving_type: 'session' | 'project' | 'gallery';
  };
  'Archiving Page Exited': {
    page_path: string;
    time_on_page_ms: number;
    max_scroll_depth: number;
    archiving_type: 'session' | 'project' | 'gallery';
  };
  'About Scroll Depth Reached': {
    depth_percent: number;
    page_path: string;
  };
  'About Page Exited': {
    page_path: string;
    time_on_page_ms: number;
    max_scroll_depth: number;
    exit_type: 'internal_navigation' | 'left_site';
    next_path?: string;
    took_next_action: boolean;
  };
  'Project Tab Page Exited': {
    page_path: string;
    time_on_page_ms: number;
  };
  'Blog Post Clicked': {
    post_id: number;
    post_title: string;
    url: string;
  };
  'Blog Return Detected': {
    post_id: number;
    away_duration_ms: number;
  };
}

export type AmplitudeEventName = keyof AmplitudeEventProperties;
