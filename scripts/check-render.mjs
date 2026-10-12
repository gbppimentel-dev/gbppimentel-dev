import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { existsSync } from 'node:fs';
const server = await createServer({server:{middlewareMode:true}});
try {
  const {default:App} = await server.ssrLoadModule('/src/App.jsx');
  const routes = [
    ['/', 'Thoughtful builds.'], ['/work', 'Useful ideas,'], ['/about', 'A curious builder'],
    ['/notes', 'Work in progress,'], ['/contact', 'An open door'],
    ['/work/salt-and-light', 'Salt &amp; Light'], ['/work/lifecity-attendance', 'LifeCity Attendance'],
    ['/work/creative-collection', 'The creative collection'], ['/missing','That page wandered off.'],
    ['/work/missing', 'That page wandered off.'],
  ];
  for (const [route,text] of routes) {
    globalThis.window = {location:{hash:`#${route}`}};
    const html = renderToString(createElement(App));
    assert(html.includes(text), `${route}: missing expected title`);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${route}: expected one h1`);
    for(const [,ref] of html.matchAll(/(?:src|href)="([^\"]+)"/g)) {
      if(ref.startsWith('#') || /^https?:|^mailto:/.test(ref)) continue;
      assert(existsSync(`public/${ref.replace(/^\.\//,'').replace(/^\//,'')}`),`Missing asset: ${ref}`);
    }
    assert(!html.includes('href="#"'), `${route}: dead placeholder link`);
    console.log(`PASS ${route}`);
  }
  const {projects} = await server.ssrLoadModule('/src/data.js');
  assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length);
  console.log('PASS project slugs and rendered local assets');
} finally { await server.close(); }
