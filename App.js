import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { fetchFiveDayForecast, fetchCurrentForecast } from './api'

const Layout = styled.div`
  display: flex;
  justify-content: ${({ jc }) => jc || 'center'};
  align-items: center;
  flex-direction: ${({ direction }) => direction || 'row'};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => `${height}` || 'auto'};
`

const ForecastUl = styled.ul`
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: scroll;
  justify-content: start;
`

const ForecastLi = styled.li`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 3%;
  border: 1px solid #d2d2d2;
  margin: 2%;

  & > * {
    width: 100px;
  }
`

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
`

const Image = styled.img`
  object-fit: none;
`

const Button = styled.button`
  border: 1px;
  border-radius: 3px;
  background-color: #c3c3c3;
  color: black;
`

const WeatherImage = ({ code }) => <Image src={`http://openweathermap.org/img/w/${code}.png`} />

const CurrentForcast = ({ name, weather, main }) => {
  useMemo(() => null, [name])
  return (
    <Layout width="100vw" height="30vh" direction="column" jc="space-evenly">
      <Title>현재 예보</Title>
      <WeatherImage code={weather[0].icon} />
      <div>{name}</div>
      <div>
        <span>현재 기온 : </span>
        <span>{main.temp}</span>
      </div>
      <div>
        <span>최고 기온 : </span>
        <span>{main.temp_max}</span>
      </div>
      <div>
        <span>최저 기온 : </span>
        <span>{main.temp_min}</span>
      </div>
    </Layout>
  )
}

const getSplitDate = textDate => textDate.split(' ')

const FiveDayForecast = ({ list }) => {
  return (
    <Layout height="40vh" direction="column">
      <Title>5일 예보</Title>
      <Layout as={ForecastUl}>
        {list.map(({ dt, dt_txt, main, weather, wind }) => {
          const { icon, main: status } = weather[0]
          const { speed, deg } = wind
          const [date, time] = getSplitDate(dt_txt)
          return (
            <ForecastLi key={dt}>
              <WeatherImage code={icon} />
              <div>{status}</div>
              <div>{date}</div>
              <div>{time}</div>
              <div>{main.temp} 도</div>
              <div>
                {speed} {deg}
              </div>
            </ForecastLi>
          )
        })}
      </Layout>
    </Layout>
  )
}

const Search = ({ setCurrentForecast, setFiveDayForecast }) => {
  const [city, setCity] = useState('seoul')

  const fetchData = async () => {
    const fiveDay = await fetchFiveDayForecast(city)
    const current = await fetchCurrentForecast(city)
    setFiveDayForecast(fiveDay)
    setCurrentForecast(current)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      fetchData()
    }
  }
  return (
    <Layout width="100vw" height="50px">
      <label htmlFor="city">도시</label>
      <input
        id="city"
        name="city"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="도시 영어명을 검색해주세요..."
        onKeyPress={handleKeyPress}
      />
      <Button type="button" onClick={fetchData}>
        날씨 보기
      </Button>
    </Layout>
  )
}

export default () => {
  const [currentForcast, setCurrentForecast] = useState(null)
  const [fiveDayForecast, setFiveDayForecast] = useState(null)
  return (
    <Layout direction="column" jc="space-between" height="100vh">
      <Search setCurrentForecast={setCurrentForecast} setFiveDayForecast={setFiveDayForecast} />
      {currentForcast && currentForcast.cod !== '404' ? (
        <CurrentForcast {...currentForcast} />
      ) : (
        <Layout>도시를 찾지 못했습니다.</Layout>
      )}
      {fiveDayForecast && fiveDayForecast.cod !== '404' && <FiveDayForecast {...fiveDayForecast} />}
    </Layout>
  )
}
