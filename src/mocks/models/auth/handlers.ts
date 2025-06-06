import { http, HttpResponse } from 'msw';
import * as AuthMock from './mock.js';

// Describe the network.
export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    const auth = AuthMock.createAuthResponse(body);
    await new Promise(res => setTimeout(res, 1000));
    return HttpResponse.json(auth);
  }),
]

