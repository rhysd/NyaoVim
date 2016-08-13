import {assert} from 'chai';
import NyaoVim from '../helper/nyaovim';

describe('Startup', () => {
    let nyaovim: NyaoVim;
    let client: WebdriverIO.Client<void>;

    before(done => {
        nyaovim = new NyaoVim();
        nyaovim.start().then(() => {
            client = nyaovim.client;
            return client.waitUntilWindowLoaded();
        }).then(done);
    });

    after(done => {
        if (nyaovim && nyaovim.isRunning()) {
            nyaovim.stop().then(done);
        }
    });

    it('opens a window', done => {
        client.getWindowCount().then((count: number) => {
            assert.equal(count, 1);
            done();
        });
    });
});
