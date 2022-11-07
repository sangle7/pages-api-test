import fetch, { Response } from 'node-fetch';
import { createPage, updatePage } from './createMockData';
import { IPage } from './interface';
import { compare } from './util';

const myArgs = process.argv.slice(2);
const token = myArgs[0];
const baseUrl = "https://canary.graph.microsoft.com/testprodbeta14666-Operate-a-SharePoint-Page-by-API/sites/f9d54fba-563d-4ac5-9daa-dc5c096f174f"

const callCreatePage = (payload: any): Promise<any> => {
  return fetch(
    `${baseUrl}/pages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata.metadata=none',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  ).then(e => e.json())
};

const callUpdatePage = (uuid: string, payload: any) : Promise<any> => {
  return fetch(
    `${baseUrl}/pages/${uuid}`,
    {
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
    `${baseUrl}/pages/${uuid}${expand && "?expand=canvasLayout"}`,
    {
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

const testCreatePages = () => {
  for (let i: number = 0; i < 50; i++) {
    const payload = createPage();
    callCreatePage(payload)
      .then(res => {
        const { id } = res;
        if (!id) {
          return Promise.reject("No id returned");
        }
        return callFetchPage(id, true);
      }).then(page => {
        compare(payload, page)
      }).catch(err => console.log)
  }
};

const testUpdatePages = async () => {
  const listIds = await callListPages();
  listIds.slice(0,50).forEach(id => { 
    const payload = updatePage();
    callUpdatePage(id, payload).then(res => {
      const { id } = res;
      if (!id) {
        // @ts-ignore
        return Promise.reject("No id returned： " +(res?.error?.innerError?.message || res?.error?.innerError?.innerError?.message));
      }
      return callFetchPage(id, true);
    }).then(page => {
      compare(payload, page)
    }).catch(console.log)
  });
};

const testFetchPages = async () => {
  const listIds = await callListPages();
  listIds.forEach(id => callFetchPage(id));
};

const testDeletePages = async () => {
  const listIds = await callListPages();
  listIds.forEach(id => callDeletePage(id));
};

const testPublishPages = async () => {
  const listIds = await callListPages();
  listIds.forEach(id => callPublishPage(id));
};

testUpdatePages();

