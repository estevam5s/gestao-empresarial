import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // Estado reativo do tema
  const currentTheme = ref<Theme>('light')

  // Getters computados
  const isDarkMode = computed(() => currentTheme.value === 'dark')
  const isLightMode = computed(() => currentTheme.value === 'light')

  // Temas com paletas de cores Dracula
  const themes = {
    light: {
      // Cores principais do tema claro atual
      primary: '#667eea',
      secondary: '#764ba2',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundSolid: '#ffffff',
      surface: '#ffffff',
      text: {
        primary: '#1a202c',
        secondary: '#64748b',
        muted: '#94a3b8'
      },
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.1)',
      accent: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    },
    dark: {
      // Cores do tema Dracula
      primary: '#bd93f9', // Purple
      secondary: '#8be9fd', // Cyan
      background: 'linear-gradient(135deg, #282a36 0%, #21222c 100%)',
      backgroundSolid: '#282a36',
      surface: '#44475a',
      text: {
        primary: '#f8f8f2', // Foreground
        secondary: '#6272a4', // Comment
        muted: '#44475a'     // Current Line
      },
      border: '#44475a',
      shadow: 'rgba(0, 0, 0, 0.3)',
      accent: {
        success: '#50fa7b', // Green
        warning: '#ffb86c', // Orange
        error: '#ff5555',   // Red
        info: '#8be9fd'     // Cyan
      }
    }
  }

  // Getter para o tema atual
  const theme = computed(() => themes[currentTheme.value])

  // Actions
  function setTheme(newTheme: Theme) {
    currentTheme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  function toggleTheme() {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  function applyTheme(theme: Theme) {
    const root = document.documentElement
    const themeColors = themes[theme]

    // Desabilitar transições temporariamente para evitar flickering
    document.body.classList.add('theme-transition-disabled')

    // Aplicar CSS custom properties
    root.style.setProperty('--theme-primary', themeColors.primary)
    root.style.setProperty('--theme-secondary', themeColors.secondary)
    root.style.setProperty('--theme-background', themeColors.background)
    root.style.setProperty('--theme-background-solid', themeColors.backgroundSolid)
    root.style.setProperty('--theme-surface', themeColors.surface)
    root.style.setProperty('--theme-text-primary', themeColors.text.primary)
    root.style.setProperty('--theme-text-secondary', themeColors.text.secondary)
    root.style.setProperty('--theme-text-muted', themeColors.text.muted)
    root.style.setProperty('--theme-border', themeColors.border)
    root.style.setProperty('--theme-shadow', themeColors.shadow)
    root.style.setProperty('--theme-accent-success', themeColors.accent.success)
    root.style.setProperty('--theme-accent-warning', themeColors.accent.warning)
    root.style.setProperty('--theme-accent-error', themeColors.accent.error)
    root.style.setProperty('--theme-accent-info', themeColors.accent.info)

    // Adicionar classe ao body
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light'

    // Reabilitar transições após um pequeno delay
    setTimeout(() => {
      document.body.classList.remove('theme-transition-disabled')
    }, 50)
  }

  function initTheme() {
    // Carregar tema do localStorage ou usar light como padrão
    const savedTheme = localStorage.getItem('theme') as Theme || 'light'
    setTheme(savedTheme)
  }

  // Watcher para mudanças de tema
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: true })

  return {
    currentTheme,
    isDarkMode,
    isLightMode,
    theme,
    themes,
    setTheme,
    toggleTheme,
    initTheme
  }
})