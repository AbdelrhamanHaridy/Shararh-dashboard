export interface PermissionCatalogItem {
  key: string;
  label: string;
}

export interface PermissionCatalogCategory {
  category: string;
  items: PermissionCatalogItem[];
}

// Built from the permission keys observed in GET admin/employees.
// Update this list if your backend's permission set changes.
export const PERMISSIONS_CATALOG: PermissionCatalogCategory[] = [
  {
    category: 'الجلسة',
    items: [
      { key: 'session.start', label: 'بدء الجلسة' },
      { key: 'session.end', label: 'إنهاء الجلسة' },
    ],
  },
  {
    category: 'لوحة التحكم',
    items: [{ key: 'dashboard.access', label: 'الوصول للوحة التحكم' }],
  },
  {
    category: 'المستخدمين',
    items: [
      { key: 'users.view', label: 'عرض المستخدمين' },
      { key: 'users.create', label: 'إضافة مستخدم' },
      { key: 'users.suspend', label: 'إيقاف مستخدم' },
      { key: 'users.archive', label: 'أرشفة مستخدم' },
    ],
  },
  {
    category: 'التقارير',
    items: [{ key: 'reports.view', label: 'عرض التقارير' }],
  },
  {
    category: 'الاشتراكات',
    items: [
      { key: 'subscriptions.access', label: 'الوصول للاشتراكات' },
      { key: 'subscriptions.activate', label: 'تفعيل اشتراك' },
    ],
  },
  {
    category: 'العملاء المحتملين',
    items: [
      { key: 'leads.access', label: 'الوصول للعملاء المحتملين' },
      { key: 'leads.archive', label: 'أرشفة عميل محتمل' },
      { key: 'leads.communications.view', label: 'عرض المحادثات' },
      { key: 'leads.communications.create', label: 'إضافة محادثة' },
      { key: 'leads.communications.update', label: 'تعديل محادثة' },
      { key: 'leads.communications.delete', label: 'حذف محادثة' },
    ],
  },
  {
    category: 'لوحة التقدم',
    items: [{ key: 'progress_board.access', label: 'الوصول للوحة التقدم' }],
  },
  {
    category: 'سجل المكالمات',
    items: [{ key: 'call_log.access', label: 'الوصول لسجل المكالمات' }],
  },
  {
    category: 'الإصدارات',
    items: [{ key: 'versions.access', label: 'الوصول للإصدارات' }],
  },
  {
    category: 'الإشعارات',
    items: [{ key: 'notifications.access', label: 'الوصول للإشعارات' }],
  },
  {
    category: 'الشكاوى',
    items: [{ key: 'complaints.access', label: 'الوصول للشكاوى' }],
  },
  {
    category: 'الأسئلة الشائعة',
    items: [{ key: 'faq.access', label: 'الوصول للأسئلة الشائعة' }],
  },
  {
    category: 'الجلسات',
    items: [{ key: 'sessions.access', label: 'الوصول للجلسات' }],
  },
  {
    category: 'الأرشيف',
    items: [
      { key: 'archive.access', label: 'الوصول للأرشيف' },
      { key: 'archive.leads', label: 'أرشيف العملاء المحتملين' },
      { key: 'archive.sessions', label: 'أرشيف الجلسات' },
      { key: 'archive.users', label: 'أرشيف المستخدمين' },
    ],
  },
  {
    category: 'المزيد',
    items: [{ key: 'more.access', label: 'الوصول لقسم المزيد' }],
  },
  {
    category: 'الأجهزة الموثوقة',
    items: [{ key: 'trusted_devices.access', label: 'الوصول للأجهزة الموثوقة' }],
  },
  {
    category: 'إعدادات الدفع',
    items: [
      { key: 'payment_settings.access', label: 'الوصول لإعدادات الدفع' },
      { key: 'payment_settings.view', label: 'عرض إعدادات الدفع' },
      { key: 'payment_settings.create', label: 'إضافة إعداد دفع' },
      { key: 'payment_settings.update', label: 'تعديل إعداد دفع' },
      { key: 'payment_settings.delete', label: 'حذف إعداد دفع' },
      { key: 'payment_settings.toggle', label: 'تبديل حالة إعداد الدفع' },
    ],
  },
  {
    category: 'الرواتب',
    items: [{ key: 'salaries.access', label: 'الوصول للرواتب' }],
  },
  {
    category: 'الحسابات والصلاحيات',
    items: [{ key: 'accounts_permissions.access', label: 'الوصول للحسابات والصلاحيات' }],
  },
  {
    category: 'الكوبونات',
    items: [{ key: 'coupons.access', label: 'الوصول للكوبونات' }],
  },
  {
    category: 'الأسعار',
    items: [{ key: 'pricing.access', label: 'الوصول للأسعار' }],
  },
  {
    category: 'الإيرادات',
    items: [{ key: 'revenues.access', label: 'الوصول للإيرادات' }],
  },
  {
    category: 'المديونيات',
    items: [{ key: 'debts.access', label: 'الوصول للمديونيات' }],
  },
  {
    category: 'الإعدادات',
    items: [{ key: 'settings.access', label: 'الوصول للإعدادات' }],
  },
];
