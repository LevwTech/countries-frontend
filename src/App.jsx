import { useState, useEffect } from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [loading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchCountries();
  }, []);
  async function fetchCountries() {
    console.log(user);
    const accessToken = await getAccessTokenSilently({
      audience: `${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
      scope: 'read:current_user',
    });
    console.log(accessToken);
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}/countries/?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await res.json();
    setCountries([...countries, ...data]);
    setPage(page + 1);
    setIsLoading(false);
  }
  return (
    <div>
      {!isAuthenticated ? (
        <button
          className='load-more-button'
          onClick={() => loginWithRedirect()}
        >
          Login
        </button>
      ) : (
        <button
          className='load-more-button'
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </button>
      )}
      {loading && isAuthenticated && (
        <h1 style={{ textAlign: 'center' }}>Loading...</h1>
      )}
      {!loading && isAuthenticated && (
        <div>
          <div className='countries-list'>
            {countries.map((country, i) => (
              <div key={i} className='country-card'>
                <h1 className='country-name'>{country.name.common}</h1>
                <img
                  className='country-flag'
                  src={country.flags.png}
                  alt={country.name.common}
                />
              </div>
            ))}
          </div>
          <button className='load-more-button' onClick={fetchCountries}>
            More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
