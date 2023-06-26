import fetch from 'node-fetch';
import {HttpsProxyAgent} from 'https-proxy-agent';
import { createPage, updatePage } from './createMockData';
import { compare } from './util';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:8899');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0'

const myArgs = process.argv.slice(2);
const token: string = process.env.APP_TOKEN!;
const baseUrl = "https://prepspo.spgrid.com/_api/v2.1/sites/root"

const callCreatePage = (payload: any): Promise<any> => {
  return fetch(
    `${baseUrl}/pages`,
    {
      method: 'POST',
      agent: proxyAgent,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  ).then(e => e.json())
};

const callUpdatePage = (uuid: string, payload: any): Promise<any> => {
  return fetch(
    `${baseUrl}/pages/${uuid}`,
    {
      agent: proxyAgent,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  ).then(e => e.json())
};

const callFetchPage = (uuid: string, expand: boolean = false): Promise<any> => {
  return fetch(
    `${baseUrl}/pages/${uuid}${expand ? "?expand=canvasLayout" : ""}`,
    {
      agent: proxyAgent,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      }
    }
  ).then((e) => {
    return e.json();
  })
};

const callListPages = (): string[] => {
  // @ts-ignore
  return fetch(
    `${baseUrl}/pages?select=id`,
    {
      method: 'GET',
      agent: proxyAgent,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      }
    }
  ).then(e => e.json()).then(e => e.value.map((e: { id: any; }) => e.id));
};

const callPublishPage = (uuid: string) => {
  // @ts-ignore
  fetch(
    `${baseUrl}/pages/${uuid}/publish`,
    {
      agent: proxyAgent,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      }
    }
  )
};

const callDeletePage = (uuid: string) => {
  // @ts-ignore
  fetch(
    `${baseUrl}/pages/${uuid}`,
    {
      method: 'DELETE',
      agent: proxyAgent,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      }
    }
  )
};




interface IResult {
  status: number;
  error?: string;
}

const testCreatePages = async () => {
  await Promise.all(new Array(50).fill(1).map(() => {
    const payload = createPage();
    return callCreatePage(payload)
      .then(res => {
        const { id } = res;
        if (!id) {
          // @ts-ignore
          return Promise.reject("No id returned： " + (res?.error?.innerError?.message || res?.error?.innerError?.innerError?.message));
        }
        return callFetchPage(id, true);
      }).then(page => {
        compare(payload, page)
      }).catch(console.log)
  }));
}

const testUpdatePages = async () => {
  const listIds = await callListPages();
  await Promise.all(listIds.slice(0, 50).map(id => {
    const payload = updatePage();
    return callUpdatePage(id, payload).then(res => {
      const { id } = res;
      if (!id) {
        // @ts-ignore
        return Promise.reject("No id returned： " + (res?.error?.innerError?.message || res?.error?.innerError?.innerError?.message));
      }
      return callFetchPage(id, true);
    }).then(page => {
      compare(payload, page)
    }).catch(console.log)
  }))
};

const testFetchPages = async () => {
  const listIds = await callListPages();
  await Promise.all(listIds.map(id => {
    return callFetchPage(id).then(item => {
      console.log(`name: ${item.name}, id: ${item.id}`)
    })
  }))
};

const testDeletePages = async () => {
  const listIds = await callListPages();
  await Promise.all(listIds.map(id => callDeletePage(id)))
};

const testPublishPages = async () => {
  const listIds = await callListPages();
  await Promise.all(listIds.map(id => callPublishPage(id)))
};

!(async () => {
  console.log('=========== create page =============')
  await testCreatePages();
  console.log('=========== update page =============')
  await testUpdatePages();
  console.log('=========== fetch page =============')
  await testFetchPages();
  console.log('=========== publish page =============')
  await testPublishPages();
  console.log('=========== delete page =============')
  await testDeletePages();
})();

