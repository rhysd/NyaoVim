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

    it('does not occur any error', done => {
        client.getRenderProcessLogs().then(logs => {
            for (const l of logs) {
                assert.notEqual(l.level, 'error');
                assert.notEqual(l.level, 'warning');
            }
        });
        done();
    });

    it('renders <neovim-editor> in HTML', done => {
        client.element('neovim-editor').then(e => {
            assert.isNotNull(e.value);
            done();
        });
    });

    it('spawns nvim process without error', done => {
        client.execute(() => (document as any).getElementById('nyaovim-editor').editor.process.started)
            .then(result => assert.isTrue(result.value))
            .then(done);
    });
});
