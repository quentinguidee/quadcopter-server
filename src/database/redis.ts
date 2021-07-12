import redis from "redis";

export const database = redis.createClient({
    host: "redis",
});

database.on("error", (e) => console.error(e));
database.on("connect", () => console.log("Redis connection established"));
