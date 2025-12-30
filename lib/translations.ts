// Simple JSON-based translations
// Supports: Uzbek (Latin), Uzbek (Cyrillic), Russian

export type Language = "uz-lat" | "uz-cyr" | "ru"

export const translations: Record<Language, Record<string, string>> = {
  "uz-lat": {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin Panel",
    "nav.settings": "Sozlamalar",
    "nav.logout": "Chiqish",
    
    // Dashboard
    "dashboard.welcome": "Xush kelibsiz!",
    "dashboard.choose_category": "Test kategoriyasini tanlang",
    "dashboard.categorized_tests": "Kategoriyalangan testlar",
    "dashboard.random_tests": "Tasodifiy testlar",
    "dashboard.tickets": "Biletlar",
    "dashboard.exams": "Imtihonlar",
    "dashboard.exam_20": "Imtihon 20",
    "dashboard.exam_50": "Imtihon 50",
    "dashboard.exam_100": "Imtihon 100",
    "dashboard.start_test": "Testni boshlash",
    "dashboard.start_random": "Tasodifiy testni boshlash",
    "dashboard.start_ticket": "Biletni boshlash",
    "dashboard.start_exam": "Imtihonni boshlash",
    "dashboard.unlimited_questions": "Cheksiz savollar",
    "dashboard.finish_anytime": "Har qanday vaqtda tugatish mumkin",
    
    // Test Interface
    "test.question": "Savol",
    "test.of": "dan",
    "test.previous": "Oldingi",
    "test.next": "Keyingi",
    "test.finish": "Testni yakunlash",
    "test.finish_anytime": "Har qanday vaqtda tugatish",
    "test.finished": "Test yakunlandi!",
    "test.final_score": "Final ball",
    "test.total_questions": "Jami savollar",
    "test.correct": "To'g'ri javoblar",
    "test.wrong": "Noto'g'ri javoblar",
    "test.unanswered": "Javobsiz",
    "test.back_to_dashboard": "Dashboardga qaytish",
    "test.explanation": "Tushuntirish",
    
    // Statistics
    "stats.title": "Statistika",
    "stats.last_attempt": "Oxirgi urinish",
    "stats.percentage": "Foiz",
    "stats.clear": "Tozalash",
    "stats.clear_confirm": "Bu bo'lim statistikasini tozalashni xohlaysizmi?",
    
    // Settings
    "settings.title": "Sozlamalar",
    "settings.font_size": "Shrift o'lchami",
    "settings.question_size": "Savol o'lchami",
    "settings.answer_size": "Javob o'lchami",
    "settings.increase": "Oshirish",
    "settings.decrease": "Kamaytirish",
    "settings.language": "Til",
    "settings.language_uz_lat": "O'zbek (Lotin)",
    "settings.language_uz_cyr": "O'zbek (Kirill)",
    "settings.language_ru": "Русский",
    
    // Admin
    "admin.users": "Foydalanuvchilar",
    "admin.categories": "Kategoriyalar",
    "admin.topics": "Mavzular",
    "admin.tests": "Testlar",
    "admin.tickets": "Biletlar",
    "admin.contact": "Bog'lanish",
    "admin.user_stats": "Foydalanuvchi statistikasi",
    "admin.topic_avg": "Mavzu testlari o'rtacha %",
    "admin.ticket_avg": "Bilet testlari o'rtacha %",
    "admin.exam_avg": "Imtihon testlari o'rtacha %",
    
    // Common
    "common.save": "Saqlash",
    "common.cancel": "Bekor qilish",
    "common.delete": "O'chirish",
    "common.edit": "Tahrirlash",
    "common.create": "Yaratish",
    "common.loading": "Yuklanmoqda...",
    "common.error": "Xatolik",
    "common.success": "Muvaffaqiyatli",
  },
  "uz-cyr": {
    // Navigation
    "nav.dashboard": "Дашборд",
    "nav.admin": "Админ панел",
    "nav.settings": "Созламалар",
    "nav.logout": "Чиқиш",
    
    // Dashboard
    "dashboard.welcome": "Хуш келибсиз!",
    "dashboard.choose_category": "Тест категориясини танланг",
    "dashboard.categorized_tests": "Категорияланган тестлар",
    "dashboard.random_tests": "Тасодифий тестлар",
    "dashboard.tickets": "Билетлар",
    "dashboard.exams": "Имтиҳонлар",
    "dashboard.exam_20": "Имтиҳон 20",
    "dashboard.exam_50": "Имтиҳон 50",
    "dashboard.exam_100": "Имтиҳон 100",
    "dashboard.start_test": "Тестни бошлаш",
    "dashboard.start_random": "Тасодифий тестни бошлаш",
    "dashboard.start_ticket": "Билетни бошлаш",
    "dashboard.start_exam": "Имтиҳонни бошлаш",
    "dashboard.unlimited_questions": "Чексиз саволлар",
    "dashboard.finish_anytime": "Ҳар қандай вақтда тугатиш мумкин",
    
    // Test Interface
    "test.question": "Савол",
    "test.of": "дан",
    "test.previous": "Олдинги",
    "test.next": "Кейинги",
    "test.finish": "Тестни якунлаш",
    "test.finish_anytime": "Ҳар қандай вақтда тугатиш",
    "test.finished": "Тест якунланди!",
    "test.final_score": "Финал балл",
    "test.total_questions": "Жами саволлар",
    "test.correct": "Тўғри жавоблар",
    "test.wrong": "Нотўғри жавоблар",
    "test.unanswered": "Жавобсиз",
    "test.back_to_dashboard": "Дашбордга қайтиш",
    "test.explanation": "Тушунтириш",
    
    // Statistics
    "stats.title": "Статистика",
    "stats.last_attempt": "Охирги уриниш",
    "stats.percentage": "Фоиз",
    "stats.clear": "Тозалаш",
    "stats.clear_confirm": "Бу бўлим статистикасини тозалашни хоҳлайсизми?",
    
    // Settings
    "settings.title": "Созламалар",
    "settings.font_size": "Шрифт ўлчами",
    "settings.question_size": "Савол ўлчами",
    "settings.answer_size": "Жавоб ўлчами",
    "settings.increase": "Ошириш",
    "settings.decrease": "Камайтириш",
    "settings.language": "Тил",
    "settings.language_uz_lat": "Ўзбек (Лотин)",
    "settings.language_uz_cyr": "Ўзбек (Кирилл)",
    "settings.language_ru": "Русский",
    
    // Admin
    "admin.users": "Фойдаланувчилар",
    "admin.categories": "Категориялар",
    "admin.topics": "Мавзулар",
    "admin.tests": "Тестлар",
    "admin.tickets": "Билетлар",
    "admin.contact": "Боғланиш",
    "admin.user_stats": "Фойдаланувчи статистикаси",
    "admin.topic_avg": "Мавзу тестлари ўртача %",
    "admin.ticket_avg": "Билет тестлари ўртача %",
    "admin.exam_avg": "Имтиҳон тестлари ўртача %",
    
    // Common
    "common.save": "Сақлаш",
    "common.cancel": "Бекор қилиш",
    "common.delete": "Ўчириш",
    "common.edit": "Таҳрирлаш",
    "common.create": "Яратиш",
    "common.loading": "Юкланмоқда...",
    "common.error": "Хатолик",
    "common.success": "Муваффақиятли",
  },
  "ru": {
    // Navigation
    "nav.dashboard": "Панель управления",
    "nav.admin": "Админ панель",
    "nav.settings": "Настройки",
    "nav.logout": "Выход",
    
    // Dashboard
    "dashboard.welcome": "Добро пожаловать!",
    "dashboard.choose_category": "Выберите категорию теста",
    "dashboard.categorized_tests": "Категоризированные тесты",
    "dashboard.random_tests": "Случайные тесты",
    "dashboard.tickets": "Билеты",
    "dashboard.exams": "Экзамены",
    "dashboard.exam_20": "Экзамен 20",
    "dashboard.exam_50": "Экзамен 50",
    "dashboard.exam_100": "Экзамен 100",
    "dashboard.start_test": "Начать тест",
    "dashboard.start_random": "Начать случайный тест",
    "dashboard.start_ticket": "Начать билет",
    "dashboard.start_exam": "Начать экзамен",
    "dashboard.unlimited_questions": "Неограниченное количество вопросов",
    "dashboard.finish_anytime": "Можно закончить в любое время",
    
    // Test Interface
    "test.question": "Вопрос",
    "test.of": "из",
    "test.previous": "Предыдущий",
    "test.next": "Следующий",
    "test.finish": "Завершить тест",
    "test.finish_anytime": "Можно закончить в любое время",
    "test.finished": "Тест завершен!",
    "test.final_score": "Финальный балл",
    "test.total_questions": "Всего вопросов",
    "test.correct": "Правильные ответы",
    "test.wrong": "Неправильные ответы",
    "test.unanswered": "Без ответа",
    "test.back_to_dashboard": "Вернуться в панель",
    "test.explanation": "Объяснение",
    
    // Statistics
    "stats.title": "Статистика",
    "stats.last_attempt": "Последняя попытка",
    "stats.percentage": "Процент",
    "stats.clear": "Очистить",
    "stats.clear_confirm": "Вы уверены, что хотите очистить статистику этого раздела?",
    
    // Settings
    "settings.title": "Настройки",
    "settings.font_size": "Размер шрифта",
    "settings.question_size": "Размер вопроса",
    "settings.answer_size": "Размер ответа",
    "settings.increase": "Увеличить",
    "settings.decrease": "Уменьшить",
    "settings.language": "Язык",
    "settings.language_uz_lat": "O'zbek (Lotin)",
    "settings.language_uz_cyr": "O'zbek (Kirill)",
    "settings.language_ru": "Русский",
    
    // Admin
    "admin.users": "Пользователи",
    "admin.categories": "Категории",
    "admin.topics": "Темы",
    "admin.tests": "Тесты",
    "admin.tickets": "Билеты",
    "admin.contact": "Контакты",
    "admin.user_stats": "Статистика пользователя",
    "admin.topic_avg": "Средний % тестов по темам",
    "admin.ticket_avg": "Средний % тестов по билетам",
    "admin.exam_avg": "Средний % экзаменов",
    
    // Common
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.delete": "Удалить",
    "common.edit": "Редактировать",
    "common.create": "Создать",
    "common.loading": "Загрузка...",
    "common.error": "Ошибка",
    "common.success": "Успешно",
  },
}

export function t(key: string, lang: Language = "uz-lat"): string {
  return translations[lang]?.[key] || key
}

