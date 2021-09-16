<template>
  <div class="settings">
    <div class="cities">
      <div class="city"
           v-for="(city, index) in cities"
           :key="index"
           :draggable="true"
           @dragstart="dragStartItem($event, city)"
           @dragend="dragEndItem"
           @dragenter="dragEnterItem(city)"
           @dragover="dragOverItem"
           @dragleave="dragLeaveItem"
           @drop="dropItem($event, city)">
        <div class="city-handle" />
        <div class="city-name">{{ city.name }}</div>
        <div class="city-remove"
             v-if="cities.length > 1"
             @click="removeCity(city.id)" />
      </div>
    </div>

    <form class="city-form" @submit.prevent="addCity">
      <label class="city-form-title" for="text">Add Location</label>
      <input :class="['city-form-input', { error }]"
             type="text"
             id="text"
             v-model="cityName"
             @focus="hideError">
      <button class="city-form-btn" type="submit" />
      <span v-if="error" class="city-form-error">{{ error }}</span>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex';
import { ICity } from '@/types';

@Component({
  computed: {
    ...mapState('weather', [
      'error',
    ]),
    ...mapGetters('weather', [
      'cities',
    ]),
  },
})
export default class Settings extends Vue {
  cityName = '';

  itemDrop = -1;

  itemOver = -1;

  addCity(): void {
    if (!this.cityName) return;
    this.$store.dispatch('weather/addCity', this.cityName);
    this.cityName = '';
  }

  removeCity(id: string): void {
    this.$store.dispatch('weather/removeCity', id);
  }

  hideError(): void {
    this.$store.dispatch('weather/hideError');
  }

  dragStartItem(event: DragEvent, item: ICity): void {
    event.dataTransfer!.effectAllowed = 'move';
    this.itemDrop = item.id;
  }

  dragEnterItem(item: ICity): void {
    this.itemOver = item.id;
  }

  dragOverItem(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  async dropItem(event: DragEvent, item: ICity): Promise<void> {
    event.dataTransfer!.dropEffect = 'move';
    if (item.id === this.itemDrop) return;
    await this.updateItemSort(item);
  }

  dragLeaveItem(): void {
    this.itemOver = -1;
  }

  dragEndItem(): void {
    this.itemDrop = -1;
    this.itemOver = -1;
  }

  async updateItemSort(item: ICity): Promise<void> {
    await this.$store.dispatch('weather/updateItemSort', {
      itemBefore: item.id,
      itemAfter: this.itemDrop,
    });
  }
}
</script>

<style lang="scss">
  $city-bg: #f2f2f2 !default;
  $city-border-radius: 3px !default;
  $city-box-shadow: 0 1px 3px rgba(#000000, .25) !default;
  $city-color: #48484a !default;
  $icon-handle: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3e%3cpath d='M3 6h18M3 12h18M3 18h18' fill='none' stroke='%2348484a' stroke-width='2' stroke-linecap='round'/%3e%3c/svg%3e") !default;
  $icon-remove: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3e%3cpath d='M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2m-2 5v6m-4-6v6M3 6h18m-2 1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7' fill='none' stroke='%2348484a' stroke-width='2' stroke-linecap='round'/%3e%3c/svg%3e") !default;
  $icon-enter: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3e%3cpath d='M20 4v7a4 4 0 0 1-4 4H5m4 5-5-5 5-5' fill='none' stroke='%2348484a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e") !default;
  $input-normal-bg: #ffffff !default;
  $input-normal-border: 1px solid #ced4da !default;
  $input-normal-color: #495057 !default;
  $input-focus-bg: #ffffff !default;
  $input-focus-border-color: #80bdff !default;
  $input-focus-box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .25) !default;
  $input-focus-color: #495057 !default;
  $error-color: #cc0000 !default;

  .settings {
    padding: 10px;
  }

  .city {
    background-color: $city-bg;
    border-radius: $city-border-radius;
    box-shadow: $city-box-shadow;
    color: $city-color;
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 10px;
    padding: 7px 10px;

    &-handle {
      background-image: $icon-handle;
      cursor: move;
      flex: 0 0 24px;
      height: 24px;
      width: 24px;
    }

    &-name {
      font-weight: 600;
      line-height: 24px;
      flex-grow: 1;
      padding: 0 10px;
    }

    &-remove {
      background-image: $icon-remove;
      cursor: pointer;
      flex: 0 0 24px;
      height: 24px;
      width: 24px;
    }
  }

  .city-form {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;

    &-title {
      flex: 1 0 100%;
      font-weight: 600;
      line-height: 30px;
    }

    &-input {
      background-clip: padding-box;
      background-color: $input-normal-bg;
      border-radius: .25rem;
      border: $input-normal-border;
      color: $input-normal-color;
      display: block;
      flex: 1 0 calc(100% - 43px);
      font-size: 1rem;
      font-weight: 400;
      height: calc(1.5em + .75rem + 2px);
      line-height: 1.5;
      padding: .375rem .75rem;
      transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
      width: 100%;

      &:focus {
        background-color: $input-focus-bg;
        border-color: $input-focus-border-color;
        box-shadow: $input-focus-box-shadow;
        color: $input-focus-color;
        outline: 0;
      }

      &.error {
        border-color: $error-color;
        box-shadow: 0 0 0 .2rem rgba($error-color, .25);
        color: $error-color;
      }
    }

    &-btn {
      background-color: transparent;
      background-image: $icon-enter;
      background-position: 50%;
      background-repeat: no-repeat;
      cursor: pointer;
      border: none;
      flex: 0 0 38px;
      height: 38px;
      margin-left: 5px;
      width: 38px;
    }

    &-error {
      color: $error-color;
      display: block;
      font-size: 12px;
      line-height: 20px;
    }
  }
</style>
