/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET } from './route';
import { PLAYLISTS } from '@/lib/songs';

const API_KEY = 'test-secret-key';

beforeAll(() => {
  process.env.API_KEY = API_KEY;
});

afterAll(() => {
  delete process.env.API_KEY;
});

describe('GET /api/playlists (private)', () => {
  it('rejects requests without an API key with 401', async () => {
    const res = await GET(new NextRequest('http://localhost/api/playlists'));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
    expect(json.supported_methods).toBeDefined();
  });

  it('rejects requests with a wrong API key with 401', async () => {
    const res = await GET(
      new NextRequest('http://localhost/api/playlists', {
        headers: { 'X-API-Key': 'wrong-key' },
      })
    );
    expect(res.status).toBe(401);
  });

  it('rejects requests with a wrong Bearer token with 401', async () => {
    const res = await GET(
      new NextRequest('http://localhost/api/playlists', {
        headers: { Authorization: 'Bearer wrong-key' },
      })
    );
    expect(res.status).toBe(401);
  });

  it('accepts the API key via X-API-Key header and returns all playlists as metadata only', async () => {
    const res = await GET(
      new NextRequest('http://localhost/api/playlists', {
        headers: { 'X-API-Key': API_KEY },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.count).toBe(PLAYLISTS.length);
    expect(json.data.map((p: { id: string }) => p.id)).toEqual(PLAYLISTS.map((p) => p.id));
    for (const playlist of json.data) {
      expect(playlist).not.toHaveProperty('items');
      expect(playlist).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        playlistId: expect.any(String),
      });
    }
  });

  it('accepts the API key via api_key query param', async () => {
    const res = await GET(new NextRequest(`http://localhost/api/playlists?api_key=${API_KEY}`));
    expect(res.status).toBe(200);
  });

  it('accepts the API key via Bearer token', async () => {
    const res = await GET(
      new NextRequest('http://localhost/api/playlists', {
        headers: { Authorization: `Bearer ${API_KEY}` },
      })
    );
    expect(res.status).toBe(200);
  });

  it('supports filtering by playlist id', async () => {
    const res = await GET(
      new NextRequest(`http://localhost/api/playlists?id=poetry`, {
        headers: { 'X-API-Key': API_KEY },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.count).toBe(1);
    expect(json.data[0].id).toBe('poetry');
    expect(json.data[0]).not.toHaveProperty('items');
  });

  it('returns 404 for an unknown playlist id', async () => {
    const res = await GET(
      new NextRequest(`http://localhost/api/playlists?id=nope`, {
        headers: { 'X-API-Key': API_KEY },
      })
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('Playlist not found');
  });
});
