/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

interface Constructor<T> {
    new(...args: any[]): T;
}

/**
 * An interface to match all Objects, but not primitives.
 */
interface Base { }

/**
 * A subclass-factory style mixin that extends `superclass` with a new subclass
 * that implements the interface `M`.
 */
type Mixin<M> =
    <C extends Base>(superclass: Constructor<C>) => Constructor<M & C>;

/**
 * The Polymer function and namespace.
 */
declare var Polymer: Polymer;

/**
 * The Polymer Interface
 */
declare interface Polymer {

    /**
     * The "Polymer function" for backwards compatibility with Polymer 1.x.
     */
    (definition: any): void;

    /**
     * A base class for Polymer custom elements that includes the
     * `Polymer.MetaEffects`, `Polymer.BatchedEffects`, `Polymer.PropertyEffects`,
     * etc., mixins.
     */
    Element: PolymerElementConstructor;

    ElementMixin: Mixin<PolymerElement>;

    PropertyEffects: Mixin<PolymerPropertyEffects>;

    BatchedEffects: Mixin<PolymerBatchedEffects>;

    GestureEventListeners: Mixin<HTMLElement>;

    Gestures: PolymerGestures;

    LazyImportsMixin: Mixin<LazyImportsMixin>;

    RenderStatus: RenderStatus;

    IronMeta: any;

    AppLayout: {
        scroll: (options: object) => void;
    };

    importHref: (href: string, onload?: Function, onerror?: Function, optAsync?: boolean) => HTMLLinkElement;

    mixinBehaviors: <T>(mixixs: Array<any>, elem: T) => T;

    dom: (elem: HTMLElement) => any;


}

declare interface PolymerElementConstructor {
    new(): PolymerElement;
}

declare class PolymerElement extends PolymerMetaEffects {
    static readonly template: HTMLTemplateElement;
    static finalized: boolean;

    $: any;
    rootPath: string;

    static finalize(): void;

    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldVal: any, newVal: any, ns: string): void;
    updateStyles(properties: string[]): void;
    resolveUrl(url: string, baseURI?: string): string;
    resolveCss(cssText: string, baseURI: string): string;
    pathFromUrl(url: string): string;

}

declare class PolymerPropertyEffects extends HTMLElement {
    ready(): void;
    linkPaths(to: string, from: string): void;
    unlinkPaths(path: string): void;
    notifySplices(path: string, splices: any[]): void;
    get(path: string | (string | number)[], root: any): any;
    set(path: string | (string | number)[], value: any): void;
    push(path: string, ...items: any[]): any;
    pop(path: string): any;
    shift(path: string): any;
    unshift(path: string): number;
    splice(path: string, start: number, removeCount?: number, ...items: Array<any>): Array<any>;
    notifyPath(path: string): void;
}

declare class PolymerGestures {
    addListener(element: any, eventName: string, listener: (event: Event) => void): void;
}

declare class RenderStatus {
    afterNextRender(context: any, callback: () => void, args?: Array<any>): void;
    beforeNextRender(context: any, callback: () => void, args?: Array<any>): void;
}

declare class LazyImportsMixin {
    importLazyGroup(groupName: string): Promise<ImportLazyGroupResult>;
}
interface ImportLazyGroupResult {
    failed: Array<string>;
    loaded: Array<string>;
}

declare class PolymerBatchedEffects extends PolymerPropertyEffects {
    // _propertiesChanged(currentProps, changedProps, oldProps): void;
    // _setPropertyToNodeFromAnnotation(node, prop, value): void;
    // _setPropertyFromNotification(path, value, event): void;
    // _setPropertyFromComputation(prop, value): void;
    // _enqueueClient(client): void;
    // _flushClients(): void;
    setProperties(props: any): void;
}

declare class PolymerMetaEffects extends PolymerBatchedEffects {
    // _clearPropagateEffects(): void;
    // _createPropertyFromInfo(name: string, info): void;
    // _setPropertyDefaults(properties): void;
}
