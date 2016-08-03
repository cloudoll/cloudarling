
CREATE TABLE area
(
  id int,
  title character varying(30) NOT NULL,
  parent_id int,
  short_name character varying(30),
  area_code int,
  zip_code int,
  pinyin character varying(100),
  lng character varying(20),
  lat character varying(20),
  level integer NOT NULL,
  "position" character varying(255),
  sort integer,
  CONSTRAINT area_pkey PRIMARY KEY (id)
)