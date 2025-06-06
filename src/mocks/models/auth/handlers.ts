import * as v from 'valibot';
import { http, HttpResponse } from 'msw';
import * as AuthMock from './mock.js';
import * as Schema from './schema.js';

// Describe the network.
export const handlers = [
  http.post('/api/login', async (req) => {
    const parsed = v.safeParse(Schema.LoginRequestSchema, await req.request.json());
    if (!parsed.success) {
      return HttpResponse.error();
    }
    const auth = AuthMock.createLoginResponse(parsed.output);
    return HttpResponse.json(auth);
  }),
  http.post('/api/logout', async (req) => {
    const body = await req.request.json();
    const parsed = v.safeParse(Schema.LogoutRequestSchema, body);
    if (!parsed.success) {
      return HttpResponse.error();
    }
    return new HttpResponse(null, { status: 200 });
  }),
]

