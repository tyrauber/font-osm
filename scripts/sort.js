
const fs = require("fs");
const { parse } = require('csv-parse');

// Source Tags
let tags = []
const sourceData = fs.createReadStream("./src/source_data.csv");
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
//   const res = Object.entries(data).filter(([k,v])=> v == null)
//   console.log(Object.keys(res).length);
//   console.log(res.map(o => o[0]).map(o => o).join(","))  
}

// rl2.on("line", (row) => {
//   row = row.split(",")
//   if(!data[row[0]]){
//     data[row[0]] = null
//   }
// });
// rl2.on("close", () => {
//   const res = Object.entries(data).filter(([k,v])=> v == null)
//   console.log(Object.keys(res).length);
//   console.log(res.map(o => o[0]).map(o => o).join(","))
// });



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
  const unicode = row[row.length-1].replace("\\", '')
  data[id] = {name: icon, unicode: unicode}
}

const ordered = (data)=> Object.keys(data).sort().reduce(
  (obj, key) => { 
    obj[key] = data[key]; 
    return obj;
  }, 
  {}
);

// rl.on("line", (row) => {
//   row = row.split(",")
//   const id = row[0].replace(/[^\w]/, '_').toLowerCase();
//   const icon = (!row[row.length-2].match(/^(fa-)/)) ? `fa-${row[row.length-2]}` : row[row.length-2];
//   const unicode = row[row.length-1].replace("\\", '')
//   data[id] = {name: icon, unicode: unicode}
// });
// rl.on("close", () => {
//   let output = "OSM Tag,Font-Awesome 6 Icon,Unicode"
//   output += Object.entries(ordered(data)).map(([k,v]) => [k, ...Object.values(v)].join(",")).join("\n")
//     fs.writeFile('src/export.csv', output, 'utf8', function (err) {
//     if (err) console.log(err);
//   });
// });

// const st2 = fs.createReadStream("./src/amenity.csv");
// const rl2 = readline.createInterface({ input: st2 });


// rl2.on("line", (row) => {
//   row = row.split(",")
//   if(!data[row[0]]){
//     data[row[0]] = null
//   }
// });
// rl2.on("close", () => {
//   const res = Object.entries(data).filter(([k,v])=> v == null)
//   console.log(Object.keys(res).length);
//   console.log(res.map(o => o[0]).map(o => o).join(","))
// });

// Please provide a table correlating the following tags with the most suitable font-awesome 6 fa-solid icons and unicode strings.
// ranger_station,register_office,sanitary_dump_station,shower,smoking_area,stables,swingerclub,table,ticket_booth,trolley_bay,vacuum_cleaner,waste_transfer_station,water,carpet_washing,prep_school,administration,archive,cloakroom,clothes_dryer,coast_guard,concert_hall,concession_stand,conference_centre,customs,device_charging_station,financial_advice,payment_centre,polling_station,refugee_housing,sanatorium,snow_removal_station,ticket_validator,tourist_bus_parking,traffic_park,training,vehicle_ramp,washing_machine,binoculars,surf_school,Kneippbecken,alm,animal_effluent_disposal,animal_hitch,animal_training,bear_box,bicycle_library,bicycle_trailer_sharing,bikeshed,bird_bath,blood_bank,buggy_parking,canoe_hire,canteen,chair,changing_room,checkpoint,club,clubhouse,coast_radar_station,consulate,convention_centre,crucifix,dancing_school,dead_pub,dog_parking,dog_toilet,dormitory,harbourmaster,hydrant,kick-scooter_rental,milk_dispenser,motorcycle_taxi,mtb_school,osmica,payment_terminal,piano,place_of_mourning,post_depot,printer,proposed,reception_desk,refugee_site,rehearsal_studio,relay_box,rv_storage,sailing_school,seat,security_booth,ski_rental,ski_school,sport_school,stage,stool,stroller_parking,student_accommodation,swimming_school,television,trade_school,tuition,veterinary_pharmacy,vivarium,waste_dump_site,whirlpool,workshop,yacht_club,first_aid,firstaid,sceptic_tank,septic_tank,street_lamp,street_light