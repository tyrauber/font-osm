
const fs = require("fs");
const { parse } = require('csv-parse');

const data = {}
fs.createReadStream("./src/index.csv")
.pipe(parse({ delimiter: ',', relax_column_count: true }))
.on('data', (row) => {
  if(row[0] && row[2]){
    data[row[0]] = row[2]
  }
})
.on("close", () => {
  fs.writeFile('./src/index.json', JSON.stringify(data), 'utf8', function (err) {
    if (err) console.log(err);
  });
const file = `var FontOSM = (() => ({
${Object.entries(data).map(([k,v])=> `\t"${k}": "${v}"`).join(',\n')}
}))();
`
 fs.writeFile('./dist/index.js', file, 'utf8', function (err) {
    if (err) console.log(err);
  });
});