/* =========================================================
   سكريبت صفحة إتمام الطلب
   بيعرض ملخص السلة، ويتحقق من بيانات العميل
   وبيرسل الطلب عبر Edge Function (عشان الأمان)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    mountHeader("#header-container", "checkout");
    mountFooter("#footer-container");

    // 1) لو السلة فاضية، نرجعه للمنتجات
    if (cart.length === 0) {
        alert("سلة الطلبات فاضية. هترجع لصفحة المنتجات.");
        window.location.href = "/retail.html";
        return;
    }

    // 2) بنملأ قائمة المحافظات
    populateGovernorates();

    // 3) بنعرض ملخص الطلب
    renderCheckoutSummary();

    // 4) بنفعل زرار التأكيد
    setupFormSubmission();
});

/* =========================================================
   ملء قائمة المحافظات
   ========================================================= */
function populateGovernorates() {
    const select = document.getElementById("customer-governorate");
    if (!select) return;

    EGYPT_GOVERNORATES.forEach((gov) => {
        const option = document.createElement("option");
        option.value = gov;
        option.textContent = gov;
        select.appendChild(option);
    });
}

/* =========================================================
   عرض ملخص الطلب
   ========================================================= */
function renderCheckoutSummary() {
    const itemsContainer = document.getElementById("checkout-items");
    const totalContainer = document.getElementById("checkout-total");

    if (!itemsContainer || !totalContainer) return;

    itemsContainer.innerHTML = cart.map((item) => `
    <div class="summary-item">
      <span>${item.name} (${item.size} - ${item.color})</span>
      <span class="item-qty">${item.quantity} × ${formatPrice(item.price)} ${CURRENCY}</span>
    </div>
  `).join("");

    const total = getCartTotal();
    totalContainer.textContent = `${formatPrice(total)} ${CURRENCY}`;
}

/* =========================================================
   التحقق من الحقول وإرسال الطلب (عبر Edge Function)
   ========================================================= */
function setupFormSubmission() {
    const submitBtn = document.getElementById("submit-order-btn");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // 1) بنجمع البيانات
        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const governorate = document.getElementById("customer-governorate").value;
        const address = document.getElementById("customer-address").value.trim();
        const notes = document.getElementById("customer-notes").value.trim();

        // 2) بنعمل التحقق
        if (!validateForm(name, phone, governorate)) {
            return;
        }

        // 3) بنغير شكل الزرار
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "جاري إرسال الطلب...";
        submitBtn.disabled = true;

        try {
            // 4) بنجهز البيانات للـ Edge Function
            const orderData = {
                name: name,
                phone: phone.replace(/[\s-]/g, ""), // تنظيف الرقم من أي مسافات
                governorate: governorate,
                address: address || null,
                notes: notes || null,
                orderType: cart[0].type, // نوع الطلب (كل السلة نفس النوع)
                items: cart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // 5) بنبعت الطلب للـ Edge Function (place-order)
            const { data, error } = await supabaseClient.functions.invoke('place-order', {
                body: orderData,
            });

            // لو حصل خطأ في الاستدعاء نفسه
            if (error) throw error;

            // لو الـ Function رجعت رسالة فشل
            if (!data.success) {
                throw new Error(data.error || "فشل في إرسال الطلب");
            }

            // 6) نجاح العملية
            showToast(`تم استلام طلبك بنجاح! رقم الطلب: ${data.order_number}`);

            // بننتظر ثانيتين عشان المستخدم يشوف رقم الطلب
            setTimeout(() => {
                clearCartStorage();
                window.location.href = "/index.html";
            }, 2000);

        } catch (error) {
            console.error("خطأ في إرسال الطلب:", error);
            showToast(error.message || "تعذر إرسال الطلب، يرجى المحاولة.", true);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* =========================================================
   التحقق من صحة البيانات
   ========================================================= */
function validateForm(name, phone, governorate) {
    let isValid = true;

    // الاسم
    const nameGroup = document.getElementById("customer-name").closest(".form-group");
    if (name.length < 3) {
        nameGroup.classList.add("has-error");
        isValid = false;
    } else {
        nameGroup.classList.remove("has-error");
    }

    // الهاتف المصري
    const phoneRegex = /^01[0125][0-9]{8}$/;
    const phoneGroup = document.getElementById("customer-phone").closest(".form-group");
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (!phoneRegex.test(cleanPhone)) {
        phoneGroup.classList.add("has-error");
        isValid = false;
    } else {
        phoneGroup.classList.remove("has-error");
    }

    // المحافظة
    const govGroup = document.getElementById("customer-governorate").closest(".form-group");
    if (!governorate) {
        govGroup.classList.add("has-error");
        isValid = false;
    } else {
        govGroup.classList.remove("has-error");
    }

    return isValid;
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