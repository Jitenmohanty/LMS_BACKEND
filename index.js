import {availableParallelism} from "node:os"

const numsCpus = availableParallelism();
console.log(numsCpus);          
                