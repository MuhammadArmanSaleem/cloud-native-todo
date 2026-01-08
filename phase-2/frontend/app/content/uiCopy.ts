// UI Copy translations for English and Urdu
export type Language = "en" | "ur";

export interface Translations {
  // Header
  header: {
    appTitle: string;
    searchPlaceholder: string;
    addTask: string;
  };
  // Navigation
  navigation: {
    tasks: string;
    settings: string;
  };
  // Task List
  taskList: {
    title: string;
    emptyState: string;
    emptyStateFiltered: string;
    all: string;
    pending: string;
    completed: string;
  };
  // Task Form
  taskForm: {
    createTitle: string;
    editTitle: string;
    titleLabel: string;
    descriptionLabel: string;
    priorityLabel: string;
    tagsLabel: string;
    dueDateLabel: string;
    recurringPatternLabel: string;
    createButton: string;
    saveButton: string;
    cancelButton: string;
    saving: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    addTagPlaceholder: string;
    priorityNone: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    recurringNone: string;
    recurringDaily: string;
    recurringWeekly: string;
    recurringMonthly: string;
    recurringCustom: string;
  };
  // Task Card
  taskCard: {
    deleteTask: string;
    markComplete: string;
    markIncomplete: string;
  };
  // Delete Dialog
  deleteDialog: {
    title: string;
    message: string;
    confirm: string;
    cancel: string;
    deleting: string;
  };
  // Toast Messages
  toast: {
    taskDeleted: string;
    taskDeleteError: string;
    taskCreated: string;
    taskUpdated: string;
  };
  // Priority Labels
  priority: {
    high: string;
    medium: string;
    low: string;
  };
  // Recurring Patterns
  recurring: {
    daily: string;
    weekly: string;
    monthly: string;
    custom: string;
  };
  // Notifications
  notifications: {
    preferencesSaved: string;
    saveError: string;
  };
  // Comments
  comments: {
    placeholder: string;
    post: string;
    posting: string;
    posted: string;
    postError: string;
    emptyState: string;
  };
  // Attachments
  attachments: {
    title: string;
    uploadTitle: string;
    selectFiles: string;
    fileTypesHint: string;
    maxSize: string;
    selectedFiles: string;
    removeFile: (fileName: string) => string;
    upload: string;
    uploading: string;
    uploaded: string;
    uploadError: string;
    downloadError: string;
    loading: string;
    emptyState: string;
  };
  // Sharing
  sharing: {
    share: string;
    shareTask: string;
    title: string;
    close: string;
    sharingTask: string;
    selectMethod: string;
    link: string;
    email: string;
    shareLink: string;
    copy: string;
    copied: string;
    generateLink: string;
    generatingLink: string;
    recipientEmail: string;
    emailPlaceholder: string;
    sendEmail: string;
    sending: string;
    emailSent: (email: string) => string;
    linkGenerated: string;
  };
  // Roles
  roles: {
    title: string;
    description: string;
    userName: string;
    email: string;
    currentRole: string;
    changeRole: string;
    selectRole: string;
    admin: string;
    user: string;
    roleLabel: (role: string) => string;
    taskManagement: string;
    roleUpdated: (name: string, role: string) => string;
    updateError: string;
    loading: string;
    emptyState: string;
    accessDenied: string;
  };
}

export const uiCopy: Record<Language, Translations> = {
  en: {
    header: {
      appTitle: "Todo App",
      searchPlaceholder: "Search tasks...",
      addTask: "Add Task",
    },
    navigation: {
      tasks: "Tasks",
      settings: "Settings",
    },
    taskList: {
      title: "Tasks",
      emptyState: "No tasks yet. Click \"Add Task\" to add one!",
      emptyStateFiltered: "No tasks match your current filters. Try adjusting them.",
      all: "All",
      pending: "Pending",
      completed: "Completed",
    },
    taskForm: {
      createTitle: "Create New Task",
      editTitle: "Edit Task",
      titleLabel: "Title",
      descriptionLabel: "Description",
      priorityLabel: "Priority",
      tagsLabel: "Tags",
      dueDateLabel: "Due Date",
      recurringPatternLabel: "Recurring Pattern",
      createButton: "Create Task",
      saveButton: "Save Changes",
      cancelButton: "Cancel",
      saving: "Saving...",
      titlePlaceholder: "Enter task title",
      descriptionPlaceholder: "Enter task description (optional)",
      addTagPlaceholder: "Add a tag and press Enter",
      priorityNone: "None",
      priorityLow: "Low",
      priorityMedium: "Medium",
      priorityHigh: "High",
      recurringNone: "None",
      recurringDaily: "Daily",
      recurringWeekly: "Weekly",
      recurringMonthly: "Monthly",
      recurringCustom: "Custom",
    },
    taskCard: {
      deleteTask: "Delete task",
      markComplete: "Mark task as complete",
      markIncomplete: "Mark task as incomplete",
    },
    deleteDialog: {
      title: "Delete Task",
      message: "Are you sure you want to delete",
      confirm: "Delete",
      cancel: "Cancel",
      deleting: "Deleting...",
    },
    toast: {
      taskDeleted: "Task deleted successfully",
      taskDeleteError: "Failed to delete task. Please try again.",
      taskCreated: "Task created successfully",
      taskUpdated: "Task updated successfully",
    },
    priority: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    recurring: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      custom: "Custom",
    },
    notifications: {
      preferencesSaved: "Notification preferences saved successfully",
      saveError: "Failed to save notification preferences. Please try again.",
    },
    comments: {
      placeholder: "Write a comment...",
      post: "Post Comment",
      posting: "Posting...",
      posted: "Comment posted successfully",
      postError: "Failed to post comment. Please try again.",
      emptyState: "No comments yet. Be the first to comment!",
    },
    attachments: {
      title: "Attachments",
      uploadTitle: "Upload Files",
      selectFiles: "Select Files",
      fileTypesHint: "Allowed: Images, PDFs, Text files. Max size",
      maxSize: "per file",
      selectedFiles: "Selected Files",
      removeFile: (fileName: string) => `Remove ${fileName}`,
      upload: "Upload",
      uploading: "Uploading...",
      uploaded: "Files uploaded successfully",
      uploadError: "Failed to upload files. Please try again.",
      downloadError: "Failed to download file. Please try again.",
      loading: "Loading attachments...",
      emptyState: "No attachments yet. Upload files to attach them to this task.",
    },
    sharing: {
      share: "Share",
      shareTask: "Share Task",
      title: "Share Task",
      close: "Close",
      sharingTask: "Sharing task",
      selectMethod: "Select sharing method",
      link: "Link",
      email: "Email",
      shareLink: "Share Link",
      copy: "Copy",
      copied: "Copied!",
      generateLink: "Generate Link",
      generatingLink: "Generating link...",
      recipientEmail: "Recipient Email",
      emailPlaceholder: "Enter email address",
      sendEmail: "Send Email",
      sending: "Sending...",
      emailSent: (email: string) => `Task shared via email to ${email}`,
      linkGenerated: "Share link generated successfully",
    },
  },
  ur: {
    header: {
      appTitle: "ٹوڈو ایپ",
      searchPlaceholder: "کام تلاش کریں...",
      addTask: "کام شامل کریں",
    },
    navigation: {
      tasks: "کام",
      settings: "ترتیبات",
    },
    taskList: {
      title: "کام",
      emptyState: "ابھی تک کوئی کام نہیں۔ \"کام شامل کریں\" پر کلک کریں!",
      emptyStateFiltered: "آپ کے موجودہ فلٹرز سے کوئی کام میل نہیں کھاتا۔ انہیں ایڈجسٹ کرنے کی کوشش کریں۔",
      all: "تمام",
      pending: "زیر التواء",
      completed: "مکمل",
    },
    taskForm: {
      createTitle: "نیا کام بنائیں",
      editTitle: "کام میں ترمیم کریں",
      titleLabel: "عنوان",
      descriptionLabel: "تفصیل",
      priorityLabel: "ترجیح",
      tagsLabel: "ٹیگز",
      dueDateLabel: "آخری تاریخ",
      recurringPatternLabel: "دہرائی والا پیٹرن",
      createButton: "کام بنائیں",
      saveButton: "تبدیلیاں محفوظ کریں",
      cancelButton: "منسوخ کریں",
      saving: "محفوظ ہو رہا ہے...",
      titlePlaceholder: "کام کا عنوان درج کریں",
      descriptionPlaceholder: "کام کی تفصیل درج کریں (اختیاری)",
      addTagPlaceholder: "ٹیگ شامل کریں اور Enter دبائیں",
      priorityNone: "کوئی نہیں",
      priorityLow: "کم",
      priorityMedium: "درمیانی",
      priorityHigh: "زیادہ",
      recurringNone: "کوئی نہیں",
      recurringDaily: "روزانہ",
      recurringWeekly: "ہفتہ وار",
      recurringMonthly: "ماہانہ",
      recurringCustom: "اپنی مرضی",
    },
    taskCard: {
      deleteTask: "کام حذف کریں",
      markComplete: "کام کو مکمل نشان زد کریں",
      markIncomplete: "کام کو نامکمل نشان زد کریں",
    },
    deleteDialog: {
      title: "کام حذف کریں",
      message: "کیا آپ واقعی حذف کرنا چاہتے ہیں",
      confirm: "حذف کریں",
      cancel: "منسوخ کریں",
      deleting: "حذف ہو رہا ہے...",
    },
    toast: {
      taskDeleted: "کام کامیابی سے حذف ہو گیا",
      taskDeleteError: "کام حذف کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      taskCreated: "کام کامیابی سے بنایا گیا",
      taskUpdated: "کام کامیابی سے اپ ڈیٹ ہو گیا",
    },
    priority: {
      high: "زیادہ",
      medium: "درمیانی",
      low: "کم",
    },
    recurring: {
      daily: "روزانہ",
      weekly: "ہفتہ وار",
      monthly: "ماہانہ",
      custom: "اپنی مرضی",
    },
    notifications: {
      preferencesSaved: "اطلاعات کی ترجیحات کامیابی سے محفوظ ہو گئیں",
      saveError: "اطلاعات کی ترجیحات محفوظ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
    },
    comments: {
      placeholder: "تبصرہ لکھیں...",
      post: "تبصرہ پوسٹ کریں",
      posting: "پوسٹ ہو رہا ہے...",
      posted: "تبصرہ کامیابی سے پوسٹ ہو گیا",
      postError: "تبصرہ پوسٹ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      emptyState: "ابھی تک کوئی تبصرہ نہیں۔ پہلا تبصرہ شامل کریں!",
    },
    attachments: {
      title: "منسلکات",
      uploadTitle: "فائلیں اپ لوڈ کریں",
      selectFiles: "فائلیں منتخب کریں",
      fileTypesHint: "اجازت شدہ: تصاویر، PDFs، ٹیکسٹ فائلیں۔ زیادہ سے زیادہ سائز",
      maxSize: "فی فائل",
      selectedFiles: "منتخب شدہ فائلیں",
      removeFile: (fileName: string) => `${fileName} کو ہٹائیں`,
      upload: "اپ لوڈ کریں",
      uploading: "اپ لوڈ ہو رہا ہے...",
      uploaded: "فائلیں کامیابی سے اپ لوڈ ہو گئیں",
      uploadError: "فائلیں اپ لوڈ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      downloadError: "فائل ڈاؤن لوڈ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      loading: "منسلکات لوڈ ہو رہے ہیں...",
      emptyState: "ابھی تک کوئی منسلکات نہیں۔ فائلیں اپ لوڈ کریں تاکہ انہیں اس کام سے منسلک کیا جا سکے۔",
    },
    sharing: {
      share: "شیئر کریں",
      shareTask: "کام شیئر کریں",
      title: "کام شیئر کریں",
      close: "بند کریں",
      sharingTask: "کام شیئر کر رہے ہیں",
      selectMethod: "شیئرنگ کا طریقہ منتخب کریں",
      link: "لنک",
      email: "ای میل",
      shareLink: "شیئر لنک",
      copy: "کاپی کریں",
      copied: "کاپی ہو گیا!",
      generateLink: "لنک بنائیں",
      generatingLink: "لنک بنایا جا رہا ہے...",
      recipientEmail: "وصول کنندہ ای میل",
      emailPlaceholder: "ای میل ایڈریس درج کریں",
      sendEmail: "ای میل بھیجیں",
      sending: "بھیجا جا رہا ہے...",
      emailSent: (email: string) => `کام ${email} پر ای میل کے ذریعے شیئر کیا گیا`,
      linkGenerated: "شیئر لنک کامیابی سے بنایا گیا",
    },
    roles: {
      title: "صارف کردار",
      description: "صارف کردار اور اجازتیں منظم کریں۔ منتظمین صارفین کو کردار تفویض کر سکتے ہیں۔",
      userName: "صارف کا نام",
      email: "ای میل",
      currentRole: "موجودہ کردار",
      changeRole: "کردار تبدیل کریں",
      selectRole: "کردار منتخب کریں",
      admin: "منتظم",
      user: "صارف",
      roleLabel: (role: string) => `صارف کردار: ${role}`,
      taskManagement: "کام کی انتظامیہ",
      roleUpdated: (name: string, role: string) => `${name} کا کردار ${role} میں تبدیل کر دیا گیا`,
      updateError: "کردار اپ ڈیٹ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      loading: "کردار لوڈ ہو رہے ہیں...",
      emptyState: "کوئی صارف نہیں ملا۔",
      accessDenied: "رسائی مسترد۔ منتظم کی اجازت درکار ہے۔",
    },
  },
};

