import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Public Pages (SaaS)
import HomeView from '@/views/HomeView.vue'
import PricingView from '@/views/PricingView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FAQView from '@/views/FAQView.vue'
import ContactView from '@/views/ContactView.vue'
import AppsView from '@/views/AppsView.vue'

// Auth
import LoginView from '@/views/LoginView.vue'

// Dashboard (Authenticated)
import DashboardView from '@/views/DashboardView.vue'
import InventoryView from '@/views/InventoryView.vue'
import AIView from '@/views/AIView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ReportsView from '@/views/ReportsView.vue'
import LogsView from '@/views/LogsView.vue'
import SuppliersView from '@/views/SuppliersView.vue'
import MenuView from '@/views/MenuView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AboutView from '@/views/AboutView.vue'
import FinancialView from '@/views/FinancialView.vue'
import EmployeeManagementView from '@/views/EmployeeManagementView.vue'
import DocumentationView from '@/views/DocumentationView.vue'
import SupportChatView from '@/views/SupportChatView.vue'

// Admin
import UsersView from '@/views/admin/UsersView.vue'
import AuditView from '@/views/admin/AuditView.vue'
import BackupView from '@/views/admin/BackupView.vue'
import SecurityView from '@/views/admin/SecurityView.vue'
import NotificationsManagementView from '@/views/admin/NotificationsManagementView.vue'
import APIManagementView from '@/views/admin/APIManagementView.vue'
import PermissionsView from '@/views/admin/PermissionsView.vue'

// Legal
import TermsView from '@/views/legal/TermsView.vue'
import PrivacyView from '@/views/legal/PrivacyView.vue'
import LGPDView from '@/views/legal/LGPDView.vue'
import CookiesView from '@/views/legal/CookiesView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // Se houver uma posição salva (ex: botão voltar do navegador), use-a
    if (savedPosition) {
      return savedPosition
    }
    // Se a rota tem um hash (ex: #features), vá até esse elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Sempre volte para o topo ao navegar entre rotas
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // ==========================================
    // ROTAS PÚBLICAS DO SAAS (Landing pages)
    // ==========================================
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/apps',
      name: 'apps',
      component: AppsView
    },

    // ==========================================
    // AUTENTICAÇÃO
    // ==========================================
    {
      path: '/support',
      name: 'support',
      component: SupportChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ai',
      name: 'ai',
      component: AIView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: SuppliersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true }
    },
    {
      path: '/financial',
      name: 'financial',
      component: FinancialView,
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeeManagementView,
      meta: { requiresAuth: true }
    },
    {
      path: '/doc',
      name: 'documentation',
      component: DocumentationView,
      meta: { requiresAuth: true }
    },
    // Rotas administrativas
    {
      path: '/admin/users',
      name: 'admin-users',
      component: UsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/audit',
      name: 'admin-audit',
      component: AuditView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/backup',
      name: 'admin-backup',
      component: BackupView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/security',
      name: 'admin-security',
      component: SecurityView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/notifications',
      name: 'admin-notifications',
      component: NotificationsManagementView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/api',
      name: 'admin-api',
      component: APIManagementView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/permissions',
      name: 'permissions',
      component: PermissionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/permissions',
      name: 'admin-permissions',
      component: PermissionsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // Rotas legais (acessíveis sem autenticação)
    {
      path: '/legal/terms',
      name: 'terms',
      component: TermsView
    },
    {
      path: '/legal/privacy',
      name: 'privacy',
      component: PrivacyView
    },
    {
      path: '/legal/lgpd',
      name: 'lgpd',
      component: LGPDView
    },
    {
      path: '/legal/cookies',
      name: 'cookies',
      component: CookiesView
    }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Check stored session
  const stored = localStorage.getItem('userSession')
  if (stored && !authStore.user) {
    authStore.user = JSON.parse(stored)
  }

  // ⭐ CRÍTICO: Configurar tenant_id na sessão PostgreSQL
  // Isso garante isolamento de dados em TODAS as requisições
  if (authStore.user?.id) {
    try {
      const { supabase } = await import('@/config/supabase')
      await supabase.rpc('set_current_tenant', { tenant_uuid: authStore.user.id })
      console.log('✓ Tenant configurado:', authStore.user.id)
    } catch (error) {
      console.error('⚠️ Erro ao configurar tenant:', error)
    }
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role === 'admin'

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return '/dashboard'
  }
})

export default router
