export default function Home() {
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

    return (
      <div>
          <div>
              <a href={`${FRONTEND_URL}/login`}>Login</a>
          </div>
        <div>
        <a href={`${FRONTEND_URL}/register`}>Register</a>
        </div>
      </div>
  )
}
