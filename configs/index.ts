import { config as configProduct } from "./app";
import { config as configDevelopment } from "./app_local";
import { config as configTest } from "./app_test";

export const configType = (node_env = "development") => {
    console.log(node_env);
    return node_env === "development" ? configDevelopment : node_env === "test" ? configTest : configProduct;
}