import { poolPromise } from '../db.js';

export const getAllAssets = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Assets WHERE DateAcquired >= DATEADD(YEAR, -5, GETDATE())');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { assetName, location, dateAcquired } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('assetName', assetName)
      .input('location', location)
      .input('dateAcquired', dateAcquired)
      .query(`
        DECLARE @InsertedAssets TABLE (
          Id INT,
          AssetName NVARCHAR(255),
          Location NVARCHAR(255),
          DateAcquired DATE
        );

        INSERT INTO Assets (AssetName, Location, DateAcquired)
        OUTPUT INSERTED.Id, INSERTED.AssetName, INSERTED.Location, INSERTED.DateAcquired INTO @InsertedAssets
        VALUES (@assetName, @location, @dateAcquired);

        SELECT * FROM @InsertedAssets;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { assetName, location, dateAcquired } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', id)
      .input('assetName', assetName)
      .input('location', location)
      .input('dateAcquired', dateAcquired)
      .query(`
        UPDATE Assets
        SET AssetName = @assetName, Location = @location, DateAcquired = @dateAcquired
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', id)
      .query(`
        DELETE FROM Assets
        OUTPUT DELETED.*
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};