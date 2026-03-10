import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface Dictionary {
  [key: string]: string;
}

const translations: Record<Language, Dictionary> = {
  uz: {
    home: 'Asosiy',
    categories: 'Kategoriyalar',
    cart: 'Savatcha',
    admin: 'Admin',
    settings: 'Sozlamalar',
    search_placeholder: 'Mahsulotlarni qidirish...',
    popular_products: 'Mashhur mahsulotlar',
    all_products: 'Barcha mahsulotlar',
    add_to_cart: "Savatchaga qo'shish",
    order_telegram: 'Telegram orqali buyurtma',
    cart_empty: "Savatchangiz bo'sh",
    total: 'Jami',
    checkout: 'Buyurtmani tasdiqlash',
    checkout_telegram: 'Telegram orqali tasdiqlash',
    cash_on_delivery: "To'lov qabul qilingandan keyin yetkaziladi",
    checkout_form_title: "Ma'lumotlaringizni kiriting",
    name: 'Ism',
    phone: 'Telefon raqam',
    address: 'Manzil (Toshkent)',
    confirm_order: 'Tasdiqlash',
    payment_notice: "To'lov buyurtma qabul qilingandan keyin qilinadi",
    my_orders: 'Mening buyurtmalarim',
    order_status: 'Holati',
    wishlist: 'Sevimlilar',
    add_to_wishlist: 'Sevimlilarga qo\'shish',
    remove_from_wishlist: 'Sevimlilardan o\'chirish',
    success_message: "Rahmat! Buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
    back_home: 'Asosiy sahifaga qaytish',
    admin_panel: 'Admin Panel',
    manage_products: 'Mahsulotlarni boshqarish',
    manage_orders: 'Buyurtmalarni boshqarish',
    add_product: "Mahsulot qo'shish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    status: 'Holat',
    pending: 'Kutilmoqda',
    confirmed: 'Tasdiqlandi',
    delivered: 'Yetkazib berildi',
    language_settings: 'Til sozlamalari',
    admin_stats: 'Admin Statistikasi',
    total_orders: 'Jami buyurtmalar',
    total_revenue: 'Jami tushum',
    total_products: 'Jami mahsulotlar',
    price: 'Narx',
    description: 'Tavsif',
    category: 'Kategoriya',
    popular: 'Mashhur',
    image_url: 'Rasm URL',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    uzs: 'UZS',
    products_count: 'mahsulot',
  },
  ru: {
    home: 'Главная',
    categories: 'Категории',
    cart: 'Корзина',
    admin: 'Админ',
    settings: 'Настройки',
    search_placeholder: 'Поиск товаров...',
    popular_products: 'Популярные товары',
    all_products: 'Все товары',
    add_to_cart: 'В корзину',
    order_telegram: 'Заказать через Telegram',
    cart_empty: 'Ваша корзина пуста',
    total: 'Итого',
    checkout: 'Оформить заказ',
    checkout_telegram: 'Подтвердить через Telegram',
    cash_on_delivery: 'Оплата при доставке',
    checkout_form_title: 'Введите ваши данные',
    name: 'Имя',
    phone: 'Номер телефона',
    address: 'Адрес (Ташкент)',
    confirm_order: 'Подтвердить',
    payment_notice: 'Оплата производится после принятия заказа',
    my_orders: 'Мои заказы',
    order_status: 'Статус',
    wishlist: 'Избранное',
    add_to_wishlist: 'Добавить в избранное',
    remove_from_wishlist: 'Удалить из избранного',
    success_message: 'Спасибо! Ваш заказ принят. Мы скоро свяжемся с вами.',
    back_home: 'Вернуться на главную',
    admin_panel: 'Панель администратора',
    manage_products: 'Управление товарами',
    manage_orders: 'Управление заказами',
    add_product: 'Добавить товар',
    edit: 'Редактировать',
    delete: 'Удалить',
    status: 'Статус',
    pending: 'Ожидается',
    confirmed: 'Подтвержден',
    delivered: 'Доставлен',
    language_settings: 'Настройки языка',
    admin_stats: 'Статистика администратора',
    total_orders: 'Всего заказов',
    total_revenue: 'Общая выручка',
    total_products: 'Всего товаров',
    price: 'Цена',
    description: 'Описание',
    category: 'Категория',
    popular: 'Популярный',
    image_url: 'URL картинки',
    save: 'Сохранить',
    cancel: 'Отмена',
    uzs: 'Сум',
    products_count: 'товаров',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  getLocalized: (obj: any, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'ru' || saved === 'uz') ? saved : 'uz';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  const getLocalized = (obj: any, baseKey: string): string => {
    if (!obj) return '';
    const key = `${baseKey}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    return obj[key] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
