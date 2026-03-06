<template>
  <div class="px-4 py-6">
    <ContentDoc v-slot="{ doc }">
      <article>
        <header class="mb-6">
          <NuxtLink to="/blog" class="text-primary-400 text-sm mb-2 inline-block">← Back</NuxtLink>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs px-2 py-0.5 rounded-full bg-primary-600">{{ doc.category }}</span>
            <span class="text-xs opacity-50">{{ doc.date }}</span>
          </div>
          <h1 class="font-display text-2xl font-bold">{{ doc.title }}</h1>
        </article>
        
        <ContentRenderer :value="doc" class="prose" />
      </article>
    </ContentDoc>
  </div>
</template>
