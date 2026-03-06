<template>
  <div class="px-4 py-6">
    <ContentDoc v-slot="{ doc }">
      <article>
        <header class="mb-6">
          <NuxtLink to="/blog" class="text-primary-400 text-sm mb-2 inline-block">← Back</NuxtLink>
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-primary-600 text-xs px-2 py-0.5 rounded-full">{{ doc.category }}</span>
            <span class="text-xs text-gray-500">{{ doc.date }}</span>
          </div>
          <h1 class="font-display text-2xl font-bold">{{ doc.title }}</h1>
          <p v-if="doc.description" class="text-gray-400 mt-2">{{ doc.description }}</p>
        </header>
        
        <!-- Bilingual Content Layout -->
        <div class="relative">
          <!-- Vertical Divider -->
          <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent hidden lg:block"></div>
          
          <div class="grid lg:grid-cols-2 gap-6">
            <!-- Russian (Original) -->
            <div class="prose prose-invert max-w-none">
              <ContentRenderer :value="doc" class="russian-content" />
            </div>
            
            <!-- English (Translation) -->
            <div class="prose prose-invert max-w-none opacity-80 hidden lg:block">
              <div class="border-t border-primary-500/30 pt-4 lg:border-t-0 lg:pt-0">
                <h3 class="text-primary-400 text-sm font-semibold mb-4 flex items-center gap-2">
                  <span>🇬🇧</span> English Translation
                </h3>
                <ContentRenderer v-if="doc.translation" :value="doc.translation" />
                <p v-else class="text-gray-500 italic">Translation coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </ContentDoc>
  </div>
</template>

<style>
.russian-content {
  font-size: 1.1rem;
  line-height: 1.8;
}
</style>
