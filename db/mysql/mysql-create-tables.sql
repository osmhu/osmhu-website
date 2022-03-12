USE osm_hu;

CREATE TABLE places (
	osm_id BIGINT NOT NULL DEFAULT 0 PRIMARY KEY,
	name VARCHAR(128) NOT NULL DEFAULT '',
	processed INT NOT NULL DEFAULT 0,
	lat DOUBLE,
	lon DOUBLE,
	parent_id BIGINT NULL REFERENCES places(osm_id),
	population INT NOT NULL DEFAULT 0,
	UNIQUE (name)
);

CREATE TABLE streetnames (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128) NOT NULL DEFAULT ''
);

CREATE TABLE placestreets (
	osm_id BIGINT NOT NULL DEFAULT 0,
	place_id BIGINT NOT NULL REFERENCES places(osm_id) ON UPDATE CASCADE,
	streetname_id INT NOT NULL REFERENCES streetnames(id)
);

CREATE TABLE tags (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128) NOT NULL DEFAULT '',
	value VARCHAR(128) NOT NULL DEFAULT ''
);

CREATE TABLE placetags (
	place_id BIGINT NOT NULL REFERENCES places(osm_id),
	tag_id INT NOT NULL REFERENCES tags(id),
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Comment out those that are integrated avove!!
ALTER TABLE streetnames ADD COLUMN validated INT NOT NULL DEFAULT 0;
ALTER TABLE streetnames ADD COLUMN name_case binary(255) NULL DEFAULT NULL;
CREATE INDEX ix_placestreets_streetname_id ON placestreets (streetname_id);

CREATE INDEX ix_placestags_place_id ON placetags (place_id);
CREATE INDEX ix_placestags_tag_id ON placetags (tag_id);
