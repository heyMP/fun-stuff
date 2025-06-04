import * as v from 'valibot';
import { http, HttpResponse } from 'msw';
import { createUsers, createUser } from './models/users/mock.js';
import * as AuthMock from './models/auth/mock.js';

let users: ReturnType<typeof createUsers> = [];

// Describe the network.
export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    const auth = AuthMock.createAuthResponse(body);
    await new Promise(res => setTimeout(res, 3000));
    return HttpResponse.json(auth);
  }),
  http.get('/api/users', () => {
    users = createUsers();
    return HttpResponse.json(users);
  }),
  http.get('/api/users/create', () => {
    const user = createUser();
    users.push(user);
    return HttpResponse.json(user);
  }),
  http.get('/api/users/:id', ({ params }) => {
    const user = users.find(u => u.id === params.id);
    return HttpResponse.json(user);
  }),
]
