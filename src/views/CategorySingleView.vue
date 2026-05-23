<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { newsletter } from '../data/category'

const route = useRoute()

/* -----------------------------------
   GET CURRENT POST
----------------------------------- */
const post = computed(() => {
  if (!newsletter || !route.params.slug) return null

  return (
    newsletter.find(
      item => item.slug === route.params.slug
    ) || null
  )
})

/* -----------------------------------
   TYPE CHECKS
----------------------------------- */
const isMessage = computed(() =>
  post.value?.type?.toLowerCase()?.trim() === 'message'
)

const isArticle = computed(() =>
  post.value?.type?.toLowerCase()?.trim() === 'article'
)

const isNewsletter = computed(() =>
  post.value?.type?.toLowerCase()?.trim() === 'newsletter'
)

/* -----------------------------------
   IMAGE URL
----------------------------------- */
const coverImageUrl = computed(() => {
  if (!post.value?.coverphoto) return null

  if (post.value.coverphoto.startsWith('http')) {
    return post.value.coverphoto
  }

  return `https://gcbf.com.ph${post.value.coverphoto}`
})

/* -----------------------------------
   CLEAN CAPTION
----------------------------------- */
const captionText = computed(() => {
  const raw = post.value?.caption || ''

  return raw
    .replace(/\u00A0/g, '')
    .replace(/&nbsp;/g, '')
    .trim()
})

/* -----------------------------------
   PAGE TITLE
----------------------------------- */
const pageTitle = computed(() => {
  if (!post.value?.title) return 'GCBF'

  return `${post.value.title} | GCBF`
})

/* -----------------------------------
   META DESCRIPTION
----------------------------------- */
const metaDescription = computed(() => {
  return (
    post.value?.excerpt ||
    'Grace Communion Bible Fellowship'
  )
})

/* -----------------------------------
   CURRENT URL
----------------------------------- */
const currentUrl = computed(() => {
  return `https://gcbf.com.ph${route.path}`
})

/* -----------------------------------
   META TAGS
----------------------------------- */
const metaTags = computed(() => {
  const tags = [
    /* BASIC SEO */
    {
      name: 'description',
      content: metaDescription.value
    },

    /* OPEN GRAPH */
    {
      property: 'og:url',
      content: currentUrl.value
    },
    {
      property: 'og:type',
      content: isMessage.value
        ? 'video.other'
        : 'article'
    },
    {
      property: 'og:title',
      content: post.value?.title
    },
    {
      property: 'og:description',
      content: metaDescription.value
    },

    /* ARTICLE META */
    {
      property: 'article:published_time',
      content: post.value?.date
    },
    {
      property: 'article:author',
      content: post.value?.author
    },

    /* TWITTER */
    {
      name: 'twitter:card',
      content: coverImageUrl.value
        ? 'summary_large_image'
        : 'summary'
    },
    {
      name: 'twitter:title',
      content: post.value?.title
    },
    {
      name: 'twitter:description',
      content: metaDescription.value
    }
  ]

  /* IMAGE TAGS */
  if (coverImageUrl.value) {
    tags.push(
      {
        property: 'og:image',
        content: coverImageUrl.value
      },
      {
        property: 'og:image:secure_url',
        content: coverImageUrl.value
      },
      {
        property: 'og:image:width',
        content: '1200'
      },
      {
        property: 'og:image:height',
        content: '630'
      },
      {
        property: 'og:image:type',
        content: 'image/jpeg'
      },
      {
        name: 'twitter:image',
        content: coverImageUrl.value
      }
    )
  }

  /* VIDEO META FOR MESSAGE TYPE */
  if (isMessage.value && post.value?.video) {
    tags.push(
      {
        property: 'og:video',
        content: post.value.video
      },
      {
        property: 'og:video:url',
        content: post.value.video
      },
      {
        property: 'og:video:secure_url',
        content: post.value.video
      },
      {
        property: 'og:video:type',
        content: 'text/html'
      },
      {
        property: 'og:video:width',
        content: '1280'
      },
      {
        property: 'og:video:height',
        content: '720'
      }
    )
  }

  return tags.filter(tag => tag.content)
})

/* -----------------------------------
   HEAD
----------------------------------- */
useHead({
  title: pageTitle,
  meta: metaTags
})
</script>

<template>
  <div v-if="post" class="container">

    <div class="newsletter-wrapper">
<!-- MESSAGE COVER PHOTO -->


      <!-- VIDEO -->
<div
  v-if="post.video && isMessage"
  class="newsletter-video"
>
  <div class="video-wrapper">

    <iframe
      :src="post.video"
      class="newsletter-video-frame"
      frameborder="0"
      allowfullscreen
    ></iframe>

    <!-- CAPTION -->
    <p
      v-if="captionText"
      class="video-caption"
    >
      {{ captionText }}
    </p>

  </div>
</div>

      <!-- DATE -->
      <small
        class="text-muted d-block mb-4 mt-4 text-center meta-date text-uppercase letter-spacing-1"
      >
        {{ post.date }}
      </small>

      <!-- TITLE -->
      <h1 class="newsletter-title text-center mb-5">
        {{ post.title }}
      </h1>

      <!-- FEATURED IMAGE -->
      <div
        v-if="post.coverphoto && !isMessage"
        class="newsletter-featured-image"
      >
        <img
          :src="post.coverphoto"
          class="newsletter-image"
          :alt="post.title"
        >

        <p
          v-if="captionText"
          class="text-muted d-block text-left mt-0 image-caption"
        >
          {{ captionText }}
        </p>
      </div>

      <!-- AUTHOR -->
      <div class="newsletter-author">

        <div class="author-img">
          <img
            :src="post.authorImage"
            :alt="post.author"
            class="author-photo"
          >
        </div>

        <div>
          <small
            class="text-muted d-block author-label"
          >
            {{ isMessage ? 'Message by' : 'Written by' }}
          </small>

          <small
            class="fw-semibold d-block mb-0 author-name"
          >
            {{ post.author }}
          </small>
        </div>

      </div>

      <!-- EXCERPT -->
      <h5 class="text-center mb-4 excerpt">
        {{ post.excerpt }}
      </h5>

      <!-- CONTENT 1 -->
      <div
        class="newsletter-content"
        v-html="post.content1"
      ></div>

      <img
        v-if="post.image1"
        :src="post.image1"
        class="newsletter-image"
        :alt="post.title"
      >

      <!-- CONTENT 2 -->
      <div
        class="newsletter-content"
        v-html="post.content2"
      ></div>

      <!-- GALLERY -->
      <div
        class="newsletter-gallery"
        v-if="post.image4 || post.image5 || post.image6"
      >

        <figure v-if="post.image4">
          <img
            :src="post.image4"
            class="newsletter-image"
            :alt="post.title"
          >
        </figure>

        <figure v-if="post.image5">
          <img
            :src="post.image5"
            class="newsletter-image"
            :alt="post.title"
          >
        </figure>

        <figure v-if="post.image6">
          <img
            :src="post.image6"
            class="newsletter-image"
            :alt="post.title"
          >
        </figure>

      </div>

      <!-- CONTENT 3 -->
      <div
        class="newsletter-content"
        v-html="post.content3"
      ></div>

      <img
        v-if="post.image3"
        :src="post.image3"
        class="newsletter-image"
        :alt="post.title"
      >

      <!-- CONTENT 4 -->
      <div
        class="newsletter-content"
        v-html="post.content4"
      ></div>

      <img
        v-if="post.image2"
        :src="post.image2"
        class="newsletter-image"
        :alt="post.title"
      >

      <!-- CONTENT 5 -->
      <div
        class="newsletter-content"
        v-html="post.content5"
      ></div>

      <!-- CONTENT 6 -->
      <div
        class="newsletter-content"
        v-html="post.content6"
      ></div>

    </div>

  </div>

  <!-- NOT FOUND -->
  <div
    v-else
    class="container py-5 mt-5 text-center"
  >
    <h4 class="text-muted">
      Content not found
    </h4>
  </div>
</template>

<style scoped>
/* MAIN WRAPPER */
.newsletter-wrapper {
  max-width: 860px;
  margin: 0 auto;
  padding: 1rem;
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
  margin-bottom: .5rem;
  color: #1a1a1a;
  letter-spacing: -1px;
}

/* FEATURED IMAGE */
.newsletter-featured-image {
  margin-bottom: 1.75rem;
}

.newsletter-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;

  margin: 1.75rem auto 0;

  border-radius: 5px;

  box-shadow:
    0 14px 35px rgba(0,0,0,0.12);
}

.newsletter-featured-image .newsletter-image {
  max-height: 460px;
  object-fit: cover;
  margin-bottom: 0;
}

.image-caption {
  font-size: .75rem;
  opacity: 0.85;
}

/* AUTHOR */
.newsletter-author {
  display: flex;
  align-items: center;
  gap: .75rem;

  margin-bottom: 3rem;
}

.author-img {
  width: 48px;
  height: 48px;

  overflow: hidden;
  border-radius: 50%;

  flex-shrink: 0;

  box-shadow:
    0 4px 10px rgba(0,0,0,0.08);
}

.author-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.author-label {
  font-size: .75rem;
}

.author-name {
  font-size: .75rem;
  opacity: .65;
}

/* EXCERPT */
.excerpt {
  font-size: 1.25rem;
  font-weight: 500;
}

/* CONTENT */
.newsletter-content {
  max-width: 760px;
  margin: 0 auto;

  font-size: 1.08rem;
  line-height: 1.75;

  color: #595959;

  letter-spacing: .15px;
  word-spacing: .5px;

  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
}

/* GALLERY */
.newsletter-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 14px;

  margin: 2rem 0;
}

.newsletter-gallery img {
  width: 100%;
  height: 220px;

  display: block;

  object-fit: cover;

  border-radius: 14px;

  box-shadow:
    0 10px 24px rgba(0,0,0,0.10);

  transition: transform .25s ease;
}

/* VIDEO */
.newsletter-video {
  width: 100vw;

  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);

  padding: 40px 20px;

  background: #000;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
}

.video-wrapper {
  width: 100%;
  max-width: 900px;
}

.newsletter-video-frame {
  width: 100%;
  aspect-ratio: 16 / 9;

  border: none;
  display: block;
}

/* VIDEO CAPTION */
.video-caption {
  margin-top: 12px;

  font-size: 0.8rem;
  line-height: 1.5;

  color: rgba(255,255,255,0.75);

  text-align: left;
}

/* TABLET + MOBILE */
@media (max-width: 768px) {

  .newsletter-wrapper {
    padding: 0;
  }

  .newsletter-title {
    font-size: 1.8rem;
  }

  .newsletter-content {
    font-size: 1rem;
    line-height: 1.85;
  }

  .newsletter-gallery {
    grid-template-columns: 1fr;
  }

  .newsletter-gallery img {
    height: auto;
  }

  .newsletter-image {
    border-radius: 5px;
  }
}
</style>