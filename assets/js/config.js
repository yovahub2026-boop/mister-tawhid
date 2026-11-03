/* =========================================================
   ملف الإعدادات العامة
   بيحتوي على الثوابت اللي بتتكرر في كل الموقع
   ========================================================= */

// اسم المتجر الرسمي
const STORE_NAME = "MISTER TAWHID";

// العملة المستخدمة في الموقع
const CURRENCY = "ج.م";

// المسار الأساسي لملفات الجافاسكريبت (يستخدم للمسارات النسبية)
const BASE_PATH = "/";

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
    CART: "mt_cart_v1",
};

// قائمة المحافظات المصرية
const EGYPT_GOVERNORATES = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية",
    "المنوفية", "القليوبية", "البحيرة", "الغربية", "بورسعيد",
    "دمياط", "الإسماعيلية", "السويس", "كفر الشيخ", "الفيوم",
    "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا",
    "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد",
    "مطروح", "شمال سيناء", "جنوب سيناء"
];

// =========================================================
// إعدادات Supabase (المفاتيح اللي جبتها من لوحة التحكم)
// =========================================================
const SUPABASE_URL = "https://sujjbvzamcxezdvkzkub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ampidnphbWN4ZXpkdmt6a3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MTAwMTksImV4cCI6MjEwOTI4NjAxOX0.nRAq0GkLq-eO2lqYNmJ7DzDO0oCYHnRvKLZQtASc12s";