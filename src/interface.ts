export interface IPage {
  name: string;
  title?: string;
  description?: string;
  pageLayout?: 'article' | 'microsoftReserved' | 'home';
  thumbnailWebUrl?: string;
  promotionKind?: 'page' | 'newsPost' | 'microsoftReserved';
  showComments?: boolean;
  showRecommendedPages?: boolean;
  titleArea?: ITtitleArea;
  canvasLayout?: ICanvasLayout;
}

export interface ICanvasLayout {
  horizontalSections?: IHorizontalSection[];
  verticalSection?: IVerticalSection;
}

export interface IHorizontalSection {
  emphasis?: 'soft' | 'strong' | 'neutral' | 'none';
  layout: 'oneColumn' | 'twoColumns' | 'threeColumns' | 'oneThirdLeft' | 'oneThirdRight' | 'fullWidth';
  columns: IColumn[];
}

export interface IColumn {
  webparts?: IWebPart[];
  width?: number;
}

export interface IVerticalSection {
  emphasis?: 'soft' | 'strong' | 'neutral' | 'none';
  webparts?: IWebPart[];
}

export interface IWebPart {
  innerHtml: string;
}

export interface ITtitleArea {
  enableGradientEffect?: boolean;
  layout?: 'imageAndTitle' | 'plain' | 'overlap' | 'colorBlock';
  showAuthor?: boolean;
  showPublishedDate?: boolean;
  showTextBlockAboveTitle?: boolean;
  textAboveTitle?: string;
  textAlignment?: 'left' | 'center';
  title?: string;
  authorByline?: string[];
  imageSourceType?: 4;
  serverProcessedContent?: any;
  authors?: any
}
