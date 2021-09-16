import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { getData } from '@/api';
import { ICity, IWeatherForecast, IWeatherState } from '@/types';
import { OWM } from '@/enums';

const data: IWeatherState = {
  cities: [],
  defaultCity: [{ id: 0, name: OWM.DEFAULT_CITY, sort: 0 }],
  maxCities: 10,
  weather: [],
  error: null,
};

const getters: GetterTree<IWeatherState, any> = {
  cities(state) {
    return state.cities.length
      ? state.cities.sort((a: ICity, b: ICity) => a.sort - b.sort)
      : [];
  },
};

const mutations: MutationTree<IWeatherState> = {
  setCities(state, cities) {
    state.cities = cities;
  },
  setWeather(state, weather) {
    state.weather = weather;
  },
  setError(state, text) {
    state.error = text;
  },
};

const actions: ActionTree<IWeatherState, any> = {
  getDefaultCity({ state, commit }): void {
    const city = state.defaultCity;
    localStorage.setItem('weather.cities', JSON.stringify(city));
    commit('setCities', city);
  },

  async getCurrentCity({ state, commit }, { coords }): Promise<void> {
    const { longitude: lon = 0, latitude: lat = 0 } = coords;
    const key = OWM.API_KEY;
    const limit = 1;
    const url = `${OWM.API_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${key}`;
    const response = await getData(url);
    const { name } = response[0];
    const city = [{ id: 0, name, sort: 0 }];
    localStorage.setItem('weather.cities', JSON.stringify(city));
    commit('setCities', city);
  },

  async getCurrentLocation({ dispatch }): Promise<void> {
    try {
      if (!('geolocation' in navigator)) return;
      await navigator.geolocation.getCurrentPosition(
        (position) => dispatch('getCurrentCity', position),
        () => dispatch('getDefaultCity'),
      );
    } catch (e) {
      dispatch('getDefaultCity');
    }
  },

  async getCities({ commit, dispatch }): Promise<void> {
    const cities: string | null = localStorage.getItem('weather.cities');
    if (cities) {
      commit('setCities', JSON.parse(cities));
    } else {
      await dispatch('getCurrentLocation');
    }
  },

  async getCity({ state, commit }, city): Promise<boolean> {
    const key = OWM.API_KEY;
    const url = `${OWM.API_URL}/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    const response = await getData(url);
    if (response.cod && response.message) {
      commit('setError', 'This city is not valid. Please try another one');
      return false;
    }
    return true;
  },

  async addCity({ state, commit, dispatch }, name) {
    const isValid = await dispatch('getCity', name);
    if (!isValid) return;
    const targetCity = state.cities.find((city: ICity) => city.name === name);
    if (targetCity) {
      commit('setError', 'This city already exists. Please try another one');
    } else if (state.cities.length < state.maxCities) {
      const newCity: ICity[] = [{ id: state.cities.length, name, sort: state.cities.length }];
      const cities: ICity[] = [...state.cities, ...newCity];
      localStorage.setItem('weather.cities', JSON.stringify(cities));
      commit('setCities', cities);
    }
  },

  removeCity({ state, commit }, id: number) {
    const targetCity = state.cities.find((city: ICity) => city.id === id);
    if (targetCity) {
      const cities: ICity[] = state.cities.filter((city: ICity) => city.id !== id);
      localStorage.setItem('weather.cities', JSON.stringify(cities));
      commit('setCities', cities);
    }
  },

  async updateItemSort({ commit, state }, { itemBefore, itemAfter }) {
    let cities: ICity[] = [...state.cities];
    const indexBefore = state.cities.findIndex((el: ICity) => el.id === itemBefore);
    const indexAfter = state.cities.findIndex((el: ICity) => el.id === itemAfter);
    cities.splice(indexAfter, 1);
    cities.splice(indexBefore, 0, state.cities[indexAfter]);
    cities = cities
      .map((item, i) => ({ ...item, sort: i + 1 }))
      .sort((a: ICity, b: ICity) => a.sort - b.sort);
    localStorage.setItem('weather.cities', JSON.stringify(cities));
    commit('setCities', cities);
  },

  hideError({ commit }) {
    commit('setError', null);
  },

  async getWeather({ state, commit }, city): Promise<IWeatherForecast[]> {
    const key = OWM.API_KEY;
    const url = `${OWM.API_URL}/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    const response = await getData(url);
    commit('setWeather', response);
    return response;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  mutations,
  actions,
};
