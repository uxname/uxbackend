let available_elements = [
    {letter: 'X', chance: 7},
    {letter: 'o', chance: 7},
    {letter: '0', chance: 7},
    {letter: '1', chance: 7},
    {letter: '2', chance: 7},
    {letter: '3', chance: 7},
    {letter: 'H', chance: 8}
];

function generate(max_height, max_width) {
    let generated_level = [];

    function generate_line(max_width) {
        let generated_line = [];

        function generate_letter() {
            const current_random = Math.floor(Math.random() * available_elements.length + 5);
            if (current_random >= 7) {
                return ' '
            } else {
                return available_elements[current_random].letter
            }
        }

        for (let i = 0; i <= max_width; i++) {
            generated_line.push(generate_letter())
        }

        return generated_line.join('');
    }

    for (let i = 0; i <= max_height; i++) {
        generated_level.push('"' + generate_line(max_width) + '"');
    }

    return generated_level.join(',\n');
}

console.log(generate(40, 20));
