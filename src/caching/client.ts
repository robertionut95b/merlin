import NodeCache from "node-cache";

// start cache middleware
const cache = new NodeCache({ stdTTL: 60 * 5 });

export { cache };
