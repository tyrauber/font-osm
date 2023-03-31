
const fs = require("fs");
const { parse } = require('csv-parse');

// Source Tags
let tags = []
const sourceData = fs.createReadStream("./tmp/tag_list.csv");
sourceData
.pipe(parse({ delimiter: ',', relax_column_count: true }))
.on('data', (row) => {
  tags.push(formatTag(row.pop()))
})
.on("close", () => {
  tags = tags.filter((value, index, array) => array.indexOf(value) === index);
});


const data = {}
const stream = fs.createReadStream("./src/index.csv");
stream
.pipe(parse({ delimiter: ',', from_line: 2,  relax_column_count: true }))
.on('data', (row) => {
  if(row.length > 3){
    console.log(row)
  }
  format(row)
})
.on("close", () => {
  missing(data)
  save(data)
});


const missing = (results) => {
  const res = tags.filter(o => !data[o])
  console.log({Missing: res.join(",")})
}


const save = (data) =>{
  let output = "OSM Tag,Font-Awesome 6 Icon,Unicode"
  output += Object.entries(ordered(data)).map(([k,v]) => [k, ...Object.values(v)].join(",")).join("\n")
  fs.writeFile('src/export.csv', output, 'utf8', function (err) {
    if (err) console.log(err);
  });
}

const formatTag = (str) => {
  return str?.replace(/[^\w]/, '_').toLowerCase()
}

const format = (row) => {
  const id = formatTag(row[0]);
  const icon = (!row[row.length-2].match(/^(fa-)/)) ? `fa-${row[row.length-2]}` : row[row.length-2];
  //const unicode = '\u'+row[row.length-1].replace("\\", '')
  const unicode = row[row.length-1]
  data[id] = {name: icon, unicode: unicode}
}

const ordered = (data)=> Object.keys(data).sort().reduce(
  (obj, key) => { 
    obj[key] = data[key]; 
    return obj;
  }, 
  {}
);
