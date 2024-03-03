const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customer',
  password: 'root',
  port: 5432,
});

 /*const deletePreviousData = async () => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM customer_data');
    client.release();
    console.log('Previous data deleted successfully.');
  } catch (error) {
    console.error('Error deleting previous data:', error);
  }
};

const seedDatabase = async () => {
  await deletePreviousData();

  try {
    const client = await pool.connect();
    
    // Your seeding logic here

    client.release();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Release the client
    pool.end();
  }
};

seedDatabase(); */

const generateRandomDate = () => {
  const startDate = new Date('2024/03/01');
  const endDate = new Date();
  const randomDate = new Date(
    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  );

  // Format the date manually
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');
  const hours = String(randomDate.getHours()).padStart(2, '0');
  const minutes = String(randomDate.getMinutes()).padStart(2, '0');
  const seconds = String(randomDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
};

const seedDatabase = async () => {
  try {
    const client = await pool.connect();

    const customers = Array.from({ length: 50 }, (_, index) => ({
      sno: index + 1, // Serial number starting from 1
      name: `Customer ${index + 1}`,
      age: Math.floor(Math.random() * 100),
      phone: '1234567890',
      location: `Location ${index + 1}`,
      created_at: generateRandomDate(),
    }));

    const insertQuery = 'INSERT INTO customer_data (customer_name, age, phone, location, created_at) VALUES ($1, $2, $3, $4, $5)';
    
    // Use Promise.all to wait for all insert queries to complete
    await Promise.all(customers.map(async (customer) => {
      await client.query(insertQuery, [customer.name, customer.age, customer.phone, customer.location, customer.created_at]);
    }));

    console.log('Data added to the database successfully.');
  } catch (error) {
    console.error('Error adding data to the database:', error);
  } finally {
    // Always release the client, even if there's an error
    pool.end();
  }
};


const fetchData = async () => {
  try {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM customer_data ORDER BY sno');

    // Log or process the result as needed
    console.log(result.rows);

    console.log('Data fetched successfully.');
  } catch (error) {
    console.error('Error fetching data from the database:', error);
  } finally {
    // Always release the client, even if there's an error
    pool.end();
  }
};
seedDatabase();