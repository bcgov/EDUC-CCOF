'use strict';

const express = require('express');
const session = require('express-session');
const request = require('supertest');
const cookieMaxAge = require('../../src/middlewares/cookieMaxAge');

function buildApp() {
  const app = express();
  app.use(cookieMaxAge('test_cookie', 1800000));
  app.use(session({ name: 'test_cookie', secret: 'secret', resave: false, saveUninitialized: false, rolling: true, cookie: { maxAge: 1800000 } }));
  app.get('/login', (req, res) => {
    req.session.user = 'someone';
    res.cookie('other_cookie', 'value');
    res.sendStatus(200);
  });
  app.get('/anonymous', (_req, res) => res.sendStatus(200));
  return app;
}

describe('cookieMaxAge', () => {
  it('adds Max-Age to the session cookie and keeps Expires', async () => {
    const res = await request(buildApp()).get('/login');
    const sessionCookie = res.headers['set-cookie'].find((c) => c.startsWith('test_cookie='));
    expect(sessionCookie).toMatch(/; Max-Age=1800(;|$)/);
    expect(sessionCookie).toMatch(/Expires=/);
  });

  it('does not modify other cookies', async () => {
    const res = await request(buildApp()).get('/login');
    const otherCookie = res.headers['set-cookie'].find((c) => c.startsWith('other_cookie='));
    expect(otherCookie).not.toMatch(/Max-Age/i);
  });

  it('does nothing when no cookie is set', async () => {
    const res = await request(buildApp()).get('/anonymous');
    expect(res.headers['set-cookie']).toBeUndefined();
  });
});
