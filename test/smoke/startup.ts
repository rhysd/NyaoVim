import {assert} from 'chai';
import NyaoVim from '../helper/nyaovim';

describe('Startup', function () {
    let nyaovim: NyaoVim;
    let client: WebdriverIO.Client<void>;

    before(function () {
        nyaovim = new NyaoVim();
        return nyaovim.start().then(() => {
            client = nyaovim.client;
            return client.pause(3000);  // Wait for starting nvim process
        });
    });

    after(function (done) {
        if (!nyaovim || !nyaovim.isRunning()) {
            return done();
        }

        nyaovim.stop().then(() => done()).catch(e => {
            console.error('after(): ', e);
            done();
        });
    });

    afterEach(function (done) {
        if (this.currentTest.state !== 'failed') {
            return done();
        }

        client.getRenderProcessLogs().then(logs => {
            console.log('Renderer process logs');
            console.log('=====================\n');
            for (const l of logs) {
                console.log(`[${l.level}] ${l.message}`);
            }
        }).then(() =>
            client.getMainProcessLogs()
        ).then(logs => {
            console.log('Main process logs');
            console.log('=================\n');
            for (const l of logs) {
                console.log(l);
            }
        }).then(done).catch(done);
    });

    it('opens a window', function () {
        return client.getWindowCount().then((count: number) => {
            assert.equal(count, 1);
        }).then(() =>
            nyaovim.browserWindow.isVisible()
        ).then((visible: boolean) => {
            assert.isTrue(visible);
        });
    });

    it('does not occur any error', function () {
        return client.getRenderProcessLogs().then(logs => {
            for (const l of logs) {
                assert.notEqual(l.level, 'error');
                assert.notEqual(l.level, 'warning');
            }
        });
    });

    it('renders <neovim-editor> in HTML', function () {
        return client.element('neovim-editor').then(e => {
            assert.isNotNull(e.value);
        });
    });

    it('spawns nvim process without error', function () {
        return client.execute(() => (document as any).getElementById('nyaovim-editor').editor.process.started)
            .then(result => assert.isTrue(result.value));
    });
});
