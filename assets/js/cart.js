/* =========================================================
   منطق السلة الأساسي
   بيستخدم دوال التخزين اللي في storage.js
   ========================================================= */

// بنقرأ السلة من المتصفح أول ما الصفحة تفتح
let cart = loadCartFromStorage();

/* =========================================================
   إضافة منتج للسلة
   ========================================================= */
function addToCart(product, size, color, quantity, type) {
    // بنشوف هل المنتج موجود بالفعل بنفس المقاس واللون؟
    const existingIndex = cart.findIndex(
        (item) =>
            item.productId === product.id &&
            item.size === size &&
            item.color === color &&
            item.type === type
    );

    // بنحدد السعر بناءً على نوع الطلب
    const price = type === "wholesale" ? product.wholesale_price : product.retail_price;

    if (existingIndex !== -1) {
        // لو موجود، بنزود الكمية بس
        cart[existingIndex].quantity += quantity;
    } else {
        // لو مش موجود، بنضيفه كعنصر جديد
        cart.push({
            productId: product.id,
            name: product.name,
            image: product.image_url,
            size: size,
            color: color,
            quantity: quantity,
            price: price,
            type: type,
        });
    }

    // بنحفظ التعديلات في المتصفح
    saveCartToStorage(cart);

    // بنحدث عداد السلة اللي في الهيدر
    updateCartCount();
}

/* =========================================================
   تحديث عدد المنتجات في أيقونة السلة بالهيدر
   ========================================================= */
function updateCartCount() {
    const countEl = document.querySelector("[data-cart-count]");
    if (!countEl) return;

    // بنجمع كل الكميات
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        countEl.textContent = totalItems;
        countEl.classList.remove("hidden");
    } else {
        countEl.textContent = "0";
        countEl.classList.add("hidden");
    }
}

/* =========================================================
   حساب إجمالي السلة
   ========================================================= */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}