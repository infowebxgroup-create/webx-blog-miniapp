<template>
  <div class="px-4 py-6">
    <ContentDoc v-slot="{ doc }">
      <article>
        <header class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-primary-600 text-xs px-2 py-0.5 rounded-full">{{ doc.category }}</span>
            <span class="text-xs text-gray-500">{{ doc.date }}</span>
          </div>
          <h1 class="font-display text-2xl font-bold">{{ doc.title }}</h1>
        </header>
        <ContentRenderer :value="doc" class="prose prose-invert max-w-none" />
      </article>
    </ContentDoc>
  </div>
</template>
