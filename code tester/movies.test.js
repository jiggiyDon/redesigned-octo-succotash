// movies.test.js

const request = require('supertest');
const app = require('../app'); // Adjust the path as needed

describe('Movie Server Functionality', () => {
    test('GET /movies retrieves a list of movies', async () => {
        const response = await request(app).get('/movies');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /movies adds a new movie', async () => {
        const newMovie = { title: 'Inception', director: 'Christopher Nolan', year: 2010 };
        const response = await request(app).post('/movies').send(newMovie);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('GET /movies/:id retrieves a specific movie', async () => {
        const response = await request(app).get('/movies/1'); // Change ID based on your seed data
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('title');
    });

    test('PUT /movies/:id updates an existing movie', async () => {
        const updatedMovie = { title: 'Inception', director: 'Christopher Nolan', year: 2010 };
        const response = await request(app).put('/movies/1').send(updatedMovie); // Change ID based on your seed data
        expect(response.statusCode).toBe(200);
    });

    test('DELETE /movies/:id deletes a specific movie', async () => {
        const response = await request(app).delete('/movies/1'); // Change ID based on your seed data
        expect(response.statusCode).toBe(204);
    });
});