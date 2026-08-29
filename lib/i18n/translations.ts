export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Brand
    brand_name: 'EMLY CUSTOMER LIST',
    tax_crm_workspace: 'TAX CRM WORKSPACE',
    live_sync_active: 'Live Sync Active',

    // Nav
    nav_workspace: 'WORKSPACE',
    nav_manage: 'MANAGE',
    nav_dashboard: 'Dashboard',
    nav_clients: 'Clients',
    nav_businesses: 'Businesses',
    nav_tax_returns: 'Tax Returns',
    nav_fees: 'Fees',
    nav_marketing_mail: 'Marketing Mail',
    nav_team: 'Team',
    nav_settings: 'Settings',
    nav_admin_dashboard: 'Admin Dashboard',

    // User Profile
    admin_panel: 'Admin Panel',
    account_settings: 'Account Settings',
    sign_out: 'Sign Out',
    super_admin: 'Super Admin',
    admin: 'Administrator',
    staff: 'Tax Preparer',
    user: 'Standard User',
    lifetime_license: 'Lifetime License',
    annual_pro: 'Annual Pro',
    monthly_pro: 'Monthly Pro',
    trial_license: '7-Day Trial',

    // Dashboard Overview
    dashboard_title: 'Dashboard Overview',
    dashboard_subtitle: 'Monitor client engagements, return pipeline, revenue, and deadlines in real time.',
    btn_clients_list: 'Clients List',
    btn_business_list: 'Business List',
    btn_new_business: 'New Business',
    btn_new_client: 'Add Client',
    btn_add_return: 'Add Return',
    btn_create_invoice: 'Create Invoice',

    // KPI Cards
    kpi_active_clients: 'ACTIVE CLIENTS',
    kpi_active_clients_sub: '+15% from last tax season',
    kpi_in_progress_returns: 'IN-PROGRESS RETURNS',
    kpi_in_progress_sub: 'waiting on documents',
    kpi_completed_filed: 'COMPLETED & FILED',
    kpi_completed_filed_sub: 'accepted by IRS',
    kpi_total_fees: 'TOTAL PREPARATION FEES',
    kpi_unpaid_balance: 'Unpaid balance:',

    // Pipeline
    pipeline_title: 'Tax Return Pipeline',
    pipeline_subtitle: 'Click any workflow stage to filter the returns table below',
    stage_all: 'All Stages',
    stage_waiting_docs: 'Waiting Docs',
    stage_waiting_docs_desc: 'Pending client files',
    stage_in_prep: 'In Preparation',
    stage_in_prep_desc: 'Being prepared',
    stage_review: 'Review',
    stage_review_desc: 'Internal QA check',
    stage_ready_to_file: 'Ready to File',
    stage_ready_to_file_desc: 'Signatures collected',
    stage_completed: 'Completed',
    stage_completed_desc: 'Accepted & done',

    // Table Headers
    table_active_returns: 'Active Return Engagements',
    table_subtitle: 'Manage and track progress across client tax returns',
    th_client_business: 'CLIENT / BUSINESS',
    th_return: 'RETURN',
    th_tax_year: 'TAX YEAR',
    th_status: 'STATUS',
    th_preparer: 'PREPARER',
    th_fee_balance: 'FEE / BALANCE',
    th_action: 'ACTION',
    btn_view: 'View',
    paid_in_full: 'Paid in full',
    due_label: 'Due:',

    // Deadlines & Workload
    deadlines_title: 'Upcoming Deadlines',
    deadlines_subtitle: 'Filing calendar reminders',
    deadline_critical: 'CRITICAL',
    deadline_1_title: 'Partnership & S-Corp Extensions',
    deadline_1_desc: 'Form 1065 & Form 1120-S extended returns due',
    deadline_2_title: 'Individual Extension Final Date',
    deadline_2_desc: 'Form 1040 extended tax returns deadline',
    days_remaining: 'days remaining',

    workload_title: 'Preparer Workload',
    workload_subtitle: 'Active assignments by staff',
    manage_team: 'Manage Team',
    returns_count: 'returns',

    // Search & Filters
    search_placeholder: 'Search clients, returns, EIN...',
    filter_all_types: 'All Types',
    filter_individuals: 'Individuals (1040)',
    filter_businesses: 'Businesses (1065/1120)',
    filter_unpaid: 'Unpaid Fees Only',

    // Settings
    settings_office_name: 'Office Name',
    settings_default_year: 'Default Tax Year',
    settings_office_email: 'Office Email',
    settings_time_zone: 'Time Zone',
    settings_save: 'Save Changes',

    // Switcher
    lang_en: 'English (US)',
    lang_vi: 'Tiếng Việt (VN)',
  },
  vi: {
    // Brand
    brand_name: 'EMLY CUSTOMER LIST',
    tax_crm_workspace: 'KHÔNG GIAN LÀM VIỆC CRM THUẾ',
    live_sync_active: 'Đồng bộ trực tiếp',

    // Nav
    nav_workspace: 'KHÔNG GIAN LÀM VIỆC',
    nav_manage: 'QUẢN LÝ HỆ THỐNG',
    nav_dashboard: 'Tổng quan Dashboard',
    nav_clients: 'Khách hàng cá nhân',
    nav_businesses: 'Khách hàng doanh nghiệp',
    nav_tax_returns: 'Hồ sơ khai thuế',
    nav_fees: 'Phí & Thanh toán',
    nav_marketing_mail: 'Gửi mail Marketing',
    nav_team: 'Đội ngũ nhân viên',
    nav_settings: 'Cài đặt hệ thống',
    nav_admin_dashboard: 'Trang quản trị Admin',

    // User Profile
    admin_panel: 'Bảng Quản Trị',
    account_settings: 'Cài đặt tài khoản',
    sign_out: 'Đăng xuất',
    super_admin: 'Quản trị viên cấp cao',
    admin: 'Quản trị viên',
    staff: 'Nhân viên thuế',
    user: 'Người dùng',
    lifetime_license: 'Bản quyền trọn đời',
    annual_pro: 'Gói năm Pro',
    monthly_pro: 'Gói tháng Pro',
    trial_license: 'Dùng thử 7 ngày',

    // Dashboard Overview
    dashboard_title: 'Bảng Điều Khiển Tổng Quan',
    dashboard_subtitle: 'Theo dõi hồ sơ khách hàng, tiến độ khai thuế, doanh thu và hạn nộp theo thời gian thực.',
    btn_clients_list: 'Danh Sách Cá Nhân',
    btn_business_list: 'Danh Sách Doanh Nghiệp',
    btn_new_business: 'Thêm Doanh Nghiệp',
    btn_new_client: 'Thêm Khách Hàng',
    btn_add_return: 'Tạo Hồ Sơ Thuế',
    btn_create_invoice: 'Tạo Hóa Đơn',

    // KPI Cards
    kpi_active_clients: 'TỔNG KHÁCH HÀNG HOẠT ĐỘNG',
    kpi_active_clients_sub: '+15% so với mùa thuế trước',
    kpi_in_progress_returns: 'HỒ SƠ ĐANG XỬ LÝ',
    kpi_in_progress_sub: 'hồ sơ đang chờ giấy tờ',
    kpi_completed_filed: 'HỒ SƠ ĐÃ NỘP THÀNH CÔNG',
    kpi_completed_filed_sub: 'IRS đã chấp thuận 100%',
    kpi_total_fees: 'TỔNG PHÍ CHUẨN BỊ THUẾ',
    kpi_unpaid_balance: 'Số tiền còn nợ:',

    // Pipeline
    pipeline_title: 'Quy Trình Xử Lý Hồ Sơ Thuế (Pipeline)',
    pipeline_subtitle: 'Nhấp vào từng giai đoạn để lọc nhanh danh sách hồ sơ bên dưới',
    stage_all: 'Tất cả giai đoạn',
    stage_waiting_docs: 'Chờ Giấy Tờ',
    stage_waiting_docs_desc: 'Khách chưa nộp đủ W-2/1099',
    stage_in_prep: 'Đang Soạn Hồ Sơ',
    stage_in_prep_desc: 'Nhân viên đang chuẩn bị',
    stage_review: 'Đang Kiểm Tra (QA)',
    stage_review_desc: 'Kiểm tra độ chính xác',
    stage_ready_to_file: 'Sẵn Sàng Nộp',
    stage_ready_to_file_desc: 'Đã ký tên đầy đủ',
    stage_completed: 'Đã Hoàn Tất',
    stage_completed_desc: 'IRS đã chấp thuận xong',

    // Table Headers
    table_active_returns: 'Danh Sách Hồ Sơ Khai Thuế',
    table_subtitle: 'Quản lý và cập nhật trạng thái chi tiết của từng hồ sơ khách hàng',
    th_client_business: 'KHÁCH HÀNG / DOANH NGHIỆP',
    th_return: 'MẪU TỜ KHAI',
    th_tax_year: 'NĂM THUẾ',
    th_status: 'TRẠNG THÁI',
    th_preparer: 'NHÂN VIÊN PHỤ TRÁCH',
    th_fee_balance: 'PHÍ / CÒN NỢ',
    th_action: 'THAO TÁC',
    btn_view: 'Xem chi tiết',
    paid_in_full: 'Đã thanh toán đủ',
    due_label: 'Còn nợ:',

    // Deadlines & Workload
    deadlines_title: 'Hạn Chót Nộp Thuế Sắp Tới',
    deadlines_subtitle: 'Nhắc nhở lịch nộp hồ sơ IRS',
    deadline_critical: 'QUAN TRỌNG',
    deadline_1_title: 'Hạn Gia Hạn Công Ty (Partnership & S-Corp)',
    deadline_1_desc: 'Hạn chót nộp tờ khai Form 1065 & Form 1120-S',
    deadline_2_title: 'Hạn Chót Gia Hạn Cá Nhân (1040)',
    deadline_2_desc: 'Hạn cuối nộp tờ khai thuế cá nhân gia hạn',
    days_remaining: 'ngày còn lại',

    workload_title: 'Khối Lượng Việc Theo Nhân Viên',
    workload_subtitle: 'Số lượng hồ sơ phân bổ cho từng nhân sự',
    manage_team: 'Quản Lý Đội Ngũ',
    returns_count: 'hồ sơ',

    // Search & Filters
    search_placeholder: 'Tìm kiếm khách hàng, tờ khai, mã số thuế EIN...',
    filter_all_types: 'Tất cả loại hình',
    filter_individuals: 'Thuế cá nhân (Form 1040)',
    filter_businesses: 'Thuế doanh nghiệp (1065/1120)',
    filter_unpaid: 'Chỉ hồ sơ còn nợ phí',

    // Settings
    settings_office_name: 'Tên Văn Phòng Thuế',
    settings_default_year: 'Năm Thuế Mặc Định',
    settings_office_email: 'Email Liên Hệ Văn Phòng',
    settings_time_zone: 'Múi Giờ Làm Việc',
    settings_save: 'Lưu Thay Đổi',

    // Switcher
    lang_en: 'English (US)',
    lang_vi: 'Tiếng Việt (VN)',
  },
};
