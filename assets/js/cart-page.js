/* =========================================================
   سكريبت صفحة السلة
   بيعرض المنتجات اللي في السلة، ويسمح بالتعديل والحذف
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    mountHeader("#header-container", "cart");
    mountFooter("#footer-container");

    // بنحدث العداد في الهيدر
    updateCartCount();

    // بنرسم السلة
    renderCartPage();

    // بنفعل زراير نافذة الحذف
    setupDeleteModal();
});

/* =========================================================
   رسم صفحة السلة
   ========================================================= */
function renderCartPage() {
    const itemsContainer = document.getElementById("cart-items");
    const summaryContainer = document.getElementById("cart-summary");

    if (!itemsContainer || !summaryContainer) return;

    // لو السلة فاضية
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
      <div class="empty-cart">
        <h2>سلة الطلبات فاضية</h2>
        <p>لسه مضفتش أي منتجات.</p>
        <a href="/retail.html" class="btn btn-primary">تصفح المنتجات</a>
      </div>
    `;
        summaryContainer.innerHTML = "";
        return;
    }

    // عرض المنتجات
    itemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">المقاس: ${item.size} | اللون: ${item.color}</div>
        <div class="item-price">${formatPrice(item.price)} ${CURRENCY}</div>
        
        <div class="item-controls">
          <div class="quantity-input">
            <button onclick="changeQuantity(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          
          <!-- زرار الحذف الشيك -->
          <button class="delete-btn" onclick="removeItem(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            حذف
          </button>
        </div>
      </div>
    </div>
  `).join("");

    // عرض الملخص
    const total = getCartTotal();
    summaryContainer.innerHTML = `
    <h2>ملخص الطلب</h2>
    <div class="summary-row">
      <span>عدد المنتجات:</span>
      <span>${cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
    </div>
    <div class="summary-row total">
      <span>الإجمالي:</span>
      <span>${formatPrice(total)} ${CURRENCY}</span>
    </div>
    <a href="/checkout.html" class="btn btn-primary" style="width: 100%; margin-top: var(--space-4);">
      إتمام الطلب
    </a>
    <a href="/retail.html" class="btn btn-outline" style="width: 100%; margin-top: var(--space-2);">
      متابعة التسوق
    </a>
  `;
}

/* =========================================================
   تغيير الكمية (مع التحقق من الحد الأدنى للجملة)
   ========================================================= */
function changeQuantity(index, delta) {
    const item = cart[index];

    // بندور على المنتج الأصلي عشان نعرف الحد الأدنى بتاعه
    const product = PLACEHOLDER_PRODUCTS.find(p => p.id === item.productId);

    // لو بيقلل الكمية، والمنتج جملة، وفيه حد أدنى
    if (delta < 0 && item.type === "wholesale" && product && product.minimum_wholesale_quantity) {
        if (item.quantity + delta < product.minimum_wholesale_quantity) {
            showToast(`الحد الأدنى للطلب من هذا المنتج هو ${product.minimum_wholesale_quantity} قطعة.`, true);
            return;
        }
    }

    // عشان مينفعش الكمية تقل عن 1
    if (item.quantity + delta < 1) return;

    item.quantity += delta;
    saveCartToStorage(cart);
    renderCartPage();
    updateCartCount();
}

/* =========================================================
   نافذة تأكيد الحذف
   ========================================================= */
let itemToDeleteIndex = null;

function removeItem(index) {
    itemToDeleteIndex = index;
    const modal = document.getElementById("delete-modal");
    if (modal) {
        modal.style.display = "flex";
    }
}

function setupDeleteModal() {
    const modal = document.getElementById("delete-modal");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    if (!modal || !cancelBtn || !confirmBtn) return;

    // زرار الإلغاء
    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
        itemToDeleteIndex = null;
    });

    // زرار التأكيد
    confirmBtn.addEventListener("click", () => {
        if (itemToDeleteIndex !== null) {
            cart.splice(itemToDeleteIndex, 1);
            saveCartToStorage(cart);
            renderCartPage();
            updateCartCount();
        }
        modal.style.display = "none";
        itemToDeleteIndex = null;
    });
}

/* =========================================================
   دالة تنسيق السعر
   ========================================================= */
function formatPrice(value) {
    return Number(value).toLocaleString("ar-EG");
}

/* =========================================================
   دالة إظهار رسالة التنبيه (Toast)
   ========================================================= */
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