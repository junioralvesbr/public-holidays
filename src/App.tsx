import axios from 'axios'
import './App.css'
import { useQuery } from '@tanstack/react-query'

const BASEURL = 'https://openholidaysapi.org'

type Country = {
  isoCode: string
  name: [{
    text: string
  }]
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

const fetchPublicHolidays = async () => {
  try {
    const response = await axios.get(`${BASEURL}/PublicHolidays`, {
      params: {
        countryIsoCode: 'BR',
        validFrom: '2025-01-01',
        validTo: '205-12-31',
        languageIsoCode: 'EN'
      }
    })
    return response.data

  } catch (error) {
    console.log(error)
  }

}

function App() {
  // request countries
  const { isSuccess, data: countries, isLoading, isError } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries
  })

  // request Public Holidays
  const { data: holidays } = useQuery({
    queryKey: ['holidays'],
    queryFn: fetchPublicHolidays
  })

  if (isLoading) return <span>Loading...</span>
  if (isError) return <span>Erro ao buscar a API</span>

  return (
    <div>
      <h1>Public Holidays</h1>

      <div>
        <select name="countries" id="countries" onChange={(event) => console.log(event.target.value)}>
          {isSuccess && (
            countries?.map((country: Country) => (
              <option
                key={country.isoCode}
                value={country.isoCode}
              >{country.name[0].text}</option>
            ))
          )}
        </select>

        <ul>
          {holidays.map(holiday => (
            <li>{holiday.name[0].text}</li>
          ))}
        </ul>
      </div>
    </div >
  )
}

export default App
