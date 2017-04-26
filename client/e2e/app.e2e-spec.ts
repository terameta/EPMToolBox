import { EpmtoolboxPage } from './app.po';

describe('epmtoolbox App', () => {
  let page: EpmtoolboxPage;

  beforeEach(() => {
    page = new EpmtoolboxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
