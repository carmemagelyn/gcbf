<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { newsletter } from '../data/newsletter'

const route = useRoute()

const post = computed(() => {
  return newsletter.find(
    item => item.slug === route.params.slug
  )
})

useHead({
  title: post.value?.title,
  meta: [
    {
      property: 'og:title',
      content: post.value?.title
    },
    {
      property: 'og:description',
      content: post.value?.excerpt
    },
    {
      property: 'og:image',
      content: `https://gcbf.com.ph${post.value?.coverphoto}`
    }
  ]
})

</script>

<template>
  <div v-if="post" class="container py-5 mt-4">

  <div class="newsletter-wrapper">

    <!-- Meta -->
    <small class="text-muted d-block mb-2 text-center meta-date text-uppercase letter-spacing-1">
      {{ post.date }}
    </small>

    <!-- Title -->
    <h1 class="newsletter-title text-center">
      {{ post.title }}
    </h1>

    <!-- Featured Image -->
    <img
      :src="post.coverphoto"
      class="newsletter-image"
      :alt="post.title"
    >
 
        <p small class="text-muted d-block text-left mt-0" style="font-size: .75rem; opacity: 0.85;">
            {{ post.caption }}
        </p>


    <!-- Author -->
    <div class="newsletter-author">

<div class="author-img">
  <img
    :src="post.authorImage"
    :alt="post.author"
    class="author-photo"
  >
</div>

      <div>
        <small class="text-muted d-block author-label" style="font-size: .7rem; opacity: 0.85;">
          Written by
        </small>

        <small class="fw-semibold d-block mb-0" style="font-size: .75rem;opacity: 0.65">
          {{ post.author }}
        </small>
      </div>

    </div>

    <!-- Content -->

    <div
      class="newsletter-content"
      v-html="post.content1"
    ></div>
     <img
      :src="post.image1"
      class="newsletter-image"
      :alt="post.title"
    >
    
 <div
      class="newsletter-content"
      v-html="post.content2"
    ></div>
 <div class="newsletter-gallery">

  <figure>
    <img
      :src="post.image4"
      class="newsletter-image"
      :alt="post.title"
    >
  </figure>

  <figure>
     <img
      :src="post.image5"
      class="newsletter-image"
      :alt="post.title"
    >
  </figure>

  <figure>
    <img
      :src="post.image6"
      class="newsletter-image"
      :alt="post.title"
    >
  </figure>

</div>
 <div
      class="newsletter-content"
      v-html="post.content3"
    ></div>
  <img
      :src="post.image3"
      class="newsletter-image"
      :alt="post.title"
    >
        <div
      class="newsletter-content"
      v-html="post.content4"
    ></div>
 <img
      :src="post.image2"
      class="newsletter-image"
      :alt="post.title"
    >
        <div
      class="newsletter-content"
      v-html="post.content5"
    ></div>
    
        <div
      class="newsletter-content"
      v-html="post.content6"
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
  border-radius: 5px;
  margin-bottom: 0rem;
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
  width: 48px;
  height: 48px;
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

.author-label {
  font-size: 0.75rem;
}

/* CONTENT */
.newsletter-content {
  max-width: 760px;
  margin: 0 auto;

  font-size: 1.08rem;
  line-height: 1.75;
  color: #595959;
  

  font-family: system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  letter-spacing: 0.15px;
  word-spacing: 0.5px;
}

/* 3-image gallery */
.newsletter-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  margin: 2rem 0;
}

/* gallery images */
.newsletter-gallery img {
  width: 100%;
  height: 220px;

  object-fit: cover;

  border-radius: 14px;
  display: block;

  box-shadow: 0 10px 24px rgba(0,0,0,0.10);

  transition: transform 0.25s ease;
}


/* mobile */
@media (max-width: 768px) {
  .newsletter-gallery {
    grid-template-columns: 1fr;
  }

  .newsletter-gallery img {
    height: auto;
  }
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
    border-radius: 5px;
  }

  .newsletter-content {
    font-size: 1rem;
    line-height: 1.85;
  }




}
</style>