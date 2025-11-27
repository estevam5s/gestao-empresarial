<template>
  <footer class="app-footer">
    <!-- Decorative wave -->
    <div class="footer-wave">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
    </div>

    <div class="footer-content">
      <div class="footer-grid">
        <!-- Brand & Description -->
        <div class="footer-col brand-col">
          <div class="brand">
            <div class="logo-container">
              <img :src="logoSrc" alt="Logo" class="brand-logo" @error="onLogoError" />
            </div>
            <h3 class="brand-title">{{ siteName }}</h3>
          </div>
          <p class="brand-description">{{ siteDescriptionShort }}</p>

          <!-- Social Links -->
          <div class="social-links">
            <a href="#" class="social-link" aria-label="LinkedIn">
              <Linkedin :size="18" />
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <Github :size="18" />
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <Instagram :size="18" />
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <Youtube :size="18" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col links-col">
          <h4 class="footer-title">Links Rápidos</h4>
          <ul class="footer-links">
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/inventory">Estoque</router-link></li>
            <li><router-link to="/reports">Relatórios</router-link></li>
            <li><router-link to="/financial">Financeiro</router-link></li>
            <li><router-link to="/settings">Configurações</router-link></li>
            <li><router-link to="/doc">Documentação</router-link></li>
          </ul>
        </div>

        <!-- Download App -->
        <div class="footer-col download-col">
          <h4 class="footer-title">
            <Smartphone :size="18" />
            Baixe o App
          </h4>

          <button @click="downloadAPK" class="download-btn">
            <Download :size="20" />
            <div class="download-info">
              <span class="download-label">Android APK</span>
              <span class="download-version">v{{ appVersion }}</span>
            </div>
          </button>

          <div class="qr-container">
            <button @click="downloadViaQR" class="qr-code" title="Escanear QR Code">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="qr-image" />
              <div v-else class="qr-placeholder">
                <QrCode :size="60" />
              </div>
            </button>
            <span class="qr-label">Escanear QR Code</span>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="contact-item">
              <Mail :size="14" />
              <span>restpedacinhodoceu@gmail.com</span>
            </div>
            <div class="contact-item">
              <Phone :size="14" />
              <span>(48) 3237-7280</span>
            </div>
            <div class="contact-item">
              <MapPin :size="14" />
              <span>Florianópolis - SC</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="legal-links">
            <router-link to="/legal/terms">Termos</router-link>
            <span class="separator">•</span>
            <router-link to="/legal/privacy">Privacidade</router-link>
            <span class="separator">•</span>
            <router-link to="/legal/lgpd">LGPD</router-link>
            <span class="separator">•</span>
            <router-link to="/legal/cookies">Cookies</router-link>
          </div>

          <div class="copyright">
            <span>© {{ year }} {{ siteName }}. Todos os direitos reservados.</span>
            <div class="version-badge">
              <Zap :size="10" />
              <span>v{{ appVersion }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
    <Transition name="modal-fade">
      <div v-if="showQRModal" class="qr-modal-overlay" @click="closeQRModal">
        <div class="qr-modal-content" @click.stop>
          <button class="qr-modal-close" @click="closeQRModal" aria-label="Fechar">
            <X :size="24" />
          </button>

          <div class="qr-modal-header">
            <Smartphone :size="32" class="qr-modal-icon" />
            <h3>Escaneie para Baixar</h3>
            <p>Aponte a câmera do seu celular</p>
          </div>

          <div class="qr-modal-body">
            <div class="qr-code-container">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="qr-image-large" />
            </div>

            <div class="qr-info">
              <div class="qr-info-item">
                <Download :size="20" />
                <div>
                  <strong>Arquivo:</strong>
                  <span>{{ apkFileName }}</span>
                </div>
              </div>
              <div class="qr-info-item">
                <Package :size="20" />
                <div>
                  <strong>Versão:</strong>
                  <span>v{{ appVersion }}</span>
                </div>
              </div>
            </div>

            <button @click="downloadAPK" class="qr-download-button">
              <Download :size="20" />
              <span>Ou clique para baixar</span>
            </button>
          </div>

          <div class="qr-modal-footer">
            <p>📱 Android 5.0 ou superior</p>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import {
  Smartphone, Package, Zap, Download, Mail, Phone, MapPin,
  Linkedin, Github, Instagram, Youtube, X, QrCode
} from 'lucide-vue-next'
import QRCode from 'qrcode'

const appVersion = (import.meta as any).env?.VITE_APP_VERSION || '1.0.0'
const year = new Date().getFullYear()

const logoSrc = computed(() => '/images/site-icon.png')

function onLogoError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el && el.src.indexOf('/restaurante.jpeg') === -1) {
    el.src = '/restaurante.jpeg'
  }
}

const apkDownloadUrl = 'https://github.com/estevam5s/estevam5s/releases/download/v1.0.0/gestao_estoque.apk'
const apkFileName = 'gestao_estoque.apk'

const showQRModal = ref(false)
const qrCodeDataUrl = ref('')

onMounted(async () => {
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(apkDownloadUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
  }
})

async function downloadAPK() {
  try {
    showNotification('📥 Download iniciado!', 'O arquivo será baixado...', 'success')

    const link = document.createElement('a')
    link.href = apkDownloadUrl
    link.download = apkFileName
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => document.body.removeChild(link), 1000)
  } catch (error) {
    console.error('Erro ao baixar APK:', error)
    showNotification('⚠️ Erro', 'Abrindo em nova aba...', 'warning')
    setTimeout(() => window.open(apkDownloadUrl, '_blank'), 500)
  }
}

function downloadViaQR() {
  showQRModal.value = true
  showNotification('📱 QR Code', 'Escaneie para baixar', 'info')
}

function closeQRModal() {
  showQRModal.value = false
}

function showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  const notification = document.createElement('div')
  notification.className = `app-notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `

  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: type === 'success' ? '#10b981' :
                     type === 'error' ? '#ef4444' :
                     type === 'warning' ? '#f59e0b' : '#3b82f6',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    zIndex: '99999',
    maxWidth: '350px',
    animation: 'slideInRight 0.3s ease-out',
    fontSize: '14px'
  })

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out'
    setTimeout(() => document.body.removeChild(notification), 300)
  }, 4000)
}

const siteName = (import.meta as any).env?.VITE_SITE_NAME || 'GestãoZe System'
const siteDescriptionShort = 'Gestão profissional de estoque e operações para restaurantes'
</script>

<style scoped>
/* Footer Wave */
.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  overflow: hidden;
  line-height: 0;
}

.footer-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.footer-wave path {
  fill: rgba(102, 126, 234, 0.1);
}

/* Main Footer */
.app-footer {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-top: 1px solid #e2e8f0;
  position: relative;
  margin-top: 80px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 60px;
  margin-bottom: 40px;
}

/* Brand Column */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.brand-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
}

/* Links Column */
.footer-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #667eea;
  transform: translateX(4px);
}

/* Download Column */
.download-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.download-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.download-label {
  font-size: 13px;
  opacity: 0.9;
}

.download-version {
  font-size: 11px;
  opacity: 0.7;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.qr-code {
  background: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-code:hover {
  transform: scale(1.05);
}

.qr-image {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 6px;
}

.qr-placeholder {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.qr-label {
  font-size: 12px;
  color: #64748b;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.contact-item svg {
  flex-shrink: 0;
  color: #94a3b8;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid #e2e8f0;
  padding: 24px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.legal-links a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #667eea;
}

.separator {
  color: #cbd5e1;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #64748b;
}

.version-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

/* QR Modal - Compact Version */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 20px;
}

.qr-modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.qr-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.qr-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.qr-modal-header {
  text-align: center;
  padding: 32px 24px 20px;
  color: white;
}

.qr-modal-icon {
  margin: 0 auto 12px;
  display: block;
}

.qr-modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.qr-modal-header p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.qr-modal-body {
  padding: 0 24px 24px;
}

.qr-code-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.qr-image-large {
  width: 250px;
  height: 250px;
}

.qr-info {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.qr-info-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: white;
}

.qr-info-item strong {
  font-size: 11px;
  opacity: 0.8;
  display: block;
}

.qr-info-item span {
  font-size: 13px;
  font-weight: 600;
}

.qr-download-button {
  width: 100%;
  background: white;
  color: #667eea;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.qr-download-button:hover {
  transform: translateY(-2px);
  background: #f8f9ff;
}

.qr-modal-footer {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px 24px;
  text-align: center;
  color: white;
  font-size: 12px;
}

.qr-modal-footer p {
  margin: 0;
}

/* Responsive */
@media (max-width: 968px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .download-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-content {
    padding: 40px 20px 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .legal-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
