<template>
  <div class="auth">
    <!-- Painel da marca -->
    <aside class="brand-panel">
      <div class="grid-overlay"></div>
      <span class="orb orb-1"></span>
      <span class="orb orb-2"></span>

      <div class="brand-top">
        <BrandLogo to="/" :size="44" :text-size="24" light />
      </div>

      <div class="brand-mid">
        <div class="logo-hero"><img src="/logo-round.png" alt="GestãoZe" /></div>
        <h2>{{ tagline }}</h2>
        <p>Estoque, financeiro, equipe, cardápio, relatórios e IA — numa só plataforma, em português.</p>
        <ul class="perks">
          <li><span>✓</span> 7 dias grátis</li>
          <li><span>✓</span> Sem cartão</li>
          <li><span>✓</span> Cancele quando quiser</li>
        </ul>
      </div>

      <div class="brand-foot">
        <router-link to="/legal/terms">Termos</router-link>
        <router-link to="/legal/privacy">Privacidade</router-link>
        <router-link to="/faq">Ajuda</router-link>
      </div>
    </aside>

    <!-- Área do formulário -->
    <main class="form-area">
      <router-link to="/" class="mobile-brand"><BrandLogo :size="40" :text-size="22" /></router-link>
      <div class="form-card">
        <div class="form-head">
          <h1>{{ title }}</h1>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from '@/components/BrandLogo.vue'
withDefaults(defineProps<{ title: string; subtitle?: string; tagline?: string }>(), {
  subtitle: '', tagline: 'Venda e gerencie com processo, não com planilha.',
})
</script>

<style scoped>
.auth { min-height: 100vh; display: grid; grid-template-columns: 1.05fr 1fr; font-family: 'Inter', system-ui, sans-serif; }
.brand-panel { position: relative; overflow: hidden; padding: 48px; color: #fff; display: flex; flex-direction: column; justify-content: space-between;
  background: linear-gradient(150deg, #0f766e 0%, #15803d 45%, #166534 100%); }
.grid-overlay { position: absolute; inset: 0; opacity: .08; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 26px 26px; }
.orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
.orb-1 { width: 320px; height: 320px; background: rgba(52,211,153,.45); top: -60px; right: -40px; }
.orb-2 { width: 380px; height: 380px; background: rgba(13,148,136,.4); bottom: -90px; left: -60px; }
.brand-top, .brand-mid, .brand-foot { position: relative; z-index: 2; }
.brand-mid { max-width: 420px; }
.logo-hero img { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,.85); box-shadow: 0 12px 40px rgba(0,0,0,.25); margin-bottom: 26px; animation: float 5s ease-in-out infinite; }
@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
.brand-mid h2 { font-size: 34px; font-weight: 800; line-height: 1.18; letter-spacing: -.02em; }
.brand-mid p { margin-top: 16px; font-size: 16px; color: rgba(255,255,255,.85); line-height: 1.6; }
.perks { list-style: none; padding: 0; margin: 28px 0 0; display: flex; gap: 22px; flex-wrap: wrap; }
.perks li { display: flex; align-items: center; gap: 7px; font-size: 14px; color: rgba(255,255,255,.9); }
.perks span { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,.18); font-size: 12px; }
.brand-foot { display: flex; gap: 22px; font-size: 13px; }
.brand-foot a { color: rgba(255,255,255,.7); text-decoration: none; }
.brand-foot a:hover { color: #fff; }
.form-area { display: flex; align-items: center; justify-content: center; padding: 32px 24px; background: #f8fafc; }
.mobile-brand { display: none; margin-bottom: 26px; }
.form-card { width: 100%; max-width: 420px; }
.form-head { text-align: center; margin-bottom: 28px; }
.form-head h1 { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
.form-head p { margin-top: 8px; color: #64748b; font-size: 14.5px; }
@media (max-width: 900px) {
  .auth { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
  .mobile-brand { display: inline-flex; justify-content: center; width: 100%; }
}
</style>
