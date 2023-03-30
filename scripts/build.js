const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const master = new sqlite3.Database('./dist/font-osm.db');

async function query(db, query){
  return new Promise(function(resolve,reject){
    db.all(query, function(err,rows){
      if(err){return reject(err);}
      resolve(rows);
    });
  });
}

async function run(db, query){
  return new Promise(function(resolve,reject){
    db.run(query, function(err,rows){
      console.log(rows, err)
      if(err){return reject(err);}
      resolve(rows);
    });
  });
}

async function insert (data){
  const sql = `INSERT INTO icons\
   (${Object.keys(data).join(",")}) VALUES (\
   ${Object.values(data).map(o => `'${o.replace(/\'/g,"''")}'`).join(",")}
  );`
  return await run(master,sql);
}

async function setup () {
  const structure = fs.readFileSync('./scripts/icons.sql').toString();
  await run(master, structure);
}

async function read (){
  fs.readFile('./dist/font-awesome.json', 'utf8', async function (err, data) {
    if (err) throw err;
    data = Object.entries(JSON.parse(data))
    data.forEach(async([k,v])=> {     
      await insert({
        key: k, 
        unicode: v.unicode,
        label: v.label,
        terms: v.search?.terms?.join("|"),
        styles: v.styles.join("|"),
        svg: JSON.stringify(v.svg)
      })
    })
  });
}

async function search (term='') {
  return await query(master, `SELECT * FROM icons WHERE terms LIKE '%${term}%' LIMIT 1;`)
  .then(o => o.map(o => ({
    ...o, 
    terms: o.terms.split("|"),
    styles: o.styles.split("|"),
    svg: JSON.parse(o.svg)
  })).pop())
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function generate () {
  const results = {}
  const rows = await query(master, `SELECT * FROM popular_keys ORDER BY count DESC`)
  await asyncForEach(rows, async (row) => {
    const data = await search(row.key)
    if(data){
      results[row.key] = data;
    }
  });
  fs.writeFileSync('src/font-osm.json', JSON.stringify(results, null, 2));
}

(async ()=>{ 
  await setup()
  await read()
  await generate() 
})()

// const master = new sqlite3.Database('./src/taginfo-master.db');
// const wiki = new sqlite3.Database('./src/taginfo-wiki.db');

// async function query(db, query){
//   return new Promise(function(resolve,reject){
//     db.all(query, function(err,rows){
//       if(err){return reject(err);}
//       resolve(rows);
//     });
//   });
// }

// (async () => {
//   const data = {}
//   await query(master, `SELECT * FROM popular_keys ORDER BY count DESC`)
//   .then(row=> {
//     data[row.key] = row
//   })
//   console.log(data)
// })();
// // 
// const data = master.serialize(() => {
//   return master.map("SELECT * FROM popular_keys ORDER BY count DESC;", (err, row) => {
//       console.log(row.id)
//       return row
//     //data[row.id] = row;
//   });
// });
// master.close();

// console.log(data)


// function query(db, sql, params={}) {
//   console.log(db, sql, params)
//   return new Promise((resolve, reject) => {
//     return db.run(sql, function (err, res) {
//       if (err) {
//         console.error("DB Error: Insert failed: ", err.message);
//         return reject(err.message);
//       }
//       console.log({res})
//       resolve(res);
//     });
//   });
// }

