/* =========================================================
   سكريبت صفحة الجملة
   بيعرض المنتجات من Supabase
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    mountHeader("#header-container", "wholesale");
    mountFooter("#footer-container");

    // أول ما الصفحة تفتح، بنعرض المنتجات
    await renderWholesaleProducts();

    // بنفعل الفلتر
    const sortSelect = document.querySelector(".shop-toolbar select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            renderWholesaleProducts(e.target.value);
        });
    }
});

async function renderWholesaleProducts(sortBy = "newest") {
    const grid = document.getElementById("wholesale-grid");
    if (!grid) return;

    try {
        // 1) بنجيب المنتجات من الداتابيز (اللي متاحة للجملة أو both)
        let query = supabaseClient
            .from('products')
            .select('*')
            .eq('is_published', true)
            .in('visibility', ['wholesale', 'both']);

        // 2) بنطبق الترتيب
        if (sortBy === "price-asc") {
            query = query.order('wholesale_price', { ascending: true });
        } else if (sortBy === "price-desc") {
            query = query.order('wholesale_price', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false }); // الأحدث
        }

        const { data, error } = await query;

        if (error) throw error;

        // 3) بنحدث عدد النتائج
        const countEl = document.getElementById("results-count");
        if (countEl) {
            countEl.textContent = `عرض ${data.length} منتجات`;
        }

        if (data.length === 0) {
            grid.innerHTML = `<div class="empty-state">لا توجد منتجات متاحة حالياً في قسم الجملة.</div>`;
            return;
        }

        // 4) بنرسم الكروت
        grid.innerHTML = data.map((product) => {
            const isAvailable = product.availability_status === "available";

            return `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image_url}" alt="${product.name}" loading="lazy" />
            ${!isAvailable ? '<span class="badge badge-unavailable">غير متاح</span>' : ""}
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
              ${formatPrice(product.wholesale_price)}
              <span class="currency">${CURRENCY}</span>
            </div>
            ${product.minimum_wholesale_quantity ? `<span style="font-size: var(--fs-xs); color: var(--color-text-muted);">الحد الأدنى: ${product.minimum_wholesale_quantity} قطعة</span>` : ""}
            
            <a href="/product.html?id=${product.id}&type=wholesale" class="btn btn-primary" style="margin-top:auto;">
              عرض التفاصيل
            </a>
          </div>
        </article>
      `;
        }).join("");

    } catch (err) {
        console.error("خطأ في جلب منتجات الجملة:", err);
        grid.innerHTML = `<div class="empty-state">تعذر تحميل المنتجات حالياً.</div>`;
    }
}

/* =========================================================
   دالة تنسيق السعر
   ========================================================= */
function formatPrice(value) {
    return Number(value).toLocaleString("ar-EG");
}