var args = process.argv.slice(2);

const sqlite3 = require('sqlite3').verbose();
const master = new sqlite3.Database('./tmp/font-osm.db');

async function query(db, query){
  return new Promise(function(resolve,reject){
    db.all(query, function(err,rows){
      if(err){return reject(err);}
      resolve(rows);
    });
  });
}

async function search (term='') {
  const data = await query(master, `SELECT description, tags_combination FROM wikipages WHERE tag = '${term}' AND lang='en' LIMIT 1;`).then(o => o?.pop())
  if(data?.description){
    term += ` ${data?.description}`
  }
  return await query(master, `SELECT * FROM fts WHERE fts MATCH '${term}' ORDER BY rank LIMIT 1;`)
  .then(o => o.map(o => ({
    ...o, 
    terms: o.terms.split("|"),
    styles: o.styles.split("|"),
    svg: JSON.parse(o.svg)
  })).pop())
}

if(args[0]){
  (async()=> console.log(await search(args[0])))()
}
