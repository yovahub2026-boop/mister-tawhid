/* =========================================================
   سكريبت الصفحات الثابتة
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const pageType = document.body.dataset.page || "";
    mountHeader("#header-container", pageType);
    mountFooter("#footer-container");

    // لو إحنا في صفحة تواصل معنا، بنجيب بيانات التواصل من الداتابيز
    if (pageType === "contact") {
        await loadContactInfo();
    }
});

async function loadContactInfo() {
    try {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;

        if (data) {
            // تحديث رقم الهاتف
            const phoneEl = document.getElementById("contact-phone-display");
            if (phoneEl && data.contact_phone) {
                phoneEl.textContent = data.contact_phone;
            }

            // تحديث البريد الإلكتروني
            const emailEl = document.getElementById("contact-email-display");
            if (emailEl && data.contact_email) {
                emailEl.textContent = data.contact_email;
            }
        }
    } catch (err) {
        console.error("خطأ في تحميل بيانات التواصل:", err);
    }
}