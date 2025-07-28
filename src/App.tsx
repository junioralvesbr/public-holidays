import axios from 'axios'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type Country = {
  isoCode: string
  name: [{ text: string }]
}

type Holiday = {
  id: string
  endDate: string
  name: [{ text: string }]
}

const BASEURL = 'https://openholidaysapi.org'
const currentYear = new Date().getFullYear()

const formatdate = (date: string) => {
  const newDate = new Date(date)
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: 'numeric',
    month: 'long'
  }).format(newDate)

  return formattedDate
}

const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(`${BASEURL}/Countries`, {
      params: {
        languageIsoCode: 'EN'
      }
    })
    return response.data

  } catch (error) {
    console.log('Erro da API', error)
    return []
  }
}

const fetchPublicHolidays = async (isoCode: string): Promise<Holiday[]> => {
  try {
    const response = await axios.get<Holiday[]>(`${BASEURL}/PublicHolidays`, {
      params: {
        countryIsoCode: isoCode,
        validFrom: `${currentYear}-01-01`,
        validTo: `${currentYear}-12-31`,
        languageIsoCode: 'EN'
      }
    })
    return response.data

  } catch (error) {
    console.log(error)
    return []
  }

}

function App() {
  const [isoCode, setIsoCode] = useState('NL')

  // request countries
  const { isSuccess, data: countries, isLoading, isError } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries
  })

  // request Public Holidays
  const {
    data: holidays,
    isFetching
  } = useQuery<Holiday[]>({
    queryKey: ['holidays', isoCode],
    queryFn: () => fetchPublicHolidays(isoCode),
    enabled: !!isoCode
  })


  if (isLoading) return <span>Loading...</span>
  if (isError) return <span>Erro ao buscar a API</span>

  return (
    <main>
      <h1>Public Holidays</h1>

      <div>
        <select
          name="countries"
          id="countries"
          defaultValue={isoCode}
          onChange={(event) => setIsoCode(event.target.value)}>
          {isSuccess && (
            countries?.map((country: Country) => (
              <option
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name[0].text}
              </option>
            ))
          )}
        </select>

        {isFetching && <span>Loading Holidays...</span>}

        <ul>
          {holidays?.map((holiday: Holiday) => {
            const date = formatdate(holiday.endDate)
            return (
              <li
                key={holiday.id}
              >
                {`${date} - ${holiday.name[0].text}`}
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}

export default App
