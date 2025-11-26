<template>
  <div class="contact-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-text">GestaoZe</router-link>
        <router-link to="/" class="btn btn-outline">← Voltar</router-link>
      </div>
    </nav>

    <section class="contact-hero">
      <h1>Entre em contato</h1>
      <p>Estamos aqui para ajudar. Envie sua mensagem e retornaremos em breve.</p>
    </section>

    <section class="contact-content">
      <div class="contact-grid">
        <!-- Formulário -->
        <div class="contact-form-section">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nome *</label>
                <input v-model="formData.name" type="text" required>
              </div>

              <div class="form-group">
                <label>Email *</label>
                <input v-model="formData.email" type="email" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Telefone</label>
                <input v-model="formData.phone" type="tel">
              </div>

              <div class="form-group">
                <label>Empresa</label>
                <input v-model="formData.company" type="text">
              </div>
            </div>

            <div class="form-group">
              <label>Assunto *</label>
              <select v-model="formData.subject" required>
                <option value="">Selecione...</option>
                <option>Dúvidas sobre planos</option>
                <option>Suporte técnico</option>
                <option>Parceria</option>
                <option>Feedback</option>
                <option>Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label>Mensagem *</label>
              <textarea v-model="formData.message" rows="6" required></textarea>
            </div>

            <div v-if="success" class="success-message">
              Mensagem enviada com sucesso! Retornaremos em breve.
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">Enviar mensagem</span>
              <span v-else">Enviando...</span>
            </button>
          </form>
        </div>

        <!-- Info de contato -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-icon">📧</div>
            <h3>Email</h3>
            <p>contato@gestaozе.com.br</p>
            <p class="info-note">Respondemos em até 24h</p>
          </div>

          <div class="info-card">
            <div class="info-icon">💬</div>
            <h3>Chat</h3>
            <p>Atendimento online</p>
            <p class="info-note">Seg-Sex, 9h-18h</p>
          </div>

          <div class="info-card">
            <div class="info-icon">📱</div>
            <h3>WhatsApp</h3>
            <p>(11) 99999-9999</p>
            <p class="info-note">Suporte via WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    // Importar o serviço de registro
    const { registrationService } = await import('@/services/registrationService')

    // Enviar mensagem de contato
    const result = await registrationService.submitContactMessage({
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      company: formData.value.company,
      subject: formData.value.subject,
      message: formData.value.message
    })

    if (!result.success) {
      error.value = result.error || 'Erro ao enviar mensagem. Tente novamente.'
      return
    }

    success.value = true
    formData.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    }
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err)
    error.value = 'Erro ao enviar mensagem. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  background: #f7fafc;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-hero {
  padding: 60px 2rem;
  text-align: center;
  background: white;
}

.contact-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.contact-hero p {
  font-size: 1.25rem;
  color: #718096;
}

.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.contact-form {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.success-message {
  background: #c6f6d5;
  color: #22543d;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.info-card p {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.info-note {
  color: #718096 !important;
  font-weight: 400 !important;
  font-size: 0.9rem;
}

@media (max-width: 968px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-hero h1 {
    font-size: 2rem;
  }
}
</style>
