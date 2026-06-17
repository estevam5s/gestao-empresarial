<template>
  <component :is="to ? 'router-link' : 'span'" :to="to" class="brand-logo" :style="{ gap: gap + 'px' }">
    <img src="/logo-round.png" :alt="label" class="brand-logo__img" :style="{ width: size + 'px', height: size + 'px' }" />
    <span v-if="!iconOnly" class="brand-logo__text" :class="{ light }" :style="{ fontSize: textSize + 'px' }">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number; textSize?: number; gap?: number; iconOnly?: boolean; light?: boolean; label?: string; to?: string
}>(), { size: 38, textSize: 21, gap: 10, iconOnly: false, light: false, label: 'GestãoZe', to: '' })
</script>

<style scoped>
.brand-logo { display: inline-flex; align-items: center; text-decoration: none; }
.brand-logo__img { border-radius: 50%; object-fit: cover; box-shadow: 0 2px 10px rgba(13, 148, 136, .28); flex-shrink: 0; }
.brand-logo__text { font-weight: 800; letter-spacing: -.02em; background: linear-gradient(135deg, #16a34a, #0d9488); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.brand-logo__text.light { background: none; -webkit-text-fill-color: #fff; color: #fff; }
</style>
