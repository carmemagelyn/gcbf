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
            :src="post.coverphoto"
            class="img-fluid rounded w-100"
            :alt="post.title"
            style="height: 220px; object-fit: cover;"
          >

        </div>

        <h6 class="mb-1 text-dark fw-bold">
          {{ post.title }}
        </h6>

        <small
          class="text-muted d-block mb-2"
          style="font-size: .7rem; text-transform: uppercase; letter-spacing: 1px;"
        >
          {{ post.date }}
        </small>

        <p
          class="text-muted mb-0"
          style="font-size: .75rem;"
        >
          {{ post.excerpt }}
        </p>

        <div
          class="newsletter-author d-flex align-items-center mt-auto pt-4"
        >
<div class="author-img">
  <img
    :src="post.authorImage"
    :alt="post.author"
    class="author-photo"
  >
</div>

          <small
            class="text-muted mb-0 ps-2"
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
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  transition: 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

/* Author image */
.author-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.author-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

</style>