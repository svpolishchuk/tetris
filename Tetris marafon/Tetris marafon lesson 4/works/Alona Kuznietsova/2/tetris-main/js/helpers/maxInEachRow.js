export const maxInEachRow = (tetromino) => {

    let maxOnePerRow = [];

    tetromino.forEach(row => {
        const rowLength = row.reduce((a, b) => b ? a + 1 : a, 0);
        maxOnePerRow.push(rowLength);
    })

    const max = maxOnePerRow.sort((a, b) => b - a)[0]

    return max;
}