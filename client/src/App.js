import React, { useState, useEffect } from 'react';

function App() {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [newAsset, setNewAsset] = useState({
    assetName: '',
    location: '',
    dateAcquired: '',
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/assets`)
      .then(res => res.json())
      .then(data => setAssets(data));
  }, []);

  const createAsset = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.map(error => error.msg)?.join(",") || 'Failed to create asset');
      }

      const createdAsset = await response.json();

      setAssets(prevAssets => [...prevAssets, createdAsset]);

      setNewAsset({ assetName: '', location: '', dateAcquired: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredAssets = assets
    .filter(a => a.AssetName.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortAsc
      ? new Date(a.DateAcquired) - new Date(b.DateAcquired)
      : new Date(b.DateAcquired) - new Date(a.DateAcquired));

  return (
    <div style={{ padding: 20 }}>
      <h2>Asset Management</h2>

      <input
        placeholder="Filter by Asset Name"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <button onClick={() => setSortAsc(!sortAsc)}>
        Sort by Date ({sortAsc ? 'Asc' : 'Desc'})
      </button>

      <h3>Add New Asset</h3>
      <input
        placeholder="Asset Name"
        value={newAsset.assetName}
        onChange={e => setNewAsset({ ...newAsset, assetName: e.target.value })}
      />
      <input
        placeholder="Location"
        value={newAsset.location}
        onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
      />
      <input
        type="date"
        placeholder="Date Acquired"
        value={newAsset.dateAcquired}
        onChange={e => setNewAsset({ ...newAsset, dateAcquired: e.target.value })}
      />
      <button onClick={createAsset}>Create Asset</button>

      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asset Name</th>
            <th>Location</th>
            <th>Date Acquired</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map(asset => (
            <tr key={asset.Id}>
              <td>{asset.Id}</td>
              <td>{asset.AssetName}</td>
              <td>{asset.Location}</td>
              <td>{new Date(asset.DateAcquired).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
