// ===== 관리자 페이지 공용 동기 가드 =====
// 다른 어떤 스크립트보다 먼저 실행되어야 하므로, <head> 최상단에
// <script src="admin-guard.js">로 로드한다 (auth.js·본문 인라인 스크립트보다 앞).
//
// index.html 안의 SB_URL/SB_KEY는 본문 하단 인라인 스크립트에서만 정의되므로
// 이 시점엔 아직 접근할 수 없다 — 프로젝트 ref를 하드코딩해 세션 키를 직접 계산한다.
(function () {
  var SUPABASE_REF = "xaxbkdnrzsghsabkdvzj";
  var sessionKey = "sb-" + SUPABASE_REF + "-auth-token";
  var hasSession = false;
  try { hasSession = !!localStorage.getItem(sessionKey); } catch (e) {}
  if (!hasSession) {
    var next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.replace("login.html?redirect=" + next);
    return;
  }

  // 메인 업무센터(index.html)에만 업무일지와 동일한 네이비·골드 팔레트를 적용한다.
  // 기능/데이터 로직은 건드리지 않고, 기존 인라인 스타일 뒤에 테마 CSS만 추가한다.
  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "index.html") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.querySelector('link[data-hitop-diary-theme]')) return;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "diary-theme.css?v=20260809";
      link.setAttribute("data-hitop-diary-theme", "1");
      document.head.appendChild(link);
    }, { once: true });
  }
})();
