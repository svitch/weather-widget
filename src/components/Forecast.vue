<template>
  <div class="forecast" v-if="weather">
    <div class="forecast-city">{{ weather.name }}</div>
    <div class="forecast-icon"><img class="icon" :src="weather.image" alt /></div>
    <div class="forecast-temperature" v-html="weather.temperature"/>
    <div class="forecast-description" v-html="weather.description"/>
    <div class="forecast-text">Wind: <span class="value">{{ weather.wind }}</span></div>
    <div class="forecast-text">Clouds: <span class="value">{{ weather.clouds }}</span></div>
    <div class="forecast-text">Pressure: <span class="value">{{ weather.pressure }}</span></div>
    <div class="forecast-text">Humidity: <span class="value">{{ weather.humidity }}</span></div>
    <div class="forecast-text">Visibility: <span class="value">{{ weather.visibility }}</span></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IWeatherForecast, IWeather } from '@/types';
import { getDirection } from '@/helpers';
import { OWM } from '@/enums';

@Component
export default class Forecast extends Vue {
  @Prop() city!: string;

  weather: IWeather | null = null;

  async created(): Promise<void> {
    const { city } = this;
    if (!city) return;

    const data: IWeatherForecast = await this.$store.dispatch('weather/getWeather', city);
    const feels = `Feels like ${data.main.feels_like}&deg;C.`;
    const text = data.weather[0].description;

    this.weather = {
      name: `${data.name} ${data.sys.country}`,
      image: `${OWM.URL}/img/wn/${data.weather[0].icon}@2x.png`,
      temperature: `${Math.round(data.main.temp)}&deg;C`,
      description: `${feels} ${text.charAt(0).toUpperCase() + text.slice(1)}`,
      wind: `${data.wind.speed}m/s ${getDirection(data.wind.deg)}`,
      clouds: `${data.clouds.all}%`,
      pressure: `${data.main.pressure} hPa`,
      humidity: `${data.main.humidity}%`,
      visibility: data.visibility > 1000
        ? `${(data.visibility / 1000).toFixed(1)} km`
        : `${data.visibility} m`,
    };
  }
}
</script>

<style scoped lang="scss">
  $forecast-bg: #ffffff !default;
  $forecast-border-radius: 4px !default;
  $forecast-box-shadow: 0 1px 4px rgba(#000000, .25) !default;
  $forecast-color: #48484a !default;

  .forecast {
    align-items: center;
    background-color: $forecast-bg;
    border-radius: $forecast-border-radius;
    box-shadow: $forecast-box-shadow;
    color: $forecast-color;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 1.5rem;

    &-city {
      flex: 1 0 100%;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: .25rem;
    }

    &-icon {
      align-items: center;
      display: flex;
      flex: 0 0 50%;
      justify-content: center;

      img {
        display: block;
        outline: none;
        user-select: none;
      }
    }

    &-temperature {
      align-items: center;
      display: flex;
      flex: 0 0 50%;
      font-size: 2.5rem;
      font-weight: 700;
      justify-content: flex-start;
    }

    &-description {
      flex: 0 0 100%;
      margin-top: 1rem;
    }

    &-text {
      flex: 1 0 60%;
      margin-top: 1rem;

      &:nth-child(even) {
        flex: 0 1 40%;
      }
    }

    .value {
      font-weight: 700;
    }
  }
</style>
