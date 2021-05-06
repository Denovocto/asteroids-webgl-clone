function parse(result, obj){
    var lines = result.split("\n");
    lines.forEach(line => {
        if (line)
        {
            var values = line.trimRight().split(" ");
            switch(values[0].toLowerCase())
            {
                case 'v':
                    var x = parseFloat(values[1]);
                    var y = parseFloat(values[2]);
                    var z = parseFloat(values[3]);
                    obj.vertexes.push(vec3(x, y, z));
                    break;
                case 'f':
                    for(var i = 1; i < 4; i++)
                    {
                        var index = parseInt(values[i]);
                        obj.indexes.push(index - 1);
                    }
                    break;
                case '#':
                    break;
            }
        }
    });
    for(vertex in obj.vertexes){
        var r = Math.random() * (1 - 0.2) + 0.2;
        var g = Math.random() * (1 - 0.2) + 0.2;
        var b = Math.random() * (1 - 0.2) + 0.2;
        obj.colors.push(vec3(r, g, b));
    }
}
/**
 * creates an object from a specification file format such as .obj
 * @param  {string} parserFunction is the function that will parse a specific file format.
 * @return {Object} with the vertexes and indexes keys
 */
function readObjectFromFile(update)
{
    const fileSelector = document.getElementById('file-selector');
    const reader = new FileReader();
    reader.onload = function () {
        let object = {
            vertexes: [],
            indexes: [],
            colors: []
        };
        parse(this.result, object);
        update(object);
    };
    fileSelector.addEventListener('change', (event) => {
        file = event.target.files[0];
        reader.readAsText(file);
    });
}