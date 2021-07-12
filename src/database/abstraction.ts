import { database } from "./redis";

export class Value<T> {
    constructor(public key: string, private defaultValue?: T) {
        if (defaultValue) this.set(defaultValue);
    }

    public get(): Promise<[T, Error]> {
        return new Promise((resolve) => {
            database.GET(this.key, (err, res: any) => {
                resolve([res, err]);
            });
        });
    }

    public set(value: T) {
        let val: any = value;
        return new Promise((resolve) => {
            database.SET(this.key, val, resolve);
        });
    }
}

export class HashValue<T> extends Value<T> {
    constructor(public parentKey: string, key: string, defaultValue?: T) {
        super(key);
        if (defaultValue) this.set(defaultValue);
    }

    public get(): Promise<[T, Error]> {
        return new Promise((resolve) => {
            database.HGET(this.parentKey, this.key, (err, res: any) => {
                resolve([res, err]);
            });
        });
    }

    public set(value: T) {
        let val: any = value;

        return new Promise((resolve) => {
            database.HSET(this.parentKey, this.key, val, resolve);
        });
    }
}

export class HashParent extends Value<any> {
    constructor(key: string) {
        super(key);
    }

    public get(): Promise<any> {
        return new Promise((resolve) => {
            database.HGETALL(this.key, (err, res: any) => {
                resolve([res, err]);
            });
        });
    }
}
