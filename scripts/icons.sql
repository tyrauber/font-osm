CREATE TABLE icons (
  id INTEGER PRIMARY KEY,
  key STRING NOT NULL UNIQUE,
  unicode TEXT NOT NULL UNIQUE,
  label STRING,
  terms STRING,
  styles STRING,
  svg BLOB
);

CREATE UNIQUE INDEX icons_idx on icons (key);

CREATE TRIGGER fts_ai AFTER INSERT ON icons
  BEGIN
      INSERT INTO fts (rowid, key, label, terms)
      VALUES (new.id, new.key, new.label, new.terms);
  END;

CREATE TRIGGER user_ad AFTER DELETE ON icons
  BEGIN
      INSERT INTO fts (user_fts, rowid,  key, label, terms)
      VALUES ('delete', old.id, old.key, old.label, old.terms);
  END;

CREATE TRIGGER user_au AFTER UPDATE ON icons
  BEGIN
      INSERT INTO user_fts (fts, rowid,  key, label, terms)
      VALUES ('delete', old.id, old.key, old.label, old.terms);
      INSERT INTO fts (rowid, key, label, terms)
      VALUES (new.id,  new.key, new.label, new.terms);
  END;

CREATE VIRTUAL TABLE fts USING fts5(
  key, 
  label,
  terms, 
  styles UNINDEXED,
  svg UNINDEXED,
  content='icons', 
  content_rowid='id' 
);

CREATE TABLE 'fts_config'(k PRIMARY KEY, v) WITHOUT ROWID;
CREATE TABLE 'fts_data'(id INTEGER PRIMARY KEY, block BLOB);
CREATE TABLE 'fts_docsize'(id INTEGER PRIMARY KEY, sz BLOB);
CREATE TABLE 'fts_idx'(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID;
