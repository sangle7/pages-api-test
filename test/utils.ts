
import HttpsProxyAgent from 'https-proxy-agent';
import PagesAPIClient from '../src/client';
import { createPage} from '../src/createMockData';
import { IHorizontalSection, IVerticalSection } from '../src/interface';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


const proxyAgent = HttpsProxyAgent('http://127.0.0.1:8899');

const token: string = process.env.APP_TOKEN!;
const baseUrl = "https://canary.graph.microsoft.com/testprodbetasubtypes-for-pages/sites/root";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export const createClient = () => new PagesAPIClient({
  baseUrl,
  token,
  proxyAgent
})

export const createPageAndGetId = async (client: PagesAPIClient) => {
  const payload = createPage();
  payload.pageLayout = 'article';
  payload.promotionKind = 'page';
  delete payload.canvasLayout;
  const { id } = await client.createPage(payload);
  return id
}


export function compareHorizontalSections(h1: IHorizontalSection[], h2: IHorizontalSection[]) {
  h1.forEach((hSection: IHorizontalSection, i: number) => {
    expect(hSection.emphasis).toEqual(h2[i].emphasis);
    expect(hSection.layout).toEqual(h2[i].layout);
    hSection.columns?.forEach((column: any, j: number) => {
      column.webparts?.forEach((webpart: any, k: number) => {
        expect(webpart).toEqual(expect.objectContaining(h2[i].columns[j].webparts![k]));
      });
    });
  });
}


export function compareVerticalSection(v1: IVerticalSection, v2: IVerticalSection) {
  expect(v1.emphasis).toEqual(v2.emphasis);
  v1.webparts?.forEach((webpart: any, i: number) => {
    expect(webpart).toEqual(expect.objectContaining(v2.webparts![i]));
  });
}