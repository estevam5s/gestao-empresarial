<template>
  <footer class="app-footer">
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
            <a href="#" class="social-link" aria-label="LinkedIn" title="LinkedIn">
              <Linkedin :size="20" />
            </a>
            <a href="#" class="social-link" aria-label="GitHub" title="GitHub">
              <Github :size="20" />
            </a>
            <a href="#" class="social-link" aria-label="Instagram" title="Instagram">
              <Instagram :size="20" />
            </a>
            <a href="#" class="social-link" aria-label="YouTube" title="YouTube">
              <Youtube :size="20" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col links-col">
          <h4 class="footer-title">LINKS RÁPIDOS</h4>
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
            BAIXE O APP
          </h4>

          <button @click="downloadAPK" class="download-btn">
            <Download :size="22" />
            <div class="download-info">
              <span class="download-label">Android APK</span>
              <span class="download-version">v{{ appVersion }}</span>
            </div>
          </button>

          <div class="qr-container">
            <button @click="downloadViaQR" class="qr-code" title="Escanear QR Code">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="qr-image" />
              <div v-else class="qr-placeholder">
                <QrCode :size="80" />
              </div>
            </button>
            <span class="qr-label">Escanear QR Code</span>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="contact-item">
              <Mail :size="16" />
              <span>restpedacinhodoceu@gmail.com</span>
            </div>
            <div class="contact-item">
              <Phone :size="16" />
              <span>(48) 3237-7280</span>
            </div>
            <div class="contact-item">
              <MapPin :size="16" />
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
              <Zap :size="12" />
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
            <Smartphone :size="40" class="qr-modal-icon" />
            <h3>Escaneie para Baixar</h3>
            <p>Aponte a câmera do seu celular para o QR Code</p>
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
            <p>📱 Compatível com Android 5.0 ou superior</p>
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
        dark: '#1e293b',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
  }
})

async function downloadAPK() {
  try {
    showNotification('📥 Download iniciado!', 'O arquivo será baixado em instantes...', 'success')

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
    showNotification('⚠️ Atenção', 'Abrindo download em nova aba...', 'warning')
    setTimeout(() => window.open(apkDownloadUrl, '_blank'), 500)
  }
}

function downloadViaQR() {
  showQRModal.value = true
  showNotification('📱 QR Code', 'Escaneie com seu celular', 'info')
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
    bottom: '24px',
    right: '24px',
    backgroundColor: type === 'success' ? '#10b981' :
                     type === 'error' ? '#ef4444' :
                     type === 'warning' ? '#f59e0b' : '#3b82f6',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    zIndex: '99999',
    maxWidth: '360px',
    animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  })

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

const siteName = (import.meta as any).env?.VITE_SITE_NAME || 'GestãoZe System'
const siteDescriptionShort = 'Gestão profissional de estoque e operações para restaurantes'
</script>

<style scoped>
/* Main Footer */
.app-footer {
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  border-top: 1px solid #dee2e6;
  margin-top: 80px;
}

.footer-content {
  max-width: 1400px;
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
  gap: 14px;
  margin-bottom: 20px;
}

.logo-container {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: white;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-title {
  font-size: 22px;
  font-weight: 800;
  color: #212529;
  margin: 0;
  letter-spacing: -0.5px;
}

.brand-description {
  color: #6c757d;
  font-size: 15px;
  line-height: 1.7;
  margin: 0 0 24px 0;
  max-width: 400px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: white;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.social-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.25);
}

/* Links Column */
.footer-title {
  font-size: 13px;
  font-weight: 800;
  color: #212529;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  gap: 12px;
}

.footer-links a {
  color: #6c757d;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.footer-links a::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.footer-links a:hover::before {
  width: 100%;
}

/* Download Column */
.download-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 24px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.download-btn:active {
  transform: translateY(-1px);
}

.download-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.download-label {
  font-size: 15px;
  font-weight: 600;
  opacity: 0.95;
}

.download-version {
  font-size: 12px;
  opacity: 0.75;
  font-weight: 500;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 14px;
  border: 2px solid #e9ecef;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.qr-container:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.qr-code {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.qr-code:hover {
  transform: scale(1.05);
}

.qr-image {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 8px;
}

.qr-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.qr-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 600;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.contact-item svg {
  flex-shrink: 0;
  color: #667eea;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 2px solid #e9ecef;
  padding: 28px 0;
  background: rgba(255, 255, 255, 0.5);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
}

.legal-links a {
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #667eea;
}

.separator {
  color: #dee2e6;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.version-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

/* QR Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 20px;
}

.qr-modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 28px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qr-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 1;
}

.qr-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.qr-modal-header {
  text-align: center;
  padding: 40px 32px 24px;
  color: white;
}

.qr-modal-icon {
  margin: 0 auto 16px;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.qr-modal-header h3 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
}

.qr-modal-header p {
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

.qr-modal-body {
  padding: 0 32px 32px;
}

.qr-code-container {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-image-large {
  width: 260px;
  height: 260px;
  border-radius: 12px;
}

.qr-info {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.qr-info-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  color: white;
}

.qr-info-item strong {
  font-size: 11px;
  opacity: 0.8;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qr-info-item span {
  font-size: 14px;
  font-weight: 700;
}

.qr-download-button {
  width: 100%;
  background: white;
  color: #667eea;
  border: none;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-download-button:hover {
  transform: translateY(-2px);
  background: #f8f9ff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.qr-modal-footer {
  background: rgba(0, 0, 0, 0.25);
  padding: 16px 32px;
  text-align: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
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
    padding: 40px 24px 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .legal-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .qr-modal-content {
    border-radius: 24px;
  }

  .qr-modal-header {
    padding: 36px 24px 20px;
  }

  .qr-modal-body {
    padding: 0 24px 24px;
  }

  .qr-image-large {
    width: 220px;
    height: 220px;
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
