const fs = require('fs');
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

async function save () {
  var data = {}
  await query(master,`SELECT tag FROM wikipages WHERE status='t' and lang='en' ORDER BY lang ASC`).then(rows => {
    rows.map(row => {
      let tag = row.tag.toLowerCase().split("=").pop().replace(/[^\w]+/, '_');
      data[tag] ={}
    })
  })
  fs.writeFile('tmp/tag_list.csv', Object.keys(data).join("\n"), 'utf8', function (err) {
    if (err) console.log(err);
  });
}

async function setup () {
  const structure = fs.readFileSync('./scripts/icons.sql').toString();
  await run(master, structure);
  await save()
}

(async ()=>{ 
  await setup()
})()
