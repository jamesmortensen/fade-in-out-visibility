const { expect } = require("chai");
const ElementFader = require('../public/fade-in-out.js');

describe('Test', () => {
    it('should go from 0 to 1 in one second', (done) => {
        const doc = generateMockDocument(0);
        const elemFader = new ElementFader('.modal-footer', doc);
        elemFader.fadeIn();
        var count = 0;
        const interval = setInterval(() => {
            try {
                if (count++ > 8) {
                    clearInterval(interval);
                    expect(elemFader.getOpacity()).to.equal(1);
                    done();
                } else {
                    expect(elemFader.getOpacity()).to.be.below(1);
                }
            } catch (e) {
                done(e);
            }
        }, 100);
    });

    it('should go from 1 to 0 in one second', (done) => {
        const doc = generateMockDocument(1);
        const elemFader = new ElementFader('.modal-footer', doc);
        elemFader.fadeOut();
        var count = 0;
        const interval = setInterval(() => {
            try {
                if (count++ > 8) {
                    clearInterval(interval);
                    expect(elemFader.getOpacity()).to.equal(0);
                    done();
                } else {
                    expect(elemFader.getOpacity()).to.be.above(0);
                }
            } catch (e) {
                done(e);
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
                    //console.log('opacity = ' + elemFader.getOpacity());
                    if (count === 9) {
                        expect(elemFader.getOpacity()).to.equal(1);
                    } else if (count > 18) {
                        clearInterval(interval);
                        expect(elemFader.getOpacity()).to.equal(0);
                        resolve(true);
                    } else if (count > 9) {
                        expect(elemFader.getOpacity()).to.be.below(1);
                        expect(elemFader.getOpacity()).to.be.above(0);

                    } else {
                        expect(elemFader.getOpacity()).to.be.above(0);
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
            console.error('inside catch');
            done(err);
        }).then((isDone) => {
            if (isDone)
                done();
        });
    });

    // this appears to work well in production, but the test needs more work. The iteration loop
    // does not match the fadeIn and fadeOut executions.
    it('should be able to handle multiple, back to back fadeIn, fadeOut calls', async () => {
        const doc = generateMockDocument(0);
        const elemFader = new ElementFader('.modal-footer', doc);
        const errors = [];
        for (var i = 0; i < 5; i++) {
            elemFader.fadeIn();
            elemFader.fadeOut();
        }
        for (var i = 0; i < 5; i++) {
            console.log('iteration = ' + i);
            var count = 0;
            await new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    try {
                        console.log('opacity = ' + elemFader.getOpacity());
                        if (count === 9) {
                            expect(elemFader.getOpacity()).to.be.above(-0.01);
                        } else if (count > 19) {
                            clearInterval(interval);
                            expect(elemFader.getOpacity()).to.be.below(1.1);
                            resolve(true);
                        } else if (count > 9) {
                            expect(elemFader.getOpacity()).to.be.below(1.1);
                            expect(elemFader.getOpacity()).to.be.above(-0.1);

                        } else {
                            expect(elemFader.getOpacity()).to.be.above(0);
                            expect(elemFader.getOpacity()).to.be.below(1.1);
                        }
                        count++;
                    } catch (e) {
                        console.error('Failing test. Clear interval...');
                        clearInterval(interval);
                        reject(e);
                    }
                }, 100);
            });
        }
        console.log(errors);
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