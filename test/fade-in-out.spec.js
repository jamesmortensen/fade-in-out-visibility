const { expect } = require("chai");
const ElementFader = require('../public/fade-in-out.js');

describe('Test', () => {
    it('should go from 0 to 1 in one second', (done) => {
        const doc = generateMockDocument(0);
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
        const doc = generateMockDocument(1);
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

    it('should be able to smoothly handle fadeIn and fadeOut called back to back', (done) => {
        const doc = generateMockDocument(0);
        const elemFader = new ElementFader('.modal-footer', doc);
        elemFader.fadeIn();
        elemFader.fadeOut();
        var count = 0;
        new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                try {
                    console.log('44: opacity = ' + elemFader.getOpacity());
                    if (count === 9) {
                        expect(elemFader.getOpacity()).to.be.above(0.99);
                    } else if (count > 19) {
                        clearInterval(interval);
                        expect(elemFader.getOpacity()).to.be.below(0.01);
                        resolve(true);
                    } else if (count > 9) {
                        expect(elemFader.getOpacity()).to.be.below(1);
                        expect(elemFader.getOpacity()).to.be.above(-0.1);

                    } else {
                        expect(elemFader.getOpacity()).to.be.above(-0.01);
                        expect(elemFader.getOpacity()).to.be.below(1);
                    }
                    count++;
                } catch (e) {
                    console.error('Failing test. Clear interval...');
                    clearInterval(interval);
                    done(e);
                }
            }, 100);
        }).catch((err) => {
            console.log('inside CATCH');
            done(err);
        }).then((isDone) => {
            if (isDone)
                done();
        });
    });
});

function generateMockDocument(opacity) {
    return {
        querySelector: (selector) => {
            return {
                style: {
                    opacity: opacity
                }
            }
        }
    };
}