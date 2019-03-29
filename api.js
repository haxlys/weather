const API_KEY = '077f7ec70cb4897d3e435532527f9a0f'

const fetchData = url => fetch(url).then(data => data.json())

export const fetchFiveDayForecast = city =>
  fetchData(
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${API_KEY}`
  )

export const fetchCurrentForecast = city =>
  fetchData(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
  )
