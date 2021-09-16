export interface ICity {
  id: number;
  name: string;
  sort: number;
}

interface IWeatherItem {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface IWeatherForecast {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  }
  dt: number;
  id: number;
  main: {
    'feels_like': number;
    humidity: number;
    pressure: number;
    temp: number;
    'temp_max': number;
    'temp_min': number;
  }
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  }
  timezone: number;
  visibility: number;
  weather: Array<IWeatherItem>;
  wind: {
    deg: number;
    speed: number;
  }
}

export interface IWeather {
  name: string;
  image: string;
  temperature: string;
  description: string;
  wind: string;
  clouds: string;
  pressure: string;
  humidity: string;
  visibility: string;
}

export interface IWeatherState {
  cities: Array<ICity>;
  defaultCity: Array<ICity>;
  maxCities: number,
  weather: Array<IWeatherForecast>,
  error: string | null,
}
