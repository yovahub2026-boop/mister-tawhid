/* =========================================================
   بيانات تجريبية (Placeholder)
   ⚠️ ملاحظة مهمة: البيانات دي مؤقتة للعرض فقط
   ⚠️ هتتشال بالكامل في المرحلة 7 لما نربط بـ Supabase
   ⚠️ مش بيانات حقيقية — أسماء ونصوص عامة للتوضيح
   ========================================================= */

// الأقسام (Placeholder)
const PLACEHOLDER_CATEGORIES = [
    { id: "cat-1", name: "ملابس حريمي", slug: "women", display_order: 1 },
    { id: "cat-2", name: "ملابس رجالي", slug: "men", display_order: 2 },
    { id: "cat-3", name: "ملابس أطفال", slug: "kids", display_order: 3 },
    { id: "cat-4", name: "ملابس منزلية", slug: "homewear", display_order: 4 },
];

// المنتجات (Placeholder)
const PLACEHOLDER_PRODUCTS = [
    {
        id: "prod-1",
        name: "قميص قطني كلاسيك",
        description: "قميص قطني بقصة كلاسيكية، مناسب للاستخدام اليومي.",
        category_id: "cat-1",
        wholesale_price: 150,
        retail_price: 220,
        visibility: "both",
        availability_status: "available",
        is_featured: true,
        minimum_wholesale_quantity: 12,
        sizes: ["S", "M", "L", "XL"],
        colors: ["أسود", "أبيض", "رمادي"],
        image_url: "https://placehold.co/600x800/F7F7F5/0D0D0D?text=Product+1",
    },
    {
        id: "prod-2",
        name: "بنطلون جينز مستقيم",
        description: "بنطلون جينز بقصة مستقيمة وخامة متينة.",
        category_id: "cat-2",
        wholesale_price: 220,
        retail_price: 320,
        visibility: "both",
        availability_status: "available",
        is_featured: true,
        minimum_wholesale_quantity: 12,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["أزرق", "أسود"],
        image_url: "https://placehold.co/600x800/F7F7F5/0D0D0D?text=Product+2",
    },
    {
        id: "prod-3",
        name: "تيشيرت أطفال مطبوع",
        description: "تيشيرت قطني للأطفال بطبعة خفيفة.",
        category_id: "cat-3",
        wholesale_price: 60,
        retail_price: 100,
        visibility: "both",
        availability_status: "unavailable",
        is_featured: false,
        minimum_wholesale_quantity: 24,
        sizes: ["2Y", "4Y", "6Y", "8Y"],
        colors: ["أبيض", "أحمر"],
        image_url: "https://placehold.co/600x800/F7F7F5/0D0D0D?text=Product+3",
    },
    {
        id: "prod-4",
        name: "روب منزلي قطن",
        description: "روب منزلي مريح من القطن الخالص.",
        category_id: "cat-4",
        wholesale_price: 180,
        retail_price: 260,
        visibility: "both",
        availability_status: "available",
        is_featured: true,
        minimum_wholesale_quantity: 12,
        sizes: ["S", "M", "L"],
        colors: ["بيج", "رمادي"],
        image_url: "https://placehold.co/600x800/F7F7F5/0D0D0D?text=Product+4",
    },
];