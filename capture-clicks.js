// test/hooks/capture-clicks.js
const fs = require('fs');
const path = require('path');

class ClickCapture {
  constructor() {
    this.clickEvents = [];
  }

  before() {
    browser.addCommand('trackedClick', async function(selector) {
      const element = await $(selector);
      const clickDetails = {
        timestamp: new Date().toISOString(),
        selector: selector,
        pageUrl: await browser.getUrl(),
        action: 'click',
        elementText: await element.getText(),
        isDisplayed: await element.isDisplayed()
      };
      
      console.log('Captured click:', clickDetails);
      this.clickEvents.push(clickDetails);
      await element.click();
    }.bind(this));

    browser.overwriteCommand('click', async function(originalClickFn, ...args) {
      const result = await originalClickFn.apply(this, args);
      const clickDetails = {
        timestamp: new Date().toISOString(),
        selector: this.selector,
        elementId: this.elementId,
        pageUrl: await browser.getUrl(),
        action: 'click',
        elementText: await this.getText(),
        isDisplayed: await this.isDisplayed()
      };
      
      console.log('Captured default click:', clickDetails);
      this.clickEvents.push(clickDetails);
      return result;
    }, true);
  }

  after() {
    try {
      const output = {
        testRun: {
          startTime: browser.sessionStartTime || new Date().toISOString(),
          endTime: new Date().toISOString(),
          clicks: this.clickEvents,
          totalClicks: this.clickEvents.length
        }
      };
      
      fs.writeFileSync(
        path.join(__dirname, '..', '..', 'click-capture.json'),
        JSON.stringify(output, null, 2),
        'utf8'
      );
      console.log(`Saved ${this.clickEvents.length} clicks to click-capture.json`);
    } catch (error) {
      console.error('Error saving click capture:', error);
    }
  }
}

module.exports = new ClickCapture();
