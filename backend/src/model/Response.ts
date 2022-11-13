export default class Response{
    private _status = true;
    private _message = "";
    private _data?: {[index: string] : string | boolean };

    set status(value: boolean) {
        this._status = value;
    }

    get status(): boolean {
        return this._status;
    }

    set message(value: string) {
        this._message = value;
    }

    get message(): string {
        return this._message;
    }

    set data(value: { [index: string]: string | boolean }) {
        this._data = value;
    }
}