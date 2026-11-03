/* =========================================================
   مكون الفوتر (Footer)
   بيتركز في كل الصفحات في الأسفل
   ========================================================= */

function renderFooter() {
    // السنة الحالية تتكتب أوتوماتيك عشان الحقوق متبقاش قديمة
    const year = new Date().getFullYear();

    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- الجزء الخاص بالبراند -->
          <div class="footer-brand">
            <img src="/assets/images/logo.jpg"
                 alt="${STORE_NAME}"
                 onerror="this.style.display='none'" />
            <p>
              مصنع ملابس متخصص في تصنيع وتوريد الملابس بجودة عالية،
              بيعمل بالجملة والقطاعي.
            </p>
          </div>

          <!-- روابط سريعة -->
          <div>
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="/index.html">الرئيسية</a></li>
              <li><a href="/wholesale.html">الجملة</a></li>
              <li><a href="/retail.html">القطاعي</a></li>
              <li><a href="/about.html">من نحن</a></li>
            </ul>
          </div>

          <!-- صفحات قانونية -->
          <div>
            <h4>معلومات</h4>
            <ul>
              <li><a href="/contact.html">تواصل معنا</a></li>
              <li><a href="/privacy.html">سياسة الخصوصية</a></li>
              <li><a href="/terms.html">الشروط والأحكام</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          © ${year} ${STORE_NAME} — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  `;
}

function mountFooter(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = renderFooter();
}