/* =========================================================
   الملف الرئيسي للصفحة الرئيسية
   بيقرأ البيانات من Supabase بدل الملفات الوهمية
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    // 1) نركب الهيدر والفوتر
    mountHeader("#header-container", "home");
    mountFooter("#footer-container");

    // 2) نعرض الأقسام (من الداتابيز)
    await renderCategoriesFromDB();

    // 3) نعرض المنتجات المميزة (من الداتابيز)
    await renderFeaturedProductsFromDB();

    // 4) نعرض أحدث المنتجات (من الداتابيز)
    await renderLatestProductsFromDB();

    // 5) نقرأ محتوى الصفحة الرئيسية (العنوان والوصف من الداتابيز)
    await loadHomeContent();
});

/* =========================================================
   عرض الأقسام من قاعدة البيانات
   ========================================================= */
async function renderCategoriesFromDB() {
    const container = document.getElementById("categories-grid");
    if (!container) return;

    try {
        // بنجيب الأقسام النشطة بس
        const { data, error } = await supabaseClient
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error("خطأ في جلب الأقسام:", error);
            container.innerHTML = `<div class="empty-state">تعذر تحميل الأقسام.</div>`;
            return;
        }

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state">لا توجد أقسام.</div>`;
            return;
        }

        // رسم الكروت
        container.innerHTML = data.map(cat => `
            <a href="/retail.html?category=${cat.slug}" class="category-card">
                <span class="category-name">${cat.name}</span>
            </a>
        `).join("");

    } catch (err) {
        console.error(err);
    }
}

/* =========================================================
   عرض المنتجات المميزة من قاعدة البيانات
   ========================================================= */
async function renderFeaturedProductsFromDB() {
    const container = document.getElementById("featured-products");
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('is_featured', true)
            .eq('is_published', true);

        if (error) throw error;

        container.innerHTML = data.map(renderProductCard).join("");

    } catch (err) {
        console.error("خطأ في جلب المنتجات المميزة:", err);
        container.innerHTML = `<div class="empty-state">تعذر تحميل المنتجات.</div>`;
    }
}

/* =========================================================
   عرض أحدث المنتجات من قاعدة البيانات
   ========================================================= */
async function renderLatestProductsFromDB() {
    const container = document.getElementById("latest-products");
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(4);

        if (error) throw error;

        container.innerHTML = data.map(renderProductCard).join("");

    } catch (err) {
        console.error("خطأ في جلب أحدث المنتجات:", err);
        container.innerHTML = `<div class="empty-state">تعذر تحميل المنتجات.</div>`;
    }
}

/* =========================================================
   قراءة محتوى الصفحة الرئيسية من الداتابيز
   ========================================================= */
async function loadHomeContent() {
    try {
        const { data: content } = await supabaseClient
            .from('site_content')
            .select('*')
            .eq('id', 1)
            .single();

        if (content) {
            // بنغير العنوان الرئيسي في الـ Hero
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle) heroTitle.textContent = content.home_hero_title;

            // بنغير وصف الـ Hero
            const heroDesc = document.querySelector('.hero p');
            if (heroDesc) heroDesc.textContent = content.home_hero_desc;

            // بنغير نص "عن المصنع"
            const aboutText = document.querySelector('.about-strip p');
            if (aboutText) aboutText.textContent = content.about_text;
        }
    } catch (err) {
        console.error("خطأ في تحميل محتوى الموقع:", err);
    }
}

/* =========================================================
   دالة إنشاء كارت المنتج
   ========================================================= */
function renderProductCard(product) {
    const isAvailable = product.availability_status === "available";
    // في الصفحة الرئيسية بنعرض سعر القطاعي افتراضيًا
    const price = product.retail_price;

    return `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy" />
                ${!isAvailable ? '<span class="badge badge-unavailable">غير متاح</span>' : ""}
                ${product.is_featured && isAvailable ? '<span class="badge badge-featured">مميز</span>' : ""}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ${formatPrice(price)}
                    <span class="currency">${CURRENCY}</span>
                </div>
                <a href="/product.html?id=${product.id}" class="btn btn-outline" style="margin-top:auto;">
                    عرض التفاصيل
                </a>
            </div>
        </article>
    `;
}

/* =========================================================
   دالة تنسيق السعر
   ========================================================= */
function formatPrice(value) {
    return Number(value).toLocaleString("ar-EG");
}