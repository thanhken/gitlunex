/* GitLunex landing — preloader, animated sky, scroll reveals, tilt,
   marquee clone and EN/VI language toggle. Vanilla, no dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------- preloader */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) setTimeout(function () { pre.classList.add("is-done"); }, 650);
  });

  /* -------------------------------------------------- nav shrink */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -------------------------------------------------- scrollspy (active nav) */
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var linkById = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (document.getElementById(id)) linkById[id] = a;
  });
  if ("IntersectionObserver" in window && Object.keys(linkById).length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = linkById[e.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    Object.keys(linkById).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* -------------------------------------------------- scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 6) * 55 + "ms";
      io.observe(el);
    });
  }

  /* -------------------------------------------------- marquee clone */
  var track = document.querySelector(".strip__track");
  var list = document.getElementById("stripList");
  if (track && list) {
    var clone = list.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.removeAttribute("id");
    track.appendChild(clone);
  }

  /* -------------------------------------------------- tilt on shots */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var img = el.querySelector("img");
      if (!img) return;
      el.addEventListener("mousemove", function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        img.style.transform = "rotateY(" + px * 5 + "deg) rotateX(" + -py * 4 + "deg)";
      });
      el.addEventListener("mouseleave", function () {
        img.style.transform = "";
      });
      img.style.transition = "transform 0.3s cubic-bezier(0.22,1,0.36,1)";
    });
  }

  /* -------------------------------------------------- animated sky
     Kept intentionally cheap so scrolling stays smooth: DPR 1, a modest star
     count and a ~30fps cap (twinkle doesn't need 60). Paused when hidden. */
  var canvas = document.getElementById("sky");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var W = 0, H = 0;
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = Math.min(110, Math.round((W * H) / 20000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.35,
          a: Math.random() * Math.PI * 2,
          s: Math.random() * 0.03 + 0.008,
          drift: (Math.random() - 0.5) * 0.04,
          hue: Math.random() > 0.5 ? "159,175,255" : "255,255,255",
        });
      }
    }
    var last = 0;
    var FRAME = 1000 / 30; // ~30fps cap
    function frame(ts) {
      requestAnimationFrame(frame);
      if (document.hidden || ts - last < FRAME) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.a += st.s;
        st.y += st.drift;
        if (st.y > H) st.y = 0;
        else if (st.y < 0) st.y = H;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, 6.283);
        ctx.fillStyle = "rgba(" + st.hue + "," + (0.25 + Math.abs(Math.sin(st.a)) * 0.55).toFixed(2) + ")";
        ctx.fill();
      }
    }
    resize();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
    requestAnimationFrame(frame);
  }

  /* -------------------------------------------------- i18n EN/VI */
  var I18N = {
    "nav.features": { en: "Features", vi: "Tính năng" },
    "nav.workflow": { en: "Workflow", vi: "Quy trình" },
    "nav.toolbox": { en: "Toolbox", vi: "Công cụ" },
    "nav.download": { en: "Download", vi: "Tải về" },
    "nav.get": { en: "Get GitLunex", vi: "Tải GitLunex" },

    "hero.eyebrow": {
      en: '<span class="eyebrow__dot"></span> Local-first Git client · Ubuntu · macOS · Windows',
      vi: '<span class="eyebrow__dot"></span> Git client cục bộ · Ubuntu · macOS · Windows',
    },
    "hero.title1": { en: "Your repositories,", vi: "Kho mã của bạn," },
    "hero.title2": { en: "in a new light.", vi: "dưới ánh sáng mới." },
    "hero.sub": {
      en: 'A fast, lightweight Git GUI that shells out to the same <code>git</code> you already trust. One window, browser-style tabs, a branch-aware history graph and a real embedded terminal — built on Tauri&nbsp;+&nbsp;Rust.',
      vi: 'Một Git GUI nhanh, nhẹ, gọi thẳng tới <code>git</code> bạn đã tin dùng. Một cửa sổ, tab kiểu trình duyệt, đồ thị lịch sử theo nhánh và terminal nhúng thật sự — xây trên Tauri&nbsp;+&nbsp;Rust.',
    },
    "hero.download": { en: "Download for Linux", vi: "Tải cho Linux" },
    "hero.github": { en: "View on GitHub", vi: "Xem trên GitHub" },
    "hero.meta": {
      en: "Free download · ~10&nbsp;MB binary · uses your system git, hooks &amp; credentials",
      vi: "Miễn phí · bản ~10&nbsp;MB · dùng git, hook &amp; credential hệ thống của bạn",
    },

    "stat.platforms": { en: "platforms — Ubuntu, macOS &amp; Windows", vi: "nền tảng — Ubuntu, macOS &amp; Windows" },
    "stat.size": { en: "tiny Tauri binary, low memory", vi: "bản Tauri nhỏ gọn, ít tốn RAM" },
    "stat.daemons": { en: "no background services or indexers", vi: "không dịch vụ nền hay bộ lập chỉ mục" },
    "stat.git": { en: "your git config, hooks &amp; credentials", vi: "đúng git, hook &amp; credential của bạn" },

    "feat.kicker": { en: "Everything, in one window", vi: "Tất cả trong một cửa sổ" },
    "feat.title": { en: "Built for the way you actually use Git.", vi: "Thiết kế đúng cách bạn dùng Git." },

    "feat1.h": { en: "A branch-aware history graph", vi: "Đồ thị lịch sử theo nhánh" },
    "feat1.p": {
      en: "See every branch, tag, remote and stash across all refs in one clean graph. Colored lanes, ref pills and ahead/behind badges make the shape of your history obvious at a glance.",
      vi: "Thấy mọi nhánh, tag, remote và stash trên tất cả ref trong một đồ thị gọn gàng. Làn màu, nhãn ref và chỉ số ahead/behind giúp hình dung lịch sử ngay tức thì.",
    },
    "feat1.b1": { en: "Graph across all refs, up to 500 commits", vi: "Đồ thị mọi ref, tới 500 commit" },
    "feat1.b2": { en: "Per-commit changed files &amp; diffs", vi: "Danh sách file &amp; diff theo từng commit" },
    "feat1.b3": { en: "Multi-select a range to compare", vi: "Chọn dải commit để so sánh" },

    "feat2.h": { en: "Stage, diff &amp; commit with flow", vi: "Stage, xem diff &amp; commit mượt mà" },
    "feat2.p": {
      en: "Staged, unstaged and untracked files sit side by side with a live diff preview. Stage a file, review the hunks, write a message and commit — <code>Ctrl/Cmd+Enter</code> and you're done.",
      vi: "File đã stage, chưa stage và chưa theo dõi nằm cạnh nhau với xem diff trực tiếp. Stage một file, xem hunk, viết message và commit — <code>Ctrl/Cmd+Enter</code> là xong.",
    },
    "feat2.b1": { en: "Stage / unstage / discard per file", vi: "Stage / unstage / bỏ thay đổi theo file" },
    "feat2.b2": { en: "Live syntax-highlighted diffs", vi: "Diff tô màu cú pháp trực tiếp" },
    "feat2.b3": { en: "Amend the last commit in a click", vi: "Amend commit gần nhất chỉ một cú nhấp" },

    "feat3.h": { en: "Read every change like a story", vi: "Đọc mọi thay đổi như một câu chuyện" },
    "feat3.p": {
      en: "Click any commit to see its files and a crisp unified diff — additions and deletions clearly marked, line numbers aligned. History stops being a wall of hashes and starts telling you what happened.",
      vi: "Nhấp vào commit bất kỳ để xem file và diff hợp nhất rõ ràng — thêm/xoá được đánh dấu rành mạch, số dòng thẳng hàng. Lịch sử không còn là bức tường hash.",
    },
    "feat3.b1": { en: "Per-file diffs for any commit", vi: "Diff từng file cho mọi commit" },
    "feat3.b2": { en: "Export or apply a range as a patch", vi: "Xuất hoặc áp một dải commit thành patch" },
    "feat3.b3": { en: "Reset, tag or rebase from the graph", vi: "Reset, tag hay rebase ngay từ đồ thị" },

    "feat4.h": { en: "A real terminal, built right in", vi: "Terminal thật, tích hợp sẵn" },
    "feat4.p": {
      en: "Toggle a full PTY shell rooted at the repo — powered by xterm.js — without ever leaving the window. Drop to the command line for anything the GUI doesn't cover, then jump straight back to the graph.",
      vi: "Bật shell PTY đầy đủ đặt tại repo — chạy bằng xterm.js — mà không rời cửa sổ. Xuống dòng lệnh cho những gì GUI chưa có, rồi quay lại đồ thị ngay.",
    },
    "feat4.b1": { en: "One interactive shell per repo tab", vi: "Một shell tương tác cho mỗi tab repo" },
    "feat4.b2": { en: "Pop out to your system terminal or file manager", vi: "Mở ra terminal hệ thống hoặc trình quản lý file" },
    "feat4.b3": { en: "Cross-platform, real PTY", vi: "Đa nền tảng, PTY thật" },

    "ws.kicker": { en: "One window, every repo", vi: "Một cửa sổ, mọi repo" },
    "ws.title": { en: "A tabbed workspace that keeps up with you.", vi: "Không gian làm việc dạng tab theo kịp bạn." },
    "ws.lead": {
      en: "A pinned Home launcher organises your repositories into nestable folders. Open each one as a browser-style tab — drag to reorder, middle-click to close, and every tab remembers its scroll, selection and terminal.",
      vi: "Màn hình Home ghim sẵn sắp xếp repo vào các thư mục lồng nhau. Mở mỗi repo thành một tab kiểu trình duyệt — kéo để đổi thứ tự, nhấp giữa để đóng, và mỗi tab nhớ vị trí cuộn, lựa chọn và terminal.",
    },
    "ws.k1": { en: "Open a tab", vi: "Mở tab" },
    "ws.k2": { en: "Close active tab", vi: "Đóng tab hiện tại" },
    "ws.k3": { en: "Cycle tabs", vi: "Chuyển tab" },
    "ws.k4": { en: "Jump to tab", vi: "Nhảy tới tab" },

    "grid.kicker": { en: "The full toolbox", vi: "Bộ công cụ đầy đủ" },
    "grid.title": { en: "Sourcetree-class features, minus the weight.", vi: "Tính năng ngang Sourcetree, nhẹ hơn nhiều." },
    "g1.h": { en: "Working copy", vi: "Working copy" },
    "g1.p": { en: "Staged, unstaged &amp; untracked lists with instant diffs.", vi: "Danh sách staged, unstaged &amp; untracked kèm diff tức thì." },
    "g2.h": { en: "Commit", vi: "Commit" },
    "g2.p": { en: "Write, amend and commit staged changes in a keystroke.", vi: "Viết, amend và commit thay đổi đã stage chỉ một phím." },
    "g3.h": { en: "History graph", vi: "Đồ thị lịch sử" },
    "g3.p": { en: "Branch-aware graph across every ref in the repo.", vi: "Đồ thị theo nhánh trên mọi ref của repo." },
    "g4.h": { en: "Branches, remotes &amp; tags", vi: "Nhánh, remote &amp; tag" },
    "g4.p": { en: "Create, checkout and delete from the sidebar.", vi: "Tạo, checkout và xoá ngay từ sidebar." },
    "g5.h": { en: "Remote sync", vi: "Đồng bộ remote" },
    "g5.p": { en: "Fetch, pull &amp; push with live ahead/behind badges.", vi: "Fetch, pull &amp; push với chỉ số ahead/behind trực tiếp." },
    "g6.h": { en: "Interactive rebase", vi: "Rebase tương tác" },
    "g6.p": { en: "Reorder, squash &amp; reword with an in-app conflict editor.", vi: "Sắp xếp, squash &amp; reword với trình sửa xung đột trong app." },
    "g7.h": { en: "Stash", vi: "Stash" },
    "g7.p": { en: "Push, pop, apply or branch your work-in-progress.", vi: "Push, pop, apply hay tạo nhánh từ việc dở dang." },
    "g8.h": { en: "Embedded terminal", vi: "Terminal nhúng" },
    "g8.p": { en: "A real PTY shell per tab, plus system-tool shortcuts.", vi: "Shell PTY thật cho mỗi tab, kèm phím tắt công cụ hệ thống." },
    "g9.h": { en: "Repository organizer", vi: "Trình sắp xếp repo" },
    "g9.p": { en: "Nestable folders and drag-to-organise on Home.", vi: "Thư mục lồng nhau và kéo-thả ngay trên Home." },

    "why.kicker": { en: "Why it feels fast", vi: "Vì sao nhanh" },
    "why.title": { en: "Native speed, because it isn't a browser in disguise.", vi: "Tốc độ gốc, vì nó không phải trình duyệt trá hình." },
    "why.lead": {
      en: "The shell is Tauri v2 — a small Rust binary instead of a bundled Chromium. Git operations shell out to your system <code>git</code> and are parsed in Rust, so every repo works exactly as it does on the command line — hooks, config, credential helpers and all.",
      vi: "Lớp vỏ là Tauri v2 — một binary Rust nhỏ thay vì Chromium đóng gói. Thao tác git gọi thẳng <code>git</code> hệ thống và được phân tích trong Rust, nên mọi repo hoạt động y như trên dòng lệnh — hook, config, credential helper, tất cả.",
    },
    "why1.h": { en: "Small &amp; light", vi: "Nhỏ &amp; nhẹ" },
    "why1.p": { en: "A ~10&nbsp;MB install with a low memory footprint.", vi: "Bản cài ~10&nbsp;MB, tốn ít bộ nhớ." },
    "why2.h": { en: "Your git, unchanged", vi: "Đúng git của bạn" },
    "why2.p": { en: "No reimplementation — it drives the real CLI.", vi: "Không viết lại — điều khiển CLI thật." },
    "why3.h": { en: "Cross-platform", vi: "Đa nền tảng" },
    "why3.p": { en: "One codebase for Linux, macOS &amp; Windows.", vi: "Một mã nguồn cho Linux, macOS &amp; Windows." },

    "dl.kicker": { en: "Get started", vi: "Bắt đầu" },
    "dl.title": { en: "Download GitLunex.", vi: "Tải GitLunex." },
    "dl.lead": {
      en: "Grab the installer for your platform from GitHub Releases. Make sure <code>git</code> is installed — GitLunex drives your system git.",
      vi: "Lấy bản cài cho nền tảng của bạn từ GitHub Releases. Hãy chắc <code>git</code> đã được cài — GitLunex điều khiển git hệ thống.",
    },
    "dl.linux": { en: ".deb &amp; .AppImage · Ubuntu 22.04+", vi: ".deb &amp; .AppImage · Ubuntu 22.04+" },
    "dl.macos": { en: ".dmg · Apple Silicon &amp; Intel", vi: ".dmg · Apple Silicon &amp; Intel" },
    "dl.win": { en: ".msi &amp; .exe · Windows 10+", vi: ".msi &amp; .exe · Windows 10+" },
    "dl.note": {
      en: "macOS builds are ad-hoc signed — on first launch run <code>xattr -rd com.apple.quarantine /Applications/GitLunex.app</code>. See the README for details.",
      vi: "Bản macOS được ký ad-hoc — lần đầu chạy hãy dùng <code>xattr -rd com.apple.quarantine /Applications/GitLunex.app</code>. Xem README để biết chi tiết.",
    },

    "footer.tag": { en: "A local Git client, in a new light. Built with Tauri&nbsp;+&nbsp;React.", vi: "Một Git client cục bộ, dưới ánh sáng mới. Xây với Tauri&nbsp;+&nbsp;React." },
    "footer.releases": { en: "Releases", vi: "Bản phát hành" },
    "footer.top": { en: "Back to top", vi: "Lên đầu trang" },
  };

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var entry = I18N[el.getAttribute("data-i18n")];
      if (entry && entry[lang] != null) el.innerHTML = entry[lang];
    });
    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("gitlunex.landing.lang", lang); } catch (e) {}
  }

  var saved = "en";
  try { saved = localStorage.getItem("gitlunex.landing.lang") || "en"; } catch (e) {}
  if (saved === "vi") applyLang("vi");
  else document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.classList.toggle("is-active", b.getAttribute("data-lang") === "en");
  });

  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });
})();
