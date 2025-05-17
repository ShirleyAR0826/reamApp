import sql from 'mssql/msnodesqlv8.js';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  connectionString: `Driver={${process.env.DB_DRIVER}};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=${process.env.DB_TRUSTED_CONNECTION};`,
  driver: 'msnodesqlv8'
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server using Windows Authentication');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed!', err));

export { poolPromise };