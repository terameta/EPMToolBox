import { EPMToolboxPage } from './app.po';

describe('epmtoolbox App', () => {
  let page: EPMToolboxPage;

  beforeEach(() => {
    page = new EPMToolboxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
