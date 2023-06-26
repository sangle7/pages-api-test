import exp from 'constants';
import { createPage } from '../src/createMockData';
import { compareObject, createClient } from './utils';

describe.skip('page...', () => {
  const client = createClient();

  it('create 50 pages', async () => {
    await Promise.all(new Array(50).fill(1).map(() => {
      const pagePayload = createPage();
      return client.createPage(pagePayload)
        .then(res => {
          const { id } = res;
          if (!id) {
            // @ts-ignore
            return Promise.reject("No id returned： " + (res?.error?.innerError?.message || res?.error?.innerError?.innerError?.message));
          }
          return client.getPage(id, true)
        }).then(page => {
          compareObject(pagePayload, page);
        }).catch(console.log)
    }));
  }, 30000)
});
