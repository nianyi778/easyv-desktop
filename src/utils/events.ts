import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";
import { Interaction } from "@/type/Interactions.type";
const concurrency = 1;

export enum StartState {
    default,
    start,
    pause,
    resume,
    close
}

class QueueAsyncWorker {
    private eventCallbacks: Map<number, (arg: Interaction) => void>;
    private interactions: Interaction[];
    private startState: StartState;

    constructor() {
        this.eventCallbacks = new Map();
        this.interactions = [];
        this.startState = StartState.default;
    }

    asyncWorker = async (arg: Interaction): Promise<void> => {
        // console.log(this.startState, 'startState', arg)
        // if (this.startState === StartState.start) {
        const callbacks = Array.from(this.eventCallbacks.values());
        for (const callback of callbacks) {
            callback(arg);
        }
        // } else {
        //     this.interactions.push(arg);
        // }

    }

    addEventListener(callback: (arg: Interaction) => void): number {
        const key = Date.now();
        this.eventCallbacks.set(key, callback);
        return key;
    }

    removeEventListener(key: number): void {
        this.eventCallbacks.delete(key);
    }

    // updateEventStart(start: StartState): void {
    //     if (start === StartState.start && Array.isArray(this.interactions)) {
    //         Promise.all(this.interactions.map(i => q.unshift(i)))
    //         // this.interactions.forEach(value => {
    //         //     q.unshift(
    //         //         value
    //         //     )
    //         // });
    //     }
    //     this.startState = start;
    //     this.interactions = [];
    // }
}

export const queueWorker = new QueueAsyncWorker();

export const q: queueAsPromised<Interaction> = fastq.promise(
    queueWorker.asyncWorker,
    concurrency
);