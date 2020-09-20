<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- <div class="col-12 col-sm-8"> -->
      <div class="q-pa-md q-gutter-md row items-start">
        <template v-if="!loadingProducts && products.length">
          <q-card class="my-card" v-for="post in products" :key="post.id" bordered flat>
            <q-img :src="post.imageUrl">
              <div class="absolute-bottom">
                <div class="text-h6">{{ post.location }}</div>
                <div class="text-subtitle2">{{post.name }}</div>
              </div>
            </q-img>

            <q-card-actions>
              <q-btn flat>Buy Now</q-btn>
              <q-btn flat>Add to Cart</q-btn>
            </q-card-actions>
          </q-card>
          <!-- <q-card v-for="post in posts" :key="post.id" class="card-post q-mb-md" bordered flat>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">danny__connell</q-item-label>
                <q-item-label caption>{{ post.location }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img :src="post.imageUrl" />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
            </q-card-section>
          </q-card> -->
        </template>
        <template v-else-if="!loadingProducts && !products.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>
        <template v-else>
          <q-card flat bordered v-for="val in skeleton" class="skeleton-card" :key="val.id">
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" animation="fade" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-skeleton height="100px" square animation="fade" />

              <q-card-section>
                <q-skeleton type="text" class="text-subtitle2" animation="fade" />
                <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
              </q-card-section>
            </q-card>
        </template>
      </div>
      <!-- <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">danny__connell</q-item-label>
            <q-item-label caption>Danny Connell</q-item-label>
          </q-item-section>
        </q-item>
      </div> -->
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
export default {
  name: "Home",
  data() {
    return {
      products: [],
      loadingProducts: false,
      skeleton: [{id: 1},{id: 2},{id: 3},{id: 4},{id: 5},{id: 6},{id: 7},{id: 8},{id: 9},{id: 10}]
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      this.loadingProducts = true;
      this.$axios
        .get(`${process.env.API}/api/products`)
        .then((res) => {
          this.products = res.data;
          this.loadingProducts = false;
        })
        .catch((err) => {
          this.$q.dialog({
            title: "Error",
            message: err.message,
          });
          this.loadingProducts = false;
        });
    },
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    },
  },
};
</script>

<style lang="scss">
.skeleton-card{
  width: 45%;
    @media (min-width: $breakpoint-sm-min){
        width: 18%;
    }
}
.my-card.q-card {
    max-width: 45%;
    .q-btn-item{
      margin-left: 0px;
    }
}
.card-post {
  .q-img {
    height: 400px;
  }
}
</style>
