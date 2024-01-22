import * as d3 from "d3";

export const easeMap: Record<string, any> = {
    "linear": d3.easeLinear,
    "ease-in": d3.easeCubicIn,
    "ease-out": d3.easeCubicOut,
    "ease-in-out": d3.easeCubicInOut,
    "ease-in-sine": d3.easeSinIn,
    "ease-out-sine": d3.easeSinOut,
    "ease-in-out-sine": d3.easeSinInOut,
    "ease-in-quad": d3.easeQuadIn,
    "ease-out-quad": d3.easeQuadOut,
    "ease-in-out-quad": d3.easeQuadInOut,
    "ease-in-cubic": d3.easeCubicIn,
    "ease-out-cubic": d3.easeCubicOut,
    "ease-in-out-cubic": d3.easeCubicInOut,
    "ease-in-quart": d3.easePolyIn(4),
    "ease-out-quart": d3.easePolyOut(4),
    "ease-in-out-quart": d3.easePolyInOut(4),
    "ease-in-quint": d3.easePolyIn(5),
    "ease-out-quint": d3.easePolyOut(5),
    "ease-in-out-quint": d3.easePolyInOut(5),
    "ease-in-expo": d3.easeExpIn,
    "ease-out-expo": d3.easeExpOut,
    "ease-in-out-expo": d3.easeExpInOut,
    "ease-in-circ": d3.easeCircleIn,
    "ease-out-circ": d3.easeCircleOut,
    "ease-in-out-circ": d3.easeCircleInOut,
    "ease-in-back": d3.easeBackIn,
    "ease-out-back": d3.easeBackOut,
    "ease-in-out-back": d3.easeBackInOut,
    "ease-in-elastic": d3.easeElasticIn,
    "ease-out-elastic": d3.easeElasticOut,
    "ease-in-out-elastic": d3.easeElasticInOut,
    "ease-in-bounce": d3.easeBounceIn,
    "ease-out-bounce": d3.easeBounceOut,
    "ease-in-out-bounce": d3.easeBounceInOut
}