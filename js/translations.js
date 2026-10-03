/* All site copy lives here (Arabic is the default). Strings marked TBD are placeholders the owner replaces. */
window.SITE = {
  // One number used everywhere. International format, digits only (e.g. "201001234567"). TBD: owner to supply.
  PHONE: "201004994150",
  INSTAGRAM: "https://www.instagram.com/emy_creative77/",   // TBD: full link, e.g. https://instagram.com/yourhandle
  CURRENCY: { en: "EGP", ar: "ج.م" },
};
window.T = {
  ar: {
    dir: "rtl", code: "ar",
    meta: { title: "Emy Creative — شموع يدوية من القاهرة", desc: "شموع يدوية بتتصب وتتزين باليد في القاهرة. كل شمعة ليها قصتها وصورتها. اطلب على واتساب." },
    nav: { collection: "المجموعة", custom: "شموع بالاسم", story: "حكايتنا", order: "إزاي تطلب" },
    lang: "English", orderWa: "اطلب على واتساب", cart: "سلة الطلب", skip: "تخطّي",
    hero: { eyebrow: "ARTISANAL CANDLES", title: "فن في كل شمعة", sub: "شموع يدوية من القاهرة. كل واحدة مصنوعة بإيد وليها شخصيتها.", cta: "شوف المجموعة", wa: "كلمنا على واتساب" },
    marquee: ["صناعة يدوية", "اتصبّت في القاهرة", "قطعة واحدة فقط", "Art in every candle"],
    coll: { title: "المجموعة", sub: "كل شمعة ليها كارت وقصة وصورة.", all: "الكل", floral: "زهور", cozy: "دافي وقهوة", bubble: "فقاعات وأشكال", figures: "شخصيات", limited: "محدودة", custom: "بالاسم", count: "شمعة", empty: "مفيش شموع في القسم ده." },
    card: { add: "أضف للطلب", reserve: "احجز القطعة دي", requestPrice: "السعر عند الطلب", photoSoon: "الصورة قريب", badgeOne: "قطعة واحدة", badgeMade: "حسب الطلب", view: "التفاصيل", added: "اتضافت" },
    detail: { back: "رجوع للمجموعة", scent: "الريحة", weight: "الوزن", burn: "مدة الاشتعال", story: "القصة", like: "ممكن يعجبك كمان", gallery: "صور", tbd: "TBD" },
    custom: { eyebrow: "CUSTOM NAME CANDLES", title: "اسمك مكتوب بالشمع", text: "بنعمل شموع حروف حرف حرف عشان تكتب أي اسم. كل حرف ليه ألوانه ورخامه وريحته. مجموعة EMAN في الصورة مثال على اللي نقدر نعمله ليك.",
      s1t: "ابعت الاسم", s1d: "اكتب الاسم اللي عايزه.", s2t: "اختار الألوان والريحة", s2d: "لكل حرف لونه وريحته.", s3t: "وإحنا نصنعها بإيدينا", s3d: "نصنعها حرف حرف وبعدين نتفق على التسليم.",
      cta: "ابعت طلب شمعة بالاسم", formTitle: "طلب شمعة بالاسم", name: "الاسم المطلوب", colors: "الألوان لكل حرف", scent: "الريحة لكل حرف", notes: "ملاحظات", send: "ابعت على واتساب", close: "إغلاق", ph: { name: "مثلاً: EMAN", colors: "مثلاً: E وردي، M أصفر…", scent: "مثلاً: E فانيليا…", notes: "أي تفاصيل تانية" } },
    story: { eyebrow: "OUR STORY", title: "حكايتنا", text: "Emy Creative وراها «إيمي»، أم مصرية بتصنع كل الشموع دي بنفسها وبشغف. كل قطعة هاند ميد من أولها لآخرها، من التصميم لحد التشطيب، وكل حاجة بتتعمل باليد. عشان كده كل شمعة ليها شخصيتها.", photo: "مكان صورة حكايتنا", gallery: "من المجموعة" },
    how: { eyebrow: "HOW TO ORDER", title: "إزاي تطلب", s1t: "اختار", s1d: "ضيف الشموع اللي عجبتك لسلة الطلب.", s2t: "ابعت الطلب على واتساب", s2d: "بنفتحلك رسالة جاهزة بالطلب وبياناتك.", s3t: "التوصيل", s3d: "TBD: مناطق التوصيل والمصاريف والمواعيد لسه هتتأكد.",
      tbdTitle: "قريباً", tbd: "TBD: طرق الدفع وسياسة الاسترجاع هتتأكد قبل الإطلاق." },
    foot: { tag: "Art in every candle", rights: "جميع الحقوق محفوظة", ig: "إنستجرام", wa: "واتساب", tbd: "TBD" },
    cartUi: { title: "سلة الطلب", empty: "السلة فاضية.", total: "الإجمالي", item: "قطعة", remove: "حذف", checkout: "كمّل الطلب", close: "إغلاق", priceOnReq: "السعر عند الطلب", totalNote: "الأسعار اللي مش مكتوبة بتتأكد على واتساب.",
      formTitle: "بيانات التوصيل", name: "الاسم", phone: "رقم الموبايل", city: "المدينة", address: "العنوان", notes: "ملاحظات", send: "ابعت الطلب على واتساب", back: "رجوع للسلة", required: "من فضلك املا الحقول المطلوبة.", noPhone: "رقم واتساب البراند لسه TBD، هنفتح واتساب لتختار الشخص بنفسك." },
    msg: { hello: "أهلاً Emy Creative، حابب أطلب:", total: "الإجمالي", name: "الاسم", phone: "الموبايل", city: "المدينة", address: "العنوان", notes: "ملاحظات", poq: "السعر عند الطلب", custom: "طلب شمعة بالاسم", cname: "الاسم", ccolors: "الألوان لكل حرف", cscent: "الريحة لكل حرف", qty: "×" },
    a11y: { openCart: "افتح سلة الطلب", menu: "القائمة", toWa: "اطلب على واتساب", langSwitch: "Switch to English" },
  },
  en: {
    dir: "ltr", code: "en",
    meta: { title: "Emy Creative — Handmade candles from Cairo", desc: "Handmade candles poured and finished by hand in Cairo. Every candle has its own story and photo. Order on WhatsApp." },
    nav: { collection: "Collection", custom: "Custom Names", story: "Our Story", order: "How to Order" },
    lang: "العربية", orderWa: "Order on WhatsApp", cart: "Your order", skip: "Skip",
    hero: { eyebrow: "ARTISANAL CANDLES", title: "Art in every candle", sub: "Handmade candles from Cairo. Each one made by hand, each one a little different.", cta: "Shop the collection", wa: "Talk to us on WhatsApp" },
    marquee: ["Handmade", "Poured in Cairo", "One of a kind", "Art in every candle"],
    coll: { title: "The Collection", sub: "Every candle has its own card, story and photo.", all: "All", floral: "Floral", cozy: "Cozy & Coffee", bubble: "Bubble & Geometric", figures: "Figures", limited: "Limited", custom: "Custom", count: "candles", empty: "No candles in this group." },
    card: { add: "Add to order", reserve: "Reserve this piece", requestPrice: "Price on request", photoSoon: "Photo coming soon", badgeOne: "One of a kind", badgeMade: "Made to order", view: "Details", added: "Added" },
    detail: { back: "Back to the collection", scent: "Scent", weight: "Weight", burn: "Burn time", story: "The story", like: "You may also like", gallery: "Gallery", tbd: "TBD" },
    custom: { eyebrow: "CUSTOM NAME CANDLES", title: "Your name, in wax", text: "Letter candles made one by one to spell any name. Each letter gets its own colors, marbling and scent. The E-M-A-N set shown is a sample of what we can make for you.",
      s1t: "Send the name", s1d: "Tell us the name you want.", s2t: "Pick colors and scents", s2d: "Every letter gets its own.", s3t: "We handcraft it", s3d: "Made letter by letter, then we agree on delivery.",
      cta: "Request a name candle", formTitle: "Custom name candle", name: "The name", colors: "Colors per letter", scent: "Scent per letter", notes: "Notes", send: "Send on WhatsApp", close: "Close", ph: { name: "e.g. EMAN", colors: "e.g. E pink, M yellow…", scent: "e.g. E vanilla…", notes: "Anything else" } },
    story: { eyebrow: "OUR STORY", title: "Our story", text: "Behind Emy Creative is Emy, an Egyptian mother who makes every one of these candles herself, with passion. Each piece is handmade from start to finish, from the design to the final touch, and everything is done by hand. That is why every candle has its own character.", photo: "Our story photo goes here", gallery: "From the collection" },
    how: { eyebrow: "HOW TO ORDER", title: "How to order", s1t: "Choose", s1d: "Add the candles you like to your order.", s2t: "Send it on WhatsApp", s2d: "We open a ready message with your order and details.", s3t: "Delivery", s3d: "TBD: delivery areas, fees and timing are to be confirmed.",
      tbdTitle: "Coming soon", tbd: "TBD: payment methods and returns policy will be confirmed before launch." },
    foot: { tag: "Art in every candle", rights: "All rights reserved", ig: "Instagram", wa: "WhatsApp", tbd: "TBD" },
    cartUi: { title: "Your order", empty: "Your order is empty.", total: "Total", item: "item", remove: "Remove", checkout: "Continue", close: "Close", priceOnReq: "Price on request", totalNote: "Items without a price are confirmed on WhatsApp.",
      formTitle: "Delivery details", name: "Name", phone: "Phone", city: "City", address: "Delivery address", notes: "Notes", send: "Send order on WhatsApp", back: "Back to order", required: "Please fill in the required fields.", noPhone: "The brand's WhatsApp number is still TBD, so WhatsApp will open and you choose the contact." },
    msg: { hello: "Hello Emy Creative, I would like to order:", total: "Total", name: "Name", phone: "Phone", city: "City", address: "Address", notes: "Notes", poq: "Price on request", custom: "Custom name candle request", cname: "Name", ccolors: "Colors per letter", cscent: "Scent per letter", qty: "x" },
    a11y: { openCart: "Open your order", menu: "Menu", toWa: "Order on WhatsApp", langSwitch: "التبديل للعربية" },
  },
};

/* ---- Payment, contact links and the Emy assistant (added) ---- */
Object.assign(window.SITE, {
  FACEBOOK: "https://www.facebook.com/profile.php?id=100087942061833",          // TBD: full link to the Facebook page, e.g. https://facebook.com/yourpage
  INSTAPAY: "",          // TBD: InstaPay address / IPA, e.g. name@instapay
  VODAFONE_CASH: "",     // TBD: Vodafone Cash number, e.g. 010xxxxxxxx
});
Object.assign(window.T.ar, {
  pay: { eyebrow: "PAYMENT", title: "الدفع", sub: "الدفع بعد تأكيد الطلب على واتساب، بإحدى الطريقتين:", instaD: "حوّل على العنوان ده وابعت لقطة شاشة التحويل على واتساب.", voda: "فودافون كاش", vodaD: "حوّل على الرقم ده وابعت لقطة شاشة التحويل على واتساب.", note: "الطلب بيتأكد بعد وصول التحويل." },
  contact: { eyebrow: "CONTACT", title: "تواصل معانا" },
  ai: { title: "اسأل Emy", sub: "مساعد Emy Creative", ph: "اكتب سؤالك…", hello: "أهلاً! أنا مساعد Emy Creative. اسألني عن الشموع، الطلب، الدفع، أو شموع الاسم.", chips: ["إزاي أطلب؟", "طرق الدفع", "شموع بالاسم", "التوصيل"], fb: "مش لاقي إجابة مؤكدة على السؤال ده. تقدر تسأل صاحبة البراند مباشرة على واتساب.", ask: "اسأل على واتساب", send: "إرسال" },
  foot2: {}, 
});
Object.assign(window.T.ar.foot, { fb: "فيسبوك" });
Object.assign(window.T.ar.cartUi, { pay: "طريقة الدفع", payInsta: "إنستا باي", payVoda: "فودافون كاش", payWa: "أتفق على الدفع على واتساب" });
Object.assign(window.T.ar.msg, { pay: "طريقة الدفع" });
Object.assign(window.T.en, {
  pay: { eyebrow: "PAYMENT", title: "Payment", sub: "Pay after your order is confirmed on WhatsApp, with either:", instaD: "Transfer to this address and send the transfer screenshot on WhatsApp.", voda: "Vodafone Cash", vodaD: "Transfer to this number and send the transfer screenshot on WhatsApp.", note: "Your order is confirmed once the transfer arrives." },
  contact: { eyebrow: "CONTACT", title: "Get in touch" },
  ai: { title: "Ask Emy", sub: "Emy Creative assistant", ph: "Type your question…", hello: "Hi! I'm the Emy Creative assistant. Ask me about candles, ordering, payment or custom names.", chips: ["How do I order?", "Payment methods", "Custom names", "Delivery"], fb: "I don't have a confirmed answer for that. You can ask the owner directly on WhatsApp.", ask: "Ask on WhatsApp", send: "Send" },
});
Object.assign(window.T.en.foot, { fb: "Facebook" });
Object.assign(window.T.en.cartUi, { pay: "Payment method", payInsta: "InstaPay", payVoda: "Vodafone Cash", payWa: "Agree on payment on WhatsApp" });
Object.assign(window.T.en.msg, { pay: "Payment" });
