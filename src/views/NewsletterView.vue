<script setup>
import { computed } from 'vue'
import { newsletter } from '../data/newsletter'

const posts = computed(() => newsletter)
</script>

<template>
  <div class="container py-5 mt-5">

    <div class="row g-4">

      <div
        v-for="post in posts"
        :key="post.slug"
        class="col-md-4"
      >

        <router-link
      :to="`/newsletter/${post.slug}`"
      class="text-decoration-none"
    >

      <div class="article-card p-3 h-100 d-flex flex-column">

        <div class="position-relative mb-3">

          <div class="newsletter-badge">
            Newsletter
          </div>

          <img
            :src="post.image"
            class="img-fluid rounded w-100"
            :alt="post.title"
            style="height: 220px; object-fit: cover;"
          >

        </div>

        <h5 class="mb-1 text-dark fw-bold">
          {{ post.title }}
        </h5>

        <small
          class="text-muted d-block mb-2"
          style="font-size: .75rem;"
        >
          {{ post.date }}
        </small>

        <p
          class="text-muted mb-0"
          style="font-size: .85rem;"
        >
          {{ post.excerpt }}
        </p>

        <div
          class="newsletter-author d-flex align-items-center mt-auto pt-4"
        >

        <div class="author-img me-2 d-flex align-items-center justify-content-center bg-secondary text-white">
  {{ post.author.charAt(0) }}
</div>

          <small
            class="text-muted mb-0"
            style="font-size: .75rem;"
          >
            {{ post.author }}
          </small>

        </div>

      </div>

    </router-link>

      </div>

    </div>

  </div>
</template>

<style scoped>


.newsletter-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #537D5D;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.article-card {
  border: 1px solid #eee;
  border-radius: 12px;
  transition: 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

/* Author image */
.author-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

</style>