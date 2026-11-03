/* =========================================================
   سكريبت صفحة القطاعي
   بيعرض المنتجات من Supabase
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    mountHeader("#header-container", "retail");
    mountFooter("#footer-container");

    // أول ما الصفحة تفتح، بنعرض المنتجات
    await renderRetailProducts();

    // بنفعل الفلتر
    const sortSelect = document.querySelector(".shop-toolbar select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            renderRetailProducts(e.target.value);
        });
    }
});

async function renderRetailProducts(sortBy = "newest") {
    const grid = document.getElementById("retail-grid");
    if (!grid) return;

    try {
        // 1) بنجيب المنتجات من الداتابيز (اللي متاحة للقطاعي أو both)
        let query = supabaseClient
            .from('products')
            .select('*')
            .eq('is_published', true)
            .in('visibility', ['retail', 'both']);

        // 2) بنطبق الترتيب
        if (sortBy === "price-asc") {
            query = query.order('retail_price', { ascending: true });
        } else if (sortBy === "price-desc") {
            query = query.order('retail_price', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        // 3) بنحدث عدد النتائج
        const countEl = document.getElementById("results-count");
        if (countEl) {
            countEl.textContent = `عرض ${data.length} منتجات`;
        }

        if (data.length === 0) {
            grid.innerHTML = `<div class="empty-state">لا توجد منتجات متاحة حالياً في قسم القطاعي.</div>`;
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
              ${formatPrice(product.retail_price)}
              <span class="currency">${CURRENCY}</span>
            </div>
            
            <a href="/product.html?id=${product.id}&type=retail" class="btn btn-dark" style="margin-top:auto;">
              عرض التفاصيل
            </a>
          </div>
        </article>
      `;
        }).join("");

    } catch (err) {
        console.error("خطأ في جلب منتجات القطاعي:", err);
        grid.innerHTML = `<div class="empty-state">تعذر تحميل المنتجات حالياً.</div>`;
    }
}

/* =========================================================
   دالة تنسيق السعر
   ========================================================= */
function formatPrice(value) {
    return Number(value).toLocaleString("ar-EG");
}