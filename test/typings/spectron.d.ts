declare namespace WebdriverIO {
    export interface AuditOptions {
        ignoreWarnings?: boolean;
    }
    export interface AuditResult {
        readonly message: string;
        readonly failed: boolean;
        readonly results: {
            readonly code: string;
            readonly elements: string[];
            readonly message: string;
            readonly severity: 'Warning' | 'Severe';
            readonly url: string;
        };
    }
    export interface ConsoleMessage {
        readonly level: string;
        readonly message: string;
        readonly source: string;
        readonly timestamp: number;
    }
    export interface Client<T> {
        getMainProcessLogs(): Promise<string[]>;
        getRenderProcessLogs(): Promise<ConsoleMessage[]>;
        getSelectedText(): Promise<string>;
        getWindowCount(): Promise<number>;
        waitUntilTextExists(selector: string, text: string, timeout?: number): Promise<void>;
        waitUntilWindowLoaded(timeout?: number): Promise<void>;
        windowByIndex(index: number): any;
        auditAccessibility(options: AuditOptions): AuditResult;
    }
}
declare module 'spectron' {
    export interface ApplicationOptions {
        path: string;
        args?: string[];
        cwd?: string;
        env?: object;
        host?: string;
        port?: number;
        nodePath?: string;
        connectionRetryCount?: number;
        connectionRetryTimeout?: number;
        quitTimeout?: number;
        requireName?: string;
        startTimeout?: number;
        waitTimeout?: number;
        debuggerAddress?: string;
        chromeDriverLogPath?: string;
    }
    export class Application {
        readonly client: WebdriverIO.Client<void>;
        readonly electron: any;
        readonly browserWindow: any;
        readonly webContents: any;
        readonly mainProcess: any;
        readonly rendererProcess: any;

        constructor(options: ApplicationOptions);
        start(): Promise<void>;
        stop(): Promise<void>;
        restart(): void;
        isRunning(): boolean;
    }
}
