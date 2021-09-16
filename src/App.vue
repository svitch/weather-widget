<template>
  <div id="app">
    <div class="forecast-list">
      <button :class="['settings-btn', { close: !!settingsOpened }]"
              type="button"
              @click="toggleSettings" />
      <Settings v-if="settingsOpened" />
      <template v-else>
        <template v-if="cities.length">
          <Forecast v-for="({ name }, index) of cities" :key="index" :city="name" />
        </template>
        <div class="loading" v-else>Loading data...</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Settings from './components/Settings.vue';
import Forecast from './components/Forecast.vue';

@Component({
  components: {
    Settings,
    Forecast,
  },
  computed: {
    ...mapGetters('weather', [
      'cities',
    ]),
  },
})
export default class App extends Vue {
  settingsOpened = false;

  toggleSettings(): void {
    this.settingsOpened = !this.settingsOpened;
  }

  created(): void {
    this.$store.dispatch('weather/getCities');
  }
}
</script>

<style lang="scss">
  $base-bg: #ffffff !default;
  $base-font-color: #1d1d1d !default;
  $base-font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    "Noto Sans", "Liberation Sans", sans-serif !default;
  $base-font-size: 14px !default;
  $loading-bg-color: #f2f2f2 !default;
  $loading-bg-image: linear-gradient(135deg, rgba(#fff,.5) 25%, transparent 25%, transparent 50%,
    rgba(#fff,.5) 50%, rgba(#fff,.5) 75%, transparent 75%, transparent) !default;
  $icon-settings: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3e%3cpath d='m10 1-.7 2.4-1.5.7-2.2-1.3-2.8 2.8 1.3 2.2-.7 1.5L1 10v4l2.4.7.7 1.5-1.3 2.2 2.8 2.8 2.2-1.3 1.5.7.7 2.4h4l.7-2.4 1.5-.7 2.2 1.3 2.8-2.8-1.3-2.2.7-1.5L23 14v-4l-2.4-.7-.6-1.5 1.2-2.2-2.8-2.8L16.2 4l-1.5-.6L14 1Zm2 8a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z' fill='none' stroke='%2348484a' stroke-width='2' stroke-linejoin='round'/%3e%3c/svg%3e") !default;
  $icon-close: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3e%3cpath fill='none' stroke='%2348484a' stroke-width='2' stroke-linecap='round' d='m6 6 12 12m0-12L6 18' /%3e%3c/svg%3e") !default;

  @keyframes progress-stripes {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1rem 0;
    }
  }

  *, ::before, ::after {
    box-sizing: border-box;
  }

  body {
    background-color: $base-bg;
    color: $base-font-color;
    font-family: $base-font-family;
    font-size: $base-font-size;
    margin: 0;
  }

  .forecast-list {
    margin-left: auto;
    margin-right: auto;
    max-width: 320px;
    padding-top: 40px;
    position: relative;
  }

  .settings-btn {
    background-color: transparent;
    background-image: $icon-settings;
    border: none;
    cursor: pointer;
    flex: 0 0 24px;
    height: 24px;
    position: absolute;
    right: 0;
    top: 15px;
    width: 24px;
    z-index: 1;

    &.close {
      background-image: $icon-close;
    }
  }

  .loading {
    animation: 1s linear infinite progress-stripes;
    background-color: $loading-bg-color;
    background-image: $loading-bg-image;
    background-size: 1rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    line-height: 24px;
    flex-grow: 1;
    margin-top: 1rem;
    padding: 7px 12px;
  }
</style>
