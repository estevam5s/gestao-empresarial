<template>
  <div v-if="offer && !dismissed" class="offer-banner" :style="{ background: offer.bg_color || '#16a34a' }">
    <div class="ob-inner">
      <span class="ob-badge" v-if="offer.discount_label">{{ offer.discount_label }}</span>
      <strong>{{ offer.title }}</strong>
      <span class="ob-desc">{{ offer.description }}</span>
      <span v-if="offer.coupon_code" class="ob-code">Cupom: <b>{{ offer.coupon_code }}</b></span>
      <span v-if="countdown" class="ob-timer">⏳ {{ countdown }}</span>
      <router-link to="/pricing" class="ob-cta">Ver planos →</router-link>
    </div>
    <button class="ob-close" @click="dismiss" aria-label="Fechar">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/config/supabase'

const offer = ref<any>(null)
const dismissed = ref(false)
const countdown = ref('')
let timer: any = null

function tick() {
  if (!offer.value?.ends_at) { countdown.value = ''; return }
  const diff = new Date(offer.value.ends_at).getTime() - Date.now()
  if (diff <= 0) { offer.value = null; return }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  countdown.value = d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`
}

function dismiss() {
  dismissed.value = true
  if (offer.value) sessionStorage.setItem('offer_dismissed', offer.value.id)
}

onMounted(async () => {
  const { data } = await supabase.from('offers').select('*')
    .eq('active', true).order('created_at', { ascending: false }).limit(1)
  const o = data?.[0]
  if (o && (!o.ends_at || new Date(o.ends_at).getTime() > Date.now())) {
    if (sessionStorage.getItem('offer_dismissed') === o.id) return
    offer.value = o
    tick(); timer = setInterval(tick, 1000)
  }
})
onUnmounted(() => timer && clearInterval(timer))
</script>

<style scoped>
.offer-banner { position: relative; color: #fff; text-align: center; padding: 9px 44px; font-size: 14px; }
.ob-inner { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
.ob-badge { background: rgba(255,255,255,.22); padding: 2px 9px; border-radius: 999px; font-weight: 800; font-size: 12px; }
.ob-desc { opacity: .9; }
.ob-code { background: rgba(255,255,255,.15); padding: 2px 10px; border-radius: 6px; }
.ob-timer { font-variant-numeric: tabular-nums; font-weight: 700; }
.ob-cta { color: #fff; font-weight: 800; text-decoration: underline; }
.ob-close { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: 0; color: #fff; font-size: 22px; line-height: 1; cursor: pointer; opacity: .8; }
.ob-close:hover { opacity: 1; }
@media (max-width: 640px) { .ob-desc { display: none; } }
</style>
