// .vitepress/theme/components/BlogList.vue
<script setup>
import { useData } from 'vitepress'
import { ref, computed } from 'vue'

const { page } = useData()
const selectedTag = ref(null)

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}

const filteredPosts = computed(() => {
  if (!page.value?.posts) return []
  let posts = page.value.posts.filter(post => post.frontmatter.title)
  if (selectedTag.value) {
    posts = posts.filter(post => post.frontmatter.tags?.includes(selectedTag.value))
  }
  return posts
})

const tags = computed(() => {
  if (!page.value?.tags) return []
  return Object.keys(page.value.tags)
})

function selectTag(tag) {
  selectedTag.value = selectedTag.value === tag ? null : tag
}
</script>

<template>
  <div class="blog-list">
    <!-- Tags filter -->
    <div class="tags-container" v-if="tags.length">
      <span class="tag-label">Filter by tag:</span>
      <div class="tags-list">
        <button v-for="tag in tags" :key="tag" class="tag-button" :class="{ active: selectedTag === tag }"
          @click="selectTag(tag)">
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Posts list -->
    <div v-for="post in filteredPosts" :key="post.url" class="blog-post">
      <a :href="post.url" class="post-title">
        <h2>{{ post.frontmatter.title }}</h2>
      </a>
      <div class="post-meta" v-if="formatDate(post.frontmatter.date)">
        <time>{{ formatDate(post.frontmatter.date) }}</time>
        <span v-if="post.frontmatter.tags?.length" class="post-tags">
          • Tags:
          <button v-for="tag in post.frontmatter.tags" :key="tag" class="post-tag" @click.prevent="selectTag(tag)">
            {{ tag }}
          </button>
        </span>
      </div>
      <p v-if="post.frontmatter.description" class="post-description">
        {{ post.frontmatter.description }}
      </p>
    </div>

    <!-- No posts message -->
    <div v-if="filteredPosts.length === 0" class="no-posts">
      No posts found{{ selectedTag ? ` for tag "${selectedTag}"` : '' }}
    </div>
  </div>
</template>

<style scoped>
.blog-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tags-container {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.tag-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-2);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 9999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-button:hover {
  background: var(--vp-c-brand-dimm);
}

.tag-button.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.blog-post {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.blog-post:last-child {
  border-bottom: none;
}

.post-title {
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.post-title h2 {
  margin: 0;
  font-size: 1.5rem;
}

.post-meta {
  margin-top: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.post-tags {
  display: inline-block;
  margin-left: 0.5rem;
}

.post-tag {
  margin-right: 0.5rem;
  padding: 0.2rem 0.5rem;
  border: none;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.post-tag:hover {
  background-color: var(--vp-c-brand-dimm);
}

.post-description {
  margin-top: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.no-posts {
  text-align: center;
  color: var(--vp-c-text-2);
  font-style: italic;
  padding: 2rem;
}
</style>