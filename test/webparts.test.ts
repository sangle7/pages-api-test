import { createHorizontalSection, createTextWebPart, createVerticalSection } from '../src/createMockData';
import { compareHorizontalSections, compareVerticalSection, createClient, createPageAndGetId } from './utils';

describe.skip('web part...', () => {
  const client = createClient();

  it('create a web part in vertical section and delete it', async () => {
    const pageId = await createPageAndGetId(client);
    const vSection = createVerticalSection();
    await client.createVSection(pageId, vSection);
    const webpart = createTextWebPart();
    const { id } = await client.createWebPartInVerticalSection(pageId, 1.5, {...webpart, "@odata.type":"#microsoft.graph.textWebPart"});
    const page = await client.getPage(pageId, true);
    expect(page.canvasLayout.verticalSection.webparts[1]).toEqual(expect.objectContaining(webpart));

    await client.deleteWebPart(pageId, id);

    const page2 = await client.getPage(pageId, true);    
    compareVerticalSection(page2.canvasLayout.verticalSection, vSection);

    await client.deleteWebPartInVerticalSection(pageId, 1);
    vSection.webparts?.shift();
    const page3 = await client.getPage(pageId, true);    
    compareVerticalSection(page3.canvasLayout.verticalSection, vSection);

  }, 30000)

  it('create a web part in horizontal section and delete it', async () => {
    const pageId = await createPageAndGetId(client);
    const hSection = createHorizontalSection();
    hSection.id = '1';
    await client.createHSection(pageId, hSection);
    const webpart = createTextWebPart();
    const { id } = await client.createWebPartInHorizontalSection(pageId, 1,1,1.5, {...webpart, "@odata.type":"#microsoft.graph.textWebPart"});
    const page = await client.getPage(pageId, true);
    expect(page.canvasLayout.horizontalSections[0].columns[0].webparts[1]).toEqual(expect.objectContaining(webpart));

    await client.deleteWebPart(pageId, id);

    const page2 = await client.getPage(pageId, true);    
    compareHorizontalSections(page2.canvasLayout.horizontalSections, [hSection]);

    await client.deleteWebPartInHorizontalSection(pageId, 1, 1, 1);
    hSection.columns[0].webparts?.shift();
    const page3 = await client.getPage(pageId, true);    
    compareHorizontalSections(page3.canvasLayout.horizontalSections, [hSection]);
    
  }, 30000)
});

