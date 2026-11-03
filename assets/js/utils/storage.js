/* =========================================================
   ملف التعامل مع التخزين المحلي (localStorage)
   بنستخدمه عشان نحفظ السلة في متصفح العميل
   عشان لو عمل تحديث للصفحة، السلة متتمسحش
   ========================================================= */

// دالة لحفظ السلة
function saveCartToStorage(cartItems) {
    try {
        // بنحول السلة لنص JSON عشان نقدر نخزنها
        const cartString = JSON.stringify(cartItems);
        localStorage.setItem(STORAGE_KEYS.CART, cartString);
    } catch (error) {
        console.error("مشكلة في حفظ السلة:", error);
    }
}

// دالة لقراءة السلة
function loadCartFromStorage() {
    try {
        const cartString = localStorage.getItem(STORAGE_KEYS.CART);
        // لو مفيش سلة محفوظة، بنرجع مصفوفة فاضية
        if (!cartString) return [];

        // بنحول النص لمصفوفة تاني
        return JSON.parse(cartString);
    } catch (error) {
        console.error("مشكلة في قراءة السلة:", error);
        return [];
    }
}

// دالة لمسح السلة (بعد إرسال الطلب مثلاً)
function clearCartStorage() {
    localStorage.removeItem(STORAGE_KEYS.CART);
}