<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { newsletter } from '../data/newsletter'

const route = useRoute()

const post = computed(() => {
  return newsletter.find(
    item => item.slug === route.params.slug
  )
})
</script>

<template>
  <div v-if="post" class="container py-5 mt-5">

  <div class="newsletter-wrapper">

    <!-- Meta -->
    <small class="text-muted d-block mb-2 text-center meta-date">
      {{ post.date }}
    </small>

    <!-- Title -->
    <h1 class="newsletter-title text-center">
      {{ post.title }}
    </h1>

    <!-- Featured Image -->
    <img
      :src="post.image"
      class="newsletter-image"
      :alt="post.title"
    >

    <!-- Author -->
    <div class="newsletter-author">

      <div class="author-img d-flex align-items-center justify-content-center bg-secondary text-white">
        {{ post.author.charAt(0) }}
      </div>

      <div>
        <small class="text-muted d-block author-label">
          Written by
        </small>

        <small class="fw-semibold">
          {{ post.author }}
        </small>
      </div>

    </div>

    <!-- Content -->
    <div
      class="newsletter-content"
      v-html="post.content"
    ></div>

  </div>

</div>



  <!-- Fallback if not found -->
  <div v-else class="container py-5 mt-5 text-center">
    <h4 class="text-muted">Newsletter not found</h4>
  </div>
</template>
<style scoped>
/* MAIN CENTER WRAPPER */
.newsletter-wrapper {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* DATE */
.meta-date {
  font-size: 0.8rem;
}

/* TITLE */
.newsletter-title {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 2rem;
  color: #1a1a1a;
  letter-spacing: -1px;
  
}

/* FEATURED IMAGE */
.newsletter-image {
  width: 100%;
  max-height: 460px;
  object-fit: cover;
  border-radius: 18px;
  margin-bottom: 2rem;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
}

/* AUTHOR */
.newsletter-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.author-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
}

.author-label {
  font-size: 0.75rem;
}

/* CONTENT */
.newsletter-content {
  max-width: 760px;
  margin: 0 auto;

  font-size: 1.08rem;
  line-height: 1.95;
  color: #2b2b2b;

  font-family: system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  letter-spacing: 0.15px;
  word-spacing: 0.5px;
}

/* MOBILE */
@media (max-width: 768px) {
  .newsletter-wrapper {
    padding: 0 0.75rem;
  }

  .newsletter-title {
    font-size: 1.8rem;
  }

  .newsletter-image {
    border-radius: 14px;
  }

  .newsletter-content {
    font-size: 1rem;
    line-height: 1.85;
  }
}
</style>