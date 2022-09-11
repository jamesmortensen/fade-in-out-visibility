const { expect } = require("chai");
const ElementFader = require('../public/fade-in-out.js');

describe('Test', () => {
    it('should go from 0 to 1 in one second', (done) => {
        const doc = {
            querySelector: (selector) => {
                return {
                    style: {
                        opacity: 0
                    }
                }
            }
        };
        const elemFader = new ElementFader('.modal-footer', doc);
        elemFader.fadeIn();
        var count = 0;
        const interval = setInterval(() => {
            if (count++ > 9) {
                clearInterval(interval);
                expect(elemFader.getOpacity()).to.be.above(1);                
                done();
            } else {
                expect(elemFader.getOpacity()).to.be.below(1);
            }
        }, 100);
    });

    it('should go from 1 to 0 in one second', (done) => {
        const doc = {
            querySelector: (selector) => {
                return {
                    style: {
                        opacity: 1
                    }
                }
            }
        };
        const elemFader = new ElementFader('.modal-footer', doc);
        elemFader.fadeOut();
        var count = 0;
        const interval = setInterval(() => {
            if (count++ > 9) {
                clearInterval(interval);
                expect(elemFader.getOpacity()).to.be.below(0);
                done();
            } else {
                expect(elemFader.getOpacity()).to.be.above(0);
            }
        }, 100);
    });
})