import { create } from "twrnc";

// @ts-expect-error We won't be creating type definitions for tailwind config
import config from "./tailwind.config.js";

const tw = create(config);

export default tw;
