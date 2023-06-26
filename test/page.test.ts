import { createPage, updatePage } from '../src/createMockData';
import { compareObject, createClient } from './utils';

describe('page...', () => {
  const client = createClient();

  it('create 50 pages', async () => {
    await Promise.all(new Array(50).fill(1).map(() => {
      const pagePayload = createPage();
      return client.createPage(pagePayload)
        .then(res => {
          const { id } = res;
          if (!id) {
            // @ts-ignore
            return Promise.reject("No id returned： " + JSON.stringify(res));
            // return Promise.reject("No id returned： " + res?.error?.error?.message);
          }
          return client.getPage(id, true)
        }).then(page => {
          compareObject(pagePayload, page);
        }).catch(console.log)
    }));
  }, 30000)

  it('update 50 pages', async () => {
    const listIds = await client.listPages();
    await Promise.all(listIds.slice(0, 50).map(id => {
      const payload = updatePage();
      return client.updatePage(id, payload).then(res => {
        const { id } = res;
        if (!id) {
          // @ts-ignore
          return Promise.reject("No id returned： " + JSON.stringify(res));
        }
        return client.getPage(id, true);
      }).then(page => {
        compareObject(payload, page);
      }).catch(console.log)
    }))
  }, 30000)

  it('publish all pages', async () => {
    const listIds = await client.listPages();
    await Promise.all(listIds.map(id => client.publishPage(id).then(res => { expect(res.status).toBe(204) })))
  }, 30000)

  it('delete all pages', async () => {
    const listIds = await client.listPages();
    await Promise.all(listIds.map(id => client.deletePage(id).then(res => { expect(res.status).toBe(204) })))
  }, 30000)
});
