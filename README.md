# font-osm

[OpenStreetMap (OSM)](https://www.openstreetmap.org/) is an open source, community maintained geospatial database. Nodes, Ways and Relations are tagged by the community with 3000+ unique tags as indexed by [OpenStreetMap TagInfo](https://taginfo.openstreetmap.org/). Font-Awesome is amazing collection of 1000+ clean high quality SVG icons licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/) (Public Domain) and also available as [icon font](https://github.com/gmgeo/osmic/tree/master/font).

## `font-osm` is a javascript utility for quickly returning an appropriate Font-Awesome 6 Icon for any given Open Street Map Tag.

### Powered by ChatGTP

The core data source is a csv containing the `OSM Tag`, `Font-Awesome 6 Icon Name` and `Unicode String`. It was created with the following ChatGTP prompt:

```
Please create a table correlating Open Street Map Tags with Font-Awesome 6 Icons and Unicode String.
```

Queries were done in batches, results formatted and checked against the source tags.  Some associations my not be entirely accurate or perfect, either because:

- the tag is too abstract
- font-awesome doesn't contain an appropriate tag
- or there were too many options for ChatGTP to chose from
- or not enough data to choose correctly.

Nobodies perfect.

### Corrections

Edit `/src/index.csv` and run `yarn build` to regenerate the compiled library. Pull requests are welcome.