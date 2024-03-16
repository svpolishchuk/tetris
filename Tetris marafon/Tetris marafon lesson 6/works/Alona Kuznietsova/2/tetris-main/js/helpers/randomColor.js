const colors = [
    "rgb(48, 118, 66)",
    "rgb(155, 29, 29)",
    "rgb(234, 121, 9)",
    "rgb(226, 219, 14)",
    "rgb(41, 149, 216)",
    "rgb(211, 20, 109)",
    "rgb(162, 30, 234)",
    "rgb(57, 223, 11)",
    "rgb(0, 67, 255)"
]

export function randomColor() {
    const random = colors[Math.floor(Math.random()*colors.length)];
    return random;
}
