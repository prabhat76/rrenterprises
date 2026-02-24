
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_w7mPGtrWo8jF@ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const schemaPath = path.join(__dirname, 'schema.sql');

async function setupDatabase() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to the database.');

        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        console.log('Database schema created successfully.');

    } catch (err) {
        console.error('Error setting up the database:', err);
    } finally {
        await client.end();
        console.log('Disconnected from the database.');
    }
}

setupDatabase();
