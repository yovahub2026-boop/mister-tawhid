/* =========================================================
   مكون الهيدر (Header)
   الدالة دي بترجع HTML الهيدر كامل
   عشان نستخدمه في كل الصفحات من غير تكرار
   ========================================================= */

function renderHeader(activePage = "") {
    // لو الصفحة الحالية هي الرئيسية، نضيف كلاس active على رابطها
    const isActive = (page) => (activePage === page ? "active" : "");

    return `
    <header class="site-header">
      <div class="container">
        <!-- اللوجو واسم المتجر -->
        <a href="/index.html" class="brand">
          <!-- هنا بنستخدم صورة اللوجو اللي هترفعها -->
          <img src="/assets/images/logo.jpg"
               alt="${STORE_NAME}"
               class="brand-logo-img"
               onerror="this.style.display='none'" />
          <div class="brand-text">
            <span class="brand-name">MISTER TAWHID</span>
            <span class="brand-sub">Clothing Factory</span>
          </div>
        </a>

        <!-- قائمة التنقل الرئيسية -->
        <nav class="nav">
          <a href="/index.html" class="${isActive('home')}">الرئيسية</a>
          <a href="/wholesale.html" class="${isActive('wholesale')}">الجملة</a>
          <a href="/retail.html" class="${isActive('retail')}">القطاعي</a>
          <a href="/about.html" class="${isActive('about')}">من نحن</a>
          <a href="/contact.html" class="${isActive('contact')}">تواصل معنا</a>
        </nav>

        <!-- الأزرار على اليسار -->
        <div class="header-actions">
          <a href="/cart.html" class="cart-btn" aria-label="سلة الطلبات">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-count hidden" data-cart-count>0</span>
          </a>

          <button class="menu-toggle" data-menu-toggle aria-label="القائمة">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- قائمة الموبايل -->
    <div class="mobile-menu" data-mobile-menu>
      <nav>
        <a href="/index.html">الرئيسية</a>
        <a href="/wholesale.html">الجملة</a>
        <a href="/retail.html">القطاعي</a>
        <a href="/about.html">من نحن</a>
        <a href="/contact.html">تواصل معنا</a>
      </nav>
    </div>
  `;
}

// دالة تركيب الهيدر في الصفحة
function mountHeader(containerSelector, activePage = "") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = renderHeader(activePage);

    // إضافة حدث فتح/قفل الموبايل منيو
    const toggleBtn = container.querySelector("[data-menu-toggle]");
    const mobileMenu = container.querySelector("[data-mobile-menu]");
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("is-open");
        });
    }
}