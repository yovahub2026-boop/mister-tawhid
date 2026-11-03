/* =========================================================
   خدمة المصادقة (تسجيل الدخول والخروج)
   ========================================================= */

// دالة تسجيل الدخول
async function loginAdmin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) throw error;
    return data;
}

// دالة تسجيل الخروج
async function logoutAdmin() {
    await supabaseClient.auth.signOut();
    window.location.href = "/assets/admin/login.html";
}

// دالة التحقق من وجود جلسة نشطة
async function getCurrentSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}