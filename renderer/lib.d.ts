declare namespace NodeJS {
    interface Global {
        require: NodeRequireFunction;
    }
}

interface String {
    endsWith(search: string, position?: number): boolean;
}

