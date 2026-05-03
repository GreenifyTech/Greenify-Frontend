import React, { createContext, useState, useContext, useEffect } from 'react';

const LangContext = createContext();

const translations = {
 en: {
 // Nav
 'shop': 'Shop',
 'bouquets': 'Bouquets',
 'ai_doctor': 'AI Doctor',
 'care_tips': 'Care Tips',
 'medicines': 'Medicines',
 'my_orders': 'My Orders',
 'login': 'Login',
 'signup': 'Sign Up',
 'admin': 'Admin',
 'profile': 'Profile',
 'logout': 'Logout',
 'cart': 'Cart',
 'light': 'Light',
 'dark': 'Dark',
 
 // Home
 'promo_banner': 'Delivering botanical excellence across all Egypt governorates',
 'new_season_collection': 'New Season Collection',
 'hero_title': "Nature's Finest, Delivered to Your Door",
 'hero_subtitle': 'Premium plants & greenery, delivered across Egypt.',
 'shop_now': 'Shop Now',
 'top_picks': 'Our Top Picks',
 'curated_selections': 'Curated selections for your space.',
 'view_all': 'View All',
 'quality_trust': 'Quality You Can Trust.',
 'ethically_sourced': 'Ethically Sourced',
 'ethically_sourced_desc': 'Direct from sustainable nurseries across Egypt.',
 'health_guaranteed': 'Health Guaranteed',
 'health_guaranteed_desc': 'Verified by our AI Doctor and senior botanists.',
 'fresh_delivery': 'Fresh Delivery',
 'fresh_delivery_desc': 'Eco-packaging designed for maximum plant safety.',
 'bouquet_builder_title': 'Bouquet Builder',
 'bouquet_builder_desc': 'Design your own botanical masterpiece.',
 'start_designing': 'Start Designing',
 'ai_doctor_desc': 'Diagnosis and treatment plans in seconds.',
 'consult_now': 'Consult Now',
 'stats_plants': '500+ Plants',
 'stats_users': '10k+ Users',
 'stats_quality': '100% Quality',
 'stats_rating': '4.9 Rating',
 
 // Plant Tips
 'plant_care_secrets': 'Plant Care Secrets',
 'expert_advice': 'Expert advice to help your botanical companions thrive in any environment.',
 'light_requirements': 'Light Requirements',
 'light_desc': 'Most indoor plants love bright, indirect light. Avoid direct midday sun which can scorch leaves.',
 'watering_wisdom': 'Watering Wisdom',
 'watering_desc': 'Wait until the top inch of soil is dry before watering. Overwatering is the #1 cause of plant death.',
 'air_humidity': 'Air Humidity',
 'air_humidity_desc': 'Tropical plants love moisture. Mist them occasionally or use a pebble tray to increase humidity.',
 'temp_control': 'Temperature Control',
 'temp_control_desc': 'Keep your plants away from cold drafts or heater vents. Most thrive between 18°C and 24°C.',
 'critical_warning': 'Critical Warning',
 'yellow_leaf_mystery': 'The "Yellow Leaf" Mystery',
 'yellow_leaf_desc': "Yellow leaves can mean many things. If they're soft and mushy, you're likely overwatering. If they're dry and crispy, your plant is thirsty or the air is too dry. Always check the soil before adding more water!",
 'explore_collection': 'Explore Our Collection',

 // Plant Medicines
 'medicine_cabinet': 'Medicine Cabinet',
 'medicine_desc': 'Everything you need to treat, protect, and nourish your green collection using professional-grade botanical solutions.',
 'natural_pesticides': 'Natural Pesticides',
 'natural_pesticides_desc': 'Safe, organic solutions to keep unwanted pests away from your foliage.',
 'growth_boosters': 'Growth Boosters',
 'growth_boosters_desc': 'Nutrient-rich supplements to accelerate growth and strengthen roots.',
 'antifungals': 'Antifungals',
 'antifungals_desc': 'Treat and prevent root rot, mildew, and other common fungal diseases.',
 'when_to_use_medicine': 'When to use medicine?',
 'when_to_use_medicine_desc': "Only apply treatments when you're certain of the diagnosis. Many issues can be solved by simply adjusting light or water. Use our AI Doctor first for an accurate diagnosis before starting any chemical regimen.",
 'consult_ai_doctor': 'Consult AI Doctor',
 'professional_consultation': 'Professional Consultation',
 'professional_consultation_desc': 'Are you managing a large collection or a greenhouse? Our senior botanists are available for private consultations and custom treatment plans.',

 // Products
 'filter_title': 'Find a plant...',
 'sort_by': 'Sort by',
 'price_low': 'Price: Low to High',
 'price_high': 'Price: High to Low',
 'newest': 'Newest',
 
 // Cart
 'clear_cart': 'Clear Cart',
 'empty_cart': 'Your cart is empty',

 // Footer
 'footer_tagline': 'Elevating indoor spaces through premium botanical specimens and intelligent AI-driven care solutions. Delivering nature to your doorstep across Egypt.',
 'full_collection': 'Full Collection',
 'indoor_species': 'Indoor Species',
 'outdoor_species': 'Outdoor Species',
 'bouquet_designer': 'Bouquet Designer',
 'ecosystem': 'Ecosystem',
 'support_hub': 'Support Hub',
 'academic_context': 'Academic Context',
 'all_rights_reserved': 'All rights reserved',
 'terms': 'Terms',
 'privacy': 'Privacy',
 'security': 'Security',

 // AI Doctor
 'ai_doctor_hero_subtitle': "Describe your plant's condition to receive an instant diagnosis and care protocol.",
 'describe_symptoms': "Describe Symptoms",
 'quick_suggestions': "Quick Suggestions",
 'get_diagnosis': "Get Diagnosis",
 'analyzing': "Analyzing...",
 'symptom_placeholder': "Example: My snake plant has mushy, yellowing leaves at the base...",
 'suggestion_1': "My Monstera has yellow leaves with brown spots.",
 'suggestion_2': "White fuzzy spots on the stems of my succulent.",
 'suggestion_3': "The leaves are dropping even though the soil is wet.",
 'suggestion_4': "Tiny black bugs flying around the base of the plant.",
 'suggestion_5': "The edges of my spider plant leaves are turning dry and brown.",
 'diagnostic_report': "Diagnostic Report",
 'confidence': "confidence",
 'condition': "Condition",
 'likely_cause': "Likely Cause",
 'treatment': "Treatment",
 'bio_verified': "Bio-Verified Datasets",
 
 // Product Card
 'add': 'Add',
 'adding': 'Adding...',
 'in_stock': '{{count}} In Stock',
 'low_stock': 'Only {{count}} Left!',
 'out_of_stock': 'Out of Stock',
 'FLOWERS': 'FLOWERS',
 'INDOOR': 'INDOOR',
 'OUTDOOR': 'OUTDOOR',

 // Product Details
 'viewing_now': '{{count}} people are viewing this right now.',
 'availability': 'Availability',
 'selection_quantity': 'Selection Quantity',
 'back_to_collection': 'Back to Collection',
 'add_to_botanical_cart': 'Add to Botanical Cart',
 'eco_shipping': 'Eco-Friendly Shipping',
 'eco_shipping_desc': 'Sustainable packaging delivered in 48h.',
 'botanical_warranty': 'Botanical Warranty',
 'botanical_warranty_desc': '30-day health guarantee for all plants.',
 'reviews': '({{count}}+ Reviews)',
 'oops': 'Oops!',
 'back_to_catalog': 'Back to Catalog',
 'botanical_data_loading': 'Botanical data loading...',
 },
 ar: {
 // Nav
 'shop': 'المتجر',
 'bouquets': 'باقات',
 'ai_doctor': 'طبيب النبات',
 'care_tips': 'نصائح العناية',
 'medicines': 'أدوية النباتات',
 'my_orders': 'طلباتي',
 'login': 'تسجيل الدخول',
 'signup': 'إنشاء حساب',
 'admin': 'لوحة التحكم',
 'profile': 'الملف الشخصي',
 'logout': 'تسجيل الخروج',
 'cart': 'السلة',
 'light': 'فاتح',
 'dark': 'داكن',
 
 // Home
 'promo_banner': 'تقديم التميز النباتي في جميع محافظات مصر',
 'new_season_collection': 'مجموعة الموسم الجديد',
 'hero_title': 'أفضل ما في الطبيعة، حتى باب منزلك',
 'hero_subtitle': 'نباتات متميزة وخضرة، تُسلم في جميع أنحاء مصر.',
 'shop_now': 'تسوق الآن',
 'top_picks': 'اختياراتنا الأفضل',
 'curated_selections': 'اختيارات منسقة لمساحتك.',
 'view_all': 'عرض الكل',
 'quality_trust': 'جودة يمكنك الوثوق بها.',
 'ethically_sourced': 'مصدر أخلاقي',
 'ethically_sourced_desc': 'مباشرة من المشاتل المستدامة في جميع أنحاء مصر.',
 'health_guaranteed': 'صحة مضمونة',
 'health_guaranteed_desc': 'تم التحقق منه بواسطة طبيبنا الآلي وكبار علماء النبات.',
 'fresh_delivery': 'توصيل طازج',
 'fresh_delivery_desc': 'تغليف صديق للبيئة مصمم لأقصى درجات سلامة النبات.',
 'bouquet_builder_title': 'منشئ الباقات',
 'bouquet_builder_desc': 'صمم تحفتك النباتية الخاصة.',
 'start_designing': 'ابدأ التصميم',
 'ai_doctor_desc': 'خطط التشخيص والعلاج في ثوانٍ.',
 'consult_now': 'استشر الآن',
 'stats_plants': '+٥٠٠ نبات',
 'stats_users': '+١٠ آلاف مستخدم',
 'stats_quality': '١٠٠٪ جودة',
 'stats_rating': '٤.٩ تقييم',

 // Plant Tips
 'plant_care_secrets': 'أسرار العناية بالنباتات',
 'expert_advice': 'نصيحة الخبراء لمساعدة رفاقك النباتيين على الازدهار في أي بيئة.',
 'light_requirements': 'متطلبات الإضاءة',
 'light_desc': 'معظم النباتات المنزلية تحب الضوء الساطع وغير المباشر. تجنب شمس الظهيرة المباشرة التي يمكن أن تحرق الأوراق.',
 'watering_wisdom': 'حكمة الري',
 'watering_desc': 'انتظر حتى يجف الجزء العلوي من التربة قبل الري. الإفراط في الري هو السبب الأول لموت النبات.',
 'air_humidity': 'رطوبة الهواء',
 'air_humidity_desc': 'النباتات الاستوائية تحب الرطوبة. رشها أحياناً أو استخدم صينية حصى لزيادة الرطوبة.',
 'temp_control': 'التحكم في درجة الحرارة',
 'temp_control_desc': 'حافظ على نباتاتك بعيداً عن التيارات الباردة أو فتحات السخان. معظمها يزدهر بين ١٨ و ٢٤ درجة مئوية.',
 'critical_warning': 'تحذير حرج',
 'yellow_leaf_mystery': 'لغز "الورقة الصفراء"',
 'yellow_leaf_desc': 'الأوراق الصفراء يمكن أن تعني أشياء كثيرة. إذا كانت طرية، فمن المحتمل أنك تفرط في الري. إذا كانت جافة ومقرمشة، فنباتك عطشان أو الهواء جاف جداً. افحص التربة دائماً قبل إضافة المزيد من الماء!',
 'explore_collection': 'استكشف مجموعتنا',

 // Plant Medicines
 'medicine_cabinet': 'خزانة أدوية النبات',
 'medicine_desc': 'كل ما تحتاجه لعلاج وحماية وتغذية مجموعتك الخضراء باستخدام حلول نباتية احترافية.',
 'natural_pesticides': 'مبيدات حشرية طبيعية',
 'natural_pesticides_desc': 'حلول عضوية آمنة لإبعاد الآفات غير المرغوب فيها عن أوراق الشجر.',
 'growth_boosters': 'معززات النمو',
 'growth_boosters_desc': 'مكملات غنية بالمغذيات لتسريع النمو وتقوية الجذور.',
 'antifungals': 'مضادات الفطريات',
 'antifungals_desc': 'علاج ومنع تعفن الجذور والعفن الفطري والأمراض الفطرية الشائعة الأخرى.',
 'when_to_use_medicine': 'متى تستخدم الدواء؟',
 'when_to_use_medicine_desc': 'استخدم العلاجات فقط عندما تكون متأكداً من التشخيص. يمكن حل العديد من المشكلات ببساطة عن طريق ضبط الإضاءة أو الماء. استخدم طبيبنا الآلي أولاً للحصول على تشخيص دقيق قبل البدء في أي نظام كيميائي.',
 'consult_ai_doctor': 'استشر الطبيب الآلي',
 'professional_consultation': 'استشارة مهنية',
 'professional_consultation_desc': 'هل تدير مجموعة كبيرة أو صوبة زجاجية؟ كبار علماء النبات لدينا متاحون للاستشارات الخاصة وخطط العلاج المخصصة.',
 
 // Products
 'filter_title': 'ابحث عن نبات...',
 'sort_by': 'رتب حسب',
 'price_low': 'السعر: من الأقل للأعلى',
 'price_high': 'السعر: من الأعلى للأقل',
 'newest': 'الأحدث',
 
 // Cart
 'clear_cart': 'مسح السلة',
 'empty_cart': 'سلة التسوق فارغة',

 // Footer
 'footer_tagline': 'الارتقاء بالمساحات الداخلية من خلال عينات نباتية متميزة وحلول رعاية ذكية مدفوعة بالذكاء الاصطناعي. توصيل الطبيعة إلى عتبة داركم في جميع أنحاء مصر.',
 'full_collection': 'المجموعة الكاملة',
 'indoor_species': 'الأنواع الداخلية',
 'outdoor_species': 'الأنواع الخارجية',
 'bouquet_designer': 'مصمم الباقات',
 'ecosystem': 'النظام البيئي',
 'support_hub': 'مركز الدعم',
 'academic_context': 'السياق الأكاديمي',
 'all_rights_reserved': 'جميع الحقوق محفوظة',
 'terms': 'الشروط',
 'privacy': 'الخصوصية',
 'security': 'الأمان',

 // AI Doctor
 'ai_doctor_hero_subtitle': 'صف حالة نباتك للحصول على تشخيص فوري وبروتوكول رعاية.',
 'describe_symptoms': 'وصف الأعراض',
 'quick_suggestions': 'اقتراحات سريعة',
 'get_diagnosis': 'احصل على التشخيص',
 'analyzing': 'جاري التحليل...',
 'symptom_placeholder': 'مثال: نبات الثعبان الخاص بي لديه أوراق طرية ومصفرة عند القاعدة...',
 'suggestion_1': 'المونستيرا الخاصة بي بها أوراق صفراء مع بقع بنية.',
 'suggestion_2': 'بقع بيضاء زغبية على سيقان النبات العصاري الخاص بي.',
 'suggestion_3': 'الأوراق تتساقط على الرغم من أن التربة رطبة.',
 'suggestion_4': 'حشرات سوداء صغيرة تطير حول قاعدة النبات.',
 'suggestion_5': 'حواف أوراق نبات العنكبوت الخاص بي تتحول إلى اللون البني والجاف.',
 'diagnostic_report': 'تقرير التشخيص',
 'confidence': 'ثقة',
 'condition': 'الحالة',
 'likely_cause': 'السبب المرجح',
 'treatment': 'العلاج',
 'bio_verified': 'مجموعات بيانات حيوية معتمدة',

    // Product Card
    'add': 'أضف للسلة',
    'adding': 'جاري الإضافة...',
    'in_stock': 'متوفر {{count}}',
    'low_stock': 'تبقى {{count}} فقط!',
    'out_of_stock': 'نفذت الكمية',
    'FLOWERS': 'زهور',
    'INDOOR': 'نباتات داخلية',
    'OUTDOOR': 'نباتات خارجية',

    // Product Details
    'viewing_now': 'يوجد {{count}} أشخاص يشاهدون هذا المنتج الآن.',
    'availability': 'التوفر',
    'selection_quantity': 'كمية الاختيار',
    'back_to_collection': 'العودة للمجموعة',
    'add_to_botanical_cart': 'أضف لسلة النباتات',
    'eco_shipping': 'شحن صديق للبيئة',
    'eco_shipping_desc': 'تغليف مستدام يصل خلال ٤٨ ساعة.',
    'botanical_warranty': 'ضمان نباتي',
    'botanical_warranty_desc': 'ضمان صحي لمدة ٣٠ يوماً لجميع النباتات.',
    'reviews': '({{count}}+ تقييم)',
    'oops': 'عذراً!',
    'back_to_catalog': 'العودة للمتجر',
    'botanical_data_loading': 'جاري تحميل البيانات النباتية...',
  }
};

export const LangProvider = ({ children }) => {
 const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const t = (key, data = {}) => {
    let text = translations[lang][key] || key;
    if (typeof text === 'string') {
      Object.keys(data).forEach(k => {
        text = text.replace(`{{${k}}}`, data[k]);
      });
    }
    return text;
  };

 const toggleLang = () => {
 const newLang = lang === 'en' ? 'ar' : 'en';
 setLang(newLang);
 localStorage.setItem('lang', newLang);
 };

 useEffect(() => {
 document.dir = lang === 'ar' ? 'rtl' : 'ltr';
 document.documentElement.lang = lang;
 }, [lang]);

 return (
 <LangContext.Provider value={{ lang, t, toggleLang }}>
 {children}
 </LangContext.Provider>
 );
};

export const useLang = () => useContext(LangContext);
