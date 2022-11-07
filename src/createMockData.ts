import { faker } from '@faker-js/faker';
import { IPage, ITtitleArea, ICanvasLayout, IVerticalSection, IHorizontalSection, IWebPart, IColumn } from './interface';

export const createPage = (): IPage => {
  const page: IPage = {
    name: `autotest ${faker.random.words(2)}`
  }
  faker.datatype.boolean() && (page.title = faker.random.words(5));
  faker.datatype.boolean() && (page.description = faker.lorem.lines());
  faker.datatype.boolean() && (page.pageLayout = faker.helpers.arrayElement(['article', 'microsoftReserved', 'home']));
  faker.datatype.boolean() && (page.thumbnailWebUrl = faker.image.imageUrl());
  faker.datatype.boolean() && (page.promotionKind = faker.helpers.arrayElement(['page', 'newsPost', 'microsoftReserved']));
  faker.datatype.boolean() && (page.showComments = faker.datatype.boolean());
  faker.datatype.boolean() && (page.showRecommendedPages = faker.datatype.boolean());
  faker.datatype.boolean() && (page.titleArea = createTitleArea());
  page.canvasLayout = createCanvasLayout();
  return page;
};

export const updatePage = (): Partial<IPage> => {
  const page: Partial<IPage> = {};
  faker.datatype.boolean() && (page.title = faker.random.words(5));
  faker.datatype.boolean() && (page.description = faker.lorem.lines());
  faker.datatype.boolean() && (page.thumbnailWebUrl = faker.image.imageUrl());
  faker.datatype.boolean() && (page.promotionKind = faker.helpers.arrayElement(['page', 'newsPost', 'microsoftReserved']));
  faker.datatype.boolean() && (page.showComments = faker.datatype.boolean());
  faker.datatype.boolean() && (page.showRecommendedPages = faker.datatype.boolean());
  faker.datatype.boolean() && (page.titleArea = createTitleArea());
  faker.datatype.boolean() && (page.canvasLayout = createCanvasLayout());
  return page;
};

export const createCanvasLayout = (): Partial<ICanvasLayout> => {
  const cl: Partial<ICanvasLayout> = {};
  faker.datatype.boolean() && (cl.horizontalSections = Array.from({ length: 5 }, createHorizontalSection));
  faker.datatype.boolean() && (cl.verticalSection = createVerticalSection());
  return cl;
};

const createHorizontalSection = (): IHorizontalSection => {
  const v: IHorizontalSection = createColumns();
  v.emphasis = faker.helpers.arrayElement(['soft', 'strong', 'neutral', 'none'])
  return v;
}

const createColumns = (): IHorizontalSection => {
  return {
    layout: "threeColumns",
    columns: [createColumn(), createColumn(), createColumn()]
  }
};

const createColumn = (): IColumn => {
  return {
    webparts: Array.from({ length: 2 }, createWebPart)
  }
}

const createVerticalSection = (): Partial<IVerticalSection> => {
  const v: Partial<IVerticalSection> = {};
  v.webparts = Array.from({ length: 5 }, createWebPart)
  v.emphasis = faker.helpers.arrayElement(['soft', 'strong', 'neutral', 'none'])
  return v;
}

const createWebPart = (): IWebPart => {
  return {
    innerHtml: `<p>${faker.lorem.paragraph()}</p>`
  }
}

export const createTitleArea = (): ITtitleArea => {
  return {
    enableGradientEffect: faker.datatype.boolean(),
    layout: faker.helpers.arrayElement(['imageAndTitle', 'plain', 'overlap', 'colorBlock']),
    showAuthor: faker.datatype.boolean(),
    showPublishedDate: faker.datatype.boolean(),
    showTextBlockAboveTitle: faker.datatype.boolean(),
    textAboveTitle: faker.random.words(2),
    textAlignment: faker.helpers.arrayElement(['center', 'left']),
    title: faker.random.words(5),
    imageSourceType: 4,
    serverProcessedContent: {
      htmlStrings: [],
      searchablePlainTexts: [],
      links: [],
      imageSources: [{
        key: 'imageSource',
        value: faker.image.imageUrl()
      }],
    }
  }
};