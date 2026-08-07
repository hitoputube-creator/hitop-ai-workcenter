// ===== Supabase Auth 기반 관리자 세션 관리 =====
// admin-guard.js가 1차로(로컬 세션 존재 여부만) 걸러낸 뒤, 여기서는 실제 세션
// 유효성(만료·위조 여부)까지 Supabase에 확인하고, 이후 index.html의 sbFetch()가
// anon key 대신 로그인한 사용자의 JWT를 Authorization 헤더로 쓰도록
// window.SB_AUTH_TOKEN을 채워 넣는다.
const SUPABASE_URL = "https://xaxbkdnrzsghsabkdvzj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheGJrZG5yenNnaHNhYmtkdnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNjc5NTIsImV4cCI6MjA4OTY0Mzk1Mn0.l27ZYQHLt48p7EQrZ8gbAOmJHvCfIur84CtgoWlA8Wg";

const hitopWcAuthClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function hitopWcApplyAuthToken(session) {
  window.SB_AUTH_TOKEN = session && session.access_token ? session.access_token : SUPABASE_KEY;
}

function hitopWcRedirectToLogin() {
  const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
  location.replace("login.html?redirect=" + next);
}

async function hitopWcLogout() {
  try {
    await hitopWcAuthClient.auth.signOut();
  } finally {
    hitopWcApplyAuthToken(null);
    hitopWcRedirectToLogin();
  }
}

(async function hitopWcEnsureAdminSession() {
  const { data, error } = await hitopWcAuthClient.auth.getSession();
  if (error || !data.session) {
    hitopWcRedirectToLogin();
    return;
  }
  hitopWcApplyAuthToken(data.session);
})();

hitopWcAuthClient.auth.onAuthStateChange(function (event, session) {
  if (event === "SIGNED_OUT") {
    hitopWcApplyAuthToken(null);
    hitopWcRedirectToLogin();
    return;
  }
  hitopWcApplyAuthToken(session);
});
