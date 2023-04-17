import { createHorizontalSection, createPage, createVerticalSection, updatePage } from '../src/createMockData';
import { compareHorizontalSections, compareVerticalSection, createClient, createPageAndGetId } from './utils';

describe('section...', () => {
  const client = createClient();

  it('test crud on vertical section', async () => {
    const id = await createPageAndGetId(client);
    const vSection = createVerticalSection();
    await client.createVSection(id, vSection);
    const page = await client.getPage(id, true);
    compareVerticalSection(page.canvasLayout.verticalSection, vSection);

    const vSection2 = createVerticalSection();
    await client.updateVSection(id, vSection2);
    const page2 = await client.getPage(id, true);
    compareVerticalSection(page2.canvasLayout.verticalSection, vSection2);

    await client.deleteVSection(id);
    const page3 = await client.getPage(id, true);
    expect(page3.canvasLayout.verticalSection).toEqual(undefined);
  }, 30000)

  it('test crud on horizontal section', async () => {
    const id = await createPageAndGetId(client);
    const hSection = createHorizontalSection();
    hSection.id = '1';
    await client.createHSection(id, hSection);
    const page = await client.getPage(id, true);
    compareHorizontalSections(page.canvasLayout.horizontalSections, [hSection]);

    const hSection2 = {
      emphasis: 'none',
      layout: 'twoColumns',
    };
    await client.updateHSection(id, '1', hSection2);
    const page2 = await client.getPage(id, true);
    compareHorizontalSections(page2.canvasLayout.horizontalSections, [{
      id: '1',
      emphasis: 'none',
      layout: 'twoColumns',
      columns: [{
        webparts: hSection.columns[0].webparts
      },
      {
        webparts: hSection.columns[1].webparts?.concat(hSection.columns[2].webparts!)
      }]
    }]);

    const hSection3 = createHorizontalSection();
    await client.updateHSection(id, '1', hSection3);
    const page3 = await client.getPage(id, true);
    compareHorizontalSections(page3.canvasLayout.horizontalSections, [hSection3]);

    await client.deleteHSection(id, '1',);
    const page4 = await client.getPage(id, true);
    expect(page4.canvasLayout.horizontalSections).toEqual([]);
  }, 30000)


  it('add multiple sections', async () => {
    const id = await createPageAndGetId(client);
    const vSection = createVerticalSection();
    const hSection1 = createHorizontalSection();
    hSection1.id = '0.1'
    const hSection2 = createHorizontalSection();
    hSection2.id = '1';
    const hSection3 = createHorizontalSection();
    hSection3.id = '3'
    await client.createVSection(id, vSection);
    await client.createHSection(id, hSection2);
    await client.createHSection(id, hSection1);
    await client.createHSection(id, hSection3);
    await client.deleteHSection(id, '3');

    const result = await client.getPage(id, true);

    compareVerticalSection(result.canvasLayout.verticalSection, vSection);
    compareHorizontalSections(result.canvasLayout.horizontalSections, [hSection1, hSection2]);

  }, 20000)

});
