import fetch from 'node-fetch';
import _HttpsProxyAgent from 'https-proxy-agent/dist/agent';
import { createPage, updatePage } from './createMockData';

export interface IPagesAPIClientOptions {
  baseUrl: string;
  token: string;
  proxyAgent?: _HttpsProxyAgent;
}

const endpoints = {
  basePage: {
    list: {
      method: 'GET',
      path: () => '/pages',
    },
    get: {
      method: 'GET',
      path: (id: string) => `/pages/${id}/`,
    },
    delete: {
      method: 'DELETE',
      path: (id: string) => `/pages/${id}`,
      emptyRes: true,
    }
  },
  page: {
    create: {
      method: 'POST',
      path: () => '/pages',
      body: (payload: any) => ({ ...payload, "@odata.type": "#microsoft.graph.sitepage" }),
    },
    update: {
      method: 'PATCH',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage`,
      body: (payload: any) => ({ ...payload, "@odata.type": "#microsoft.graph.sitepage" })
    },
    list: {
      method: 'GET',
      path: () => '/pages/microsoft.graph.sitepage',
    },
    get: {
      method: 'GET',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage`,
    },
    publish: {
      method: 'POST',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage/publish`,
      emptyRes: true
    }
  },
  verticalSection: {
    create: {
      method: 'PUT',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage/canvaslayout/verticalsection`,
      body: (payload: any) => payload,
    },
    get: {
      method: 'GET',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage/canvaslayout/verticalsection`,
      body: (payload: any) => payload
    },
    update: {
      method: 'PATCH',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage/canvaslayout/verticalsection`,
      body: (payload: any) => payload
    },
    delete: {
      method: 'DELETE',
      path: (id: string) => `/pages/${id}/microsoft.graph.sitepage/canvaslayout/verticalsection`,
      emptyRes: true,
    },
  }
};

export default class PagesAPIClient {
  public baseUrl: string;
  public token: string;
  public proxyAgent: _HttpsProxyAgent | undefined;

  constructor(options: IPagesAPIClientOptions) {
    this.baseUrl = options.baseUrl;
    this.token = options.token;
    this.proxyAgent = options.proxyAgent ?? undefined;
  }

  createPage = (payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    ).then(e => e.json()).then(e => e.value.map((e: { id: any; }) => e.id));
  };

  publishPage = (uuid: string) => {
    fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/publish`,
      {
        agent: this.proxyAgent,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  };

  deletePage = (uuid: string) => {
    fetch(
      `${this.baseUrl}/pages/${uuid}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  };

  getWebPartsByPosition = (uuid: string) => {
    fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/getWebPartsByPosition?isInVerticalSection=true`,
      {
        method: 'GET',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }

  createHSection = (uuid: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections`,
      {
        method: 'POST',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }

  deleteHSection = (uuid: string, id: string): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalsections/${id}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: {
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }

  updateHSection = (uuid: string, id: string, payload: any): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections/${id}`,
      {
        method: 'PATCH',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }

  deleteWebPartInHorizontalSection = (uuid: string, sectionId: number, columnId: number, index: number): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/canvasLayout/horizontalSections/${sectionId}/columns/${columnId}/webparts/${index}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }




  deleteWebPart= (uuid: string, id: number): Promise<any> => {
    return fetch(
      `${this.baseUrl}/pages/${uuid}/microsoft.graph.sitepage/webparts/${id}`,
      {
        method: 'DELETE',
        agent: this.proxyAgent,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;odata.metadata=none',
          Authorization: `Bearer ${this.token}`,
        }
      }
    )
  }

}