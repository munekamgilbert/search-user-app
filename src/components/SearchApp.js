import React, { useState } from 'react';

const SearchApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const MAX_LENGTH = 30;

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= MAX_LENGTH) {
      setSearchQuery(value);
    }
  };

  const handleKeyDown = (e) => {
   
    if (searchQuery.length >= MAX_LENGTH && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {

    e.preventDefault();
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://rocketapi-for-developers.p.rapidapi.com/instagram/user/search', {
        method: 'POST',
        headers: {
          'x-rapidapi-ua': 'RapidAPI-Playground',
          'x-rapidapi-key': 'ba3b2a31d6msh094e26bf4ff14e3p11530fjsnefda12dbfccc',
          'x-rapidapi-host': 'rocketapi-for-developers.p.rapidapi.com',
          'specificMethodHeaders': '[object Object]',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users: ' + response.statusText);
      }

      const data = await response.json();
      console.log('API Response:', data);
      setUsers(data.response || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">User Search</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Enter search query (alphanumeric only)"
          className="border rounded-l-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={MAX_LENGTH}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-r-lg p-2 hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.username}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <a href={user.profile_pic_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={user.profile_pic_url}
                  alt={`${user.full_name}'s profile`}
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://picsum.photos/96';
                  }}
                />
              </a>
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-gray-600">{user.full_name}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            {error ? 'Failed to fetch users. Please try again.' : 'No users found. Try a different search query.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchApp;