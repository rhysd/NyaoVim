import {assert} from 'chai';
import NyaoVim from '../helper/nyaovim';

describe('Startup', () => {
    let nyaovim: NyaoVim;
    let client: WebdriverIO.Client<void>;

    before(done => {
        nyaovim = new NyaoVim();
        nyaovim.start().then(() => {
            client = nyaovim.client;
            return client.pause(3000);  // Wait starting nvim process
        }).then(done).catch(done);
    });

    after(done => {
        if (!nyaovim || !nyaovim.isRunning()) {
            return done();
        }
        nyaovim.stop().then(done).catch(e => {
            console.error('after(): ', e);
            done();
        });
    });

    it('opens a window', done => {
        client.getWindowCount().then((count: number) => {
            assert.equal(count, 1);
            done();
        });
    });
});
