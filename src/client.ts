import fetch, { HeadersInit } from 'node-fetch';
import _HttpsProxyAgent from 'https-proxy-agent/dist/agent';
import https, { Agent } from 'https'

export interface IPagesAPIClientOptions {
  baseUrl: string;
  token: string;
  proxyAgent?: _HttpsProxyAgent;
}

export default class PagesAPIClient {
  public baseUrl: string;
  public headers: HeadersInit;
  public proxyAgent: _HttpsProxyAgent | Agent;

  constructor(options: IPagesAPIClientOptions) {
    this.baseUrl = options.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json;odata.metadata=none',
      Authorization: `Bearer ${options.token}`,
    };
    this.proxyAgent = options.proxyAgent ?? new https.Agent({
      rejectUnauthorized: false
    })
  }

  createPage = (payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify({ ...payload, "@odata.type": "#microsoft.graph.sitepage" }),
      }
    ).then(e => e.json())
  };

  updatePage = (uuid: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage`,
      {
        agent: this.proxyAgent,
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ ...payload, "@odata.type": "#microsoft.graph.sitepage" }),
      }
    ).then(e => e.json())
  };

  getPage = (uuid: string, expand: boolean = false): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage${expand ? "?expand=canvasLayout" : ""}`,
      {
        agent: this.proxyAgent,
        method: 'GET',
        headers: this.headers,
      }
    ).then((e) => {
      return e.json();
    })
  };

  listPages = (): Promise<string[]> => {
    return fetch(
      `${this.baseUrl}/pages/microsoft.graph.sitepage?select=id`,
      {
        method: 'GET',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    ).then(e => e.json()).then(e => e.value.map((e: { id: any; }) => e.id));
  };

  publishPage = (uuid: string) => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/publish`,
      {
        agent: this.proxyAgent,
        method: 'POST',
        headers: this.headers,
      }
    )
  };

  deletePage = (uuid: string) => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  };

  getWebPartsByPosition = (uuid: string) => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/getWebPartsByPosition?isInVerticalSection=true`,
      {
        method: 'GET',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }

  createHSection = (uuid: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  createVSection = (uuid: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/verticalsection`,
      {
        method: 'PUT',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  deleteVSection = (uuid: string): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/verticalsection`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }

  deleteHSection = (uuid: string, id: string): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalsections/${id}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }

  updateHSection = (uuid: string, id: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections/${id}`,
      {
        method: 'PATCH',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  updateVSection = (uuid: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/verticalsection`,
      {
        method: 'PATCH',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  createWebPartInVerticalSection = (uuid: string, index: number, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/verticalsection/webparts?index=${index}`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  createWebPartInHorizontalSection = (uuid: string, sectionId: number, columnId: number, index: number, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections/${sectionId}/columns/${columnId}/webparts?index=${index}`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    ).then(e => e.json())
  }

  deleteWebPartInVerticalSection = (uuid: string, index: number): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/verticalsection/webparts/${index}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }

  deleteWebPartInHorizontalSection = (uuid: string, sectionId: number, columnId: number, index: number): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections/${sectionId}/columns/${columnId}/webparts/${index}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }

  deleteWebPart= (uuid: string, id: number): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/webparts/${id}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: this.headers,
      }
    )
  }
}