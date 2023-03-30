#!/bin/bash
# sh scripts/db.sh

clean (){
  rm -rf tmp Font-Awesome-6.x
  mkdir -p ./dist/svgs/solid ./dist/svgs/regular ./dist/svgs/brands ./tmp
}

taginfo () {
  wget -qO- https://taginfo.openstreetmap.org/download/taginfo-master.db.bz2 | gunzip -c > tmp/taginfo-master.db
  wget -qO- https://taginfo.openstreetmap.org/download/taginfo-wiki.db.bz2 | gunzip -c > tmp/taginfo-wiki.db
}

font_awesome () {
  wget -qO- https://github.com/FortAwesome/Font-Awesome/archive/refs/heads/6.x.zip | bsdtar -xvf-
  cp Font-Awesome-6.x/metadata/icons.json dist/font-awesome.json
  cp -r Font-Awesome-6.x/svgs dist/svgs
}

build (){
  sqlite3 ./tmp/taginfo-master.db ".dump popular_keys" | sqlite3 dist/font-osm.db
  sqlite3 ./tmp/taginfo-wiki.db ".dump 'wikipages'" | sqlite3 dist/font-osm.db
  node ./scripts/build.js
}

backup (){
  sqlite3 ./dist/font-osm.db ".dump" > tmp/font_osm.sql
  sqlite3 -header -separator "\t" ./dist/font-osm.db "select * FROM icons;" > tmp/font-awesome.tsv
  sqlite3 -header -separator "\t" ./dist/font-osm.db "select tag,description,tags_combination FROM wikipages;" > tmp/taginfo-wiki.tsv
  sqlite3 -header -separator "," ./dist/font-osm.db "SELECT tag,value
  FROM wikipages WHERE status='t' and lang='en'
  ORDER BY 
   CASE key
      WHEN 'amenity' THEN 1
      WHEN 'shop' THEN 2
      WHEN 'leisure' THEN 3
      WHEN 'tourism' THEN 4
      ELSE 5
   END, lang ASC" > tmp/taginfo.csv
}

clean
taginfo
font_awesome
build
clean