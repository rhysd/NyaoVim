/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />

declare module NodeJS {
    interface Global {
        require(m: string): any;
    }
}

// Temporary copy of 'react-dom' module type definitions
// from https://github.com/borisyankov/DefinitelyTyped/pull/6205
declare namespace __React {

    namespace __DOM {
        function findDOMNode<TElement extends Element>(
            componentOrElement: __React.Component<any, any> | Element): TElement;
        function findDOMNode(
            componentOrElement: __React.Component<any, any> | Element): Element;

        function render<P>(
            element: DOMElement<P>,
            container: Element,
            callback?: () => any): DOMComponent<P>;
        function render<P, S>(
            element: ClassicElement<P>,
            container: Element,
            callback?: () => any): ClassicComponent<P, S>;
        function render<P, S>(
            element: ReactElement<P>,
            container: Element,
            callback?: () => any): Component<P, S>;

        function unmountComponentAtNode(container: Element): boolean;

        var version: string;

        function unstable_batchedUpdates<A, B>(callback: (a: A, b: B) => any, a: A, b: B): void;
        function unstable_batchedUpdates<A>(callback: (a: A) => any, a: A): void;
        function unstable_batchedUpdates(callback: () => any): void;

        function unstable_renderSubtreeIntoContainer<P>(
            parentComponent: Component<any, any>,
            nextElement: DOMElement<P>,
            container: Element,
            callback?: (component: DOMComponent<P>) => any): DOMComponent<P>;
        function unstable_renderSubtreeIntoContainer<P, S>(
            parentComponent: Component<any, any>,
            nextElement: ClassicElement<P>,
            container: Element,
            callback?: (component: ClassicComponent<P, S>) => any): ClassicComponent<P, S>;
        function unstable_renderSubtreeIntoContainer<P, S>(
            parentComponent: Component<any, any>,
            nextElement: ReactElement<P>,
            container: Element,
            callback?: (component: Component<P, S>) => any): Component<P, S>;


    }
}

declare module "react-dom" {
    import DOM = __React.__DOM;
    export = DOM;
}

