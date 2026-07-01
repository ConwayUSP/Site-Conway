import { useEffect } from 'react'
import './Home.css'

function Home() {
  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects')
      const data = await response.json()
      console.log('Fetched projects:', data)
    }

    fetchProjects()
  }, [])

  return (
    <main className="home">
      {/* <img src="https://private-user-images.githubusercontent.com/83891138/573750257-43594b0e-5d72-4fc6-a50a-ed23a98afba5.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtl5SI6Imtl5TUiLCJleHAiOjE3ODI4MzYwMjMsIm5iZiI6MTc4MjgzNTcyMywicGF0aCI6Ii84Mzg5MTEzOC81NzM3NTAyNTctNDM1OTRiMGUtNWQ3Mi00ZmM2LWE1MGEtZWQyM2E5OGFmYmE1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MzAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjMwVDE2MDg0M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI2NGVjMjkwMjJlNjgzZTM5YTk3ZGFjYTBjZDAyYjJlM2RlNTA5MWU5ZTUxZTg3MzVlYjYxMGVhM2YwZWJlNmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.j4R1ohIBliShJSHvJg9m51P_QRo8gOH2TPaJ6-UTlZY" /> */}
      <h1>Home do site da Conway!</h1>
    </main>
  )
}

export default Home