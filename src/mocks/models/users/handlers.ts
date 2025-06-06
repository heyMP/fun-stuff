import { http, HttpResponse } from 'msw';
import { createUsers, createUser } from './mock.js';

let users: ReturnType<typeof createUsers> = [];

// Describe the network.
export const handlers = [
  http.get('/api/users', () => {
    users = createUsers();
    return HttpResponse.json(users);
  }),
  http.get('/api/users/create', () => {
    const user = createUser();
    users.push(user);
    return HttpResponse.json(user);
  }),
  http.delete('/api/users/:id', ({ params }) => {
    users = users.filter(u => u.id !== params.id);
    return HttpResponse.json({});
  }),
]
