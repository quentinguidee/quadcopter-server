import { Value } from "./database/abstraction";

const io = require("socket.io")({
    cors: true,
});

async function emit(value: Value<any>) {
    let [res, err] = await value.get();
    if (err) console.error(err);
    io.emit(value.key, res);
}

const socket = {
    io,
    emit,
};

export default socket;
