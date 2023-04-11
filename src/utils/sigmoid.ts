// sigmoid function with a range of [min, max] and scale s
export function sigmoid(x: number, min: number, max: number, s: number) {
    //   map the value x with range [min, max] to [0, 1] linearly
    // then apply the sigmoid function
    // https://en.wikipedia.org/wiki/Sigmoid_function
    const y = (x - min) / (max - min);
    return 1 / (1 + Math.exp(-s * y));
}
