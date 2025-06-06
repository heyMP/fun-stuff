import * as v from 'valibot';
import { http, HttpResponse } from 'msw';
import { createUsers, createUser } from './mock.js';
import * as Schema from './schema.js';

let users: ReturnType<typeof createUsers> = [];

// Describe the network.
export const handlers = [
  http.get('/api/users', () => {
    users = createUsers();
    return HttpResponse.json(users);
  }),
  http.post('/api/users/create', async (req) => {
    const parsed = v.safeParse(Schema.CreateUserRequestSchema, await req.request.json());
    if (!parsed.success) {
      return HttpResponse.error();
    }
    const user = createUser();
    users.push(user);
    return HttpResponse.json(user);
  }),
  http.delete('/api/users/:id', ({ params }) => {
    users = users.filter(u => u.id !== params.id);
    return new HttpResponse(null, { status: 200});
  }),
]
