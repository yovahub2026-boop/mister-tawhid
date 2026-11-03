/* =========================================================
   سكريبت صفحة تفاصيل المنتج
   بيقرأ الـ id من الرابط، ويجيب بيانات المنتج من Supabase
   وبيجيب صور المنتج الإضافية
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    mountHeader("#header-container", "product");
    mountFooter("#footer-container");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const type = params.get("type") || "retail";

    if (!productId) {
        renderError("لم يتم تحديد المنتج المطلوب.");
        return;
    }

    try {
        // 1) بنجيب المنتج الأساسي
        const { data: product, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .eq('is_published', true)
            .single();

        if (error || !product) {
            renderError("المنتج غير موجود أو غير متاح.");
            return;
        }

        // 2) بنرسم الصفحة
        renderProductDetails(product, type);

        // 3) بنجيب الصور الإضافية بعد رسم الصفحة
        await loadProductImages(productId);

    } catch (err) {
        console.error("خطأ في جلب تفاصيل المنتج:", err);
        renderError("حدث خطأ أثناء تحميل المنتج.");
    }
});

/* =========================================================
   عرض تفاصيل المنتج
   ========================================================= */
function renderProductDetails(product, type) {
    const container = document.getElementById("product-details");
    if (!container) return;

    const isAvailable = product.availability_status === "available";
    const isWholesale = type === "wholesale";
    const price = isWholesale ? product.wholesale_price : product.retail_price;

    const sizesHtml = (product.sizes || []).map((size) => `
        <button class="option-btn" data-size="${size}">${size}</button>
    `).join("");

    const colorsHtml = (product.colors || []).map((color) => `
        <button class="option-btn" data-color="${color}">${color}</button>
    `).join("");

    container.innerHTML = `
        <!-- صور المنتج -->
        <div class="product-gallery">
            <div class="product-main-image">
                <img id="main-product-image" src="${product.image_url}" alt="${product.name}" />
            </div>
            <!-- مكان الصور الإضافية -->
            <div id="product-thumbnails" style="display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; padding-bottom: 8px;"></div>
        </div>

        <!-- معلومات المنتج -->
        <div class="product-info-col">
            <h1 class="product-title">${product.name}</h1>
            
            <div class="product-price-large">
                ${formatPrice(price)} <span style="font-size: var(--fs-sm); font-weight: normal; color: var(--color-text-muted);">${CURRENCY}</span>
                ${isWholesale ? '<span style="font-size: var(--fs-xs); color: var(--color-gold); display: block;">سعر الجملة</span>' : ''}
            </div>

            <p class="product-desc">${product.description}</p>

            ${isWholesale && product.minimum_wholesale_quantity ? `
                <p style="font-size: var(--fs-sm); color: #C0392B; font-weight: var(--fw-medium);">
                    الحد الأدنى للطلب من هذا المنتج: ${product.minimum_wholesale_quantity} قطعة.
                </p>
            ` : ""}

            ${isAvailable ? `
                <div class="option-group">
                    <label>المقاس:</label>
                    <div class="option-values" id="size-options">${sizesHtml}</div>
                </div>

                <div class="option-group">
                    <label>اللون:</label>
                    <div class="option-values" id="color-options">${colorsHtml}</div>
                </div>

                <div class="add-to-cart-area">
                    <div class="quantity-input">
                        <button type="button" data-qty-minus>−</button>
                        <span id="product-qty" style="padding: 0 15px; font-weight: bold; min-width: 30px; text-align: center; display: inline-block;">1</span>
                        <button type="button" data-qty-plus>+</button>
                    </div>
                    <button class="btn btn-primary" id="add-to-cart-btn">أضف إلى الطلب</button>
                </div>
            ` : `
                <div class="unavailable-message">هذا المنتج غير متاح حالياً.</div>
            `}
        </div>
    `;

    setupOptions();
    if (isAvailable) {
        setupQuantity();
        setupAddToCart(product, type);
    }
}

/* =========================================================
   جلب وعرض صور المنتج الإضافية
   ========================================================= */
async function loadProductImages(productId) {
    const thumbnailsContainer = document.getElementById("product-thumbnails");
    if (!thumbnailsContainer) return;

    try {
        // بنجيب كل الصور المرتبطة بالمنتج من جدول product_images
        const { data: images, error } = await supabaseClient
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });

        if (error) throw error;

        // لو مفيش صور إضافية، بنخفي المعرض
        if (!images || images.length === 0) {
            thumbnailsContainer.style.display = 'none';
            return;
        }

        // بنرسم الصور الصغيرة
        thumbnailsContainer.innerHTML = images.map((img, index) => `
            <img src="${img.image_url}" 
                 alt="صورة المنتج"
                 style="width: 70px; height: 90px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--color-gold)' : 'transparent'}; transition: border 0.2s;"
                 onclick="changeMainImage('${img.image_url}', this)"
            />
        `).join("");

    } catch (err) {
        console.error("خطأ في جلب صور المنتج:", err);
    }
}

/* =========================================================
   تغيير الصورة الرئيسية عند الضغط على صورة صغيرة
   ========================================================= */
function changeMainImage(url, element) {
    const mainImg = document.getElementById("main-product-image");
    if (mainImg) {
        mainImg.src = url;
    }
    // بنشيل التحديد الذهبي من كل الصور، ونحطه على اللي اتضغط عليها
    const allThumbs = document.querySelectorAll("#product-thumbnails img");
    allThumbs.forEach(img => img.style.border = '2px solid transparent');
    element.style.border = '2px solid var(--color-gold)';
}

/* =========================================================
   تفعيل المقاسات والألوان
   ========================================================= */
function setupOptions() {
    const sizeBtns = document.querySelectorAll("#size-options .option-btn");
    sizeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            sizeBtns.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    const colorBtns = document.querySelectorAll("#color-options .option-btn");
    colorBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            colorBtns.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });
}

/* =========================================================
   تفعيل الكمية
   ========================================================= */
function setupQuantity() {
    const qtyElement = document.getElementById("product-qty");
    const plusBtn = document.querySelector("[data-qty-plus]");
    const minusBtn = document.querySelector("[data-qty-minus]");

    if (!qtyElement || !plusBtn || !minusBtn) return;

    plusBtn.addEventListener("click", () => {
        qtyElement.textContent = Number(qtyElement.textContent) + 1;
    });

    minusBtn.addEventListener("click", () => {
        let currentQty = Number(qtyElement.textContent);
        if (currentQty > 1) {
            qtyElement.textContent = currentQty - 1;
        }
    });
}

/* =========================================================
   تفعيل زرار الإضافة للسلة
   ========================================================= */
function setupAddToCart(product, type) {
    const addBtn = document.getElementById("add-to-cart-btn");
    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
        const selectedSize = document.querySelector("#size-options .option-btn.selected");
        const selectedColor = document.querySelector("#color-options .option-btn.selected");
        const qty = Number(document.getElementById("product-qty").textContent);

        if (!selectedSize) { showToast("من فضلك اختر المقاس أولاً", true); return; }
        if (!selectedColor) { showToast("من فضلك اختر اللون أولاً", true); return; }

        if (type === "wholesale" && product.minimum_wholesale_quantity) {
            if (qty < product.minimum_wholesale_quantity) {
                showToast(`الحد الأدنى للطلب من هذا المنتج هو ${product.minimum_wholesale_quantity} قطعة.`, true);
                return;
            }
        }

        addToCart(product, selectedSize.dataset.size, selectedColor.dataset.color, qty, type);
        showToast(`تمت إضافة ${product.name} إلى السلة بنجاح!`);
    });
}

// دالة إظهار الرسالة
function showToast(message, isError = false) {
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;

    if (isError) {
        toast.style.color = '#ff6b6b';
        toast.style.borderColor = '#ff6b6b';
    }

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* =========================================================
   عرض رسالة خطأ
   ========================================================= */
function renderError(message) {
    const container = document.getElementById("product-details");
    if (!container) return;
    container.innerHTML = `<div class="empty-state">${message}</div>`;
}

/* =========================================================
   دالة تنسيق السعر
   ========================================================= */
function formatPrice(value) {
    return Number(value).toLocaleString("ar-EG");
}