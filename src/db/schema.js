import { pgTable, serial, text, integer, date, timestamp, boolean, primaryKey, unique } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  birth_date: date("birth_date").notNull(),
  language_id: integer("language_id").references(() => languages.id),
  createdAt: timestamp("created_at").defaultNow(),
});


export const languages = pgTable("languages", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
});


export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  subscriber_id: integer("subscriber_id").notNull().references(() => users.id),
  target_id: integer("target_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique().on(table.subscriber_id, table.target_id)
]);


export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  adult: boolean("adult").notNull().default(true),
  belongs_to_collection: text("belongs_to_collection"),
  backdrop_path: text("backdrop_path"),
  budget: integer("budget"),
  homepage: text("homepage"),
  imdb_id: text("imdb_id").notNull().unique(),
  original_language: text("original_language").notNull(),
  original_title: text("original_title").notNull(),
  overview: text("overview").notNull(),
  popularity: integer("popularity").notNull(),
  poster_path: text("poster_path").notNull(),
  release_date: timestamp("release_date").notNull(),
  revenue: integer("revenue"),
  runtime: integer("runtime").notNull(),
  status: text("status").notNull(),
  tagline: text("tagline"),
  title: text("title").notNull(),
  video: boolean("video").notNull().default(true),
  vote_average: integer("vote_average").notNull(),
  vote_count: integer("vote_count").notNull(),
});


export const genres = pgTable("genres", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
  });


export const movieGenres = pgTable("movie_genres",
    {
      movieId: integer("movie_id")
        .notNull()
        .references(() => movies.id, { onDelete: "CASCADE" }),
      genreId: integer("genre_id")
        .notNull()
        .references(() => genres.id, { onDelete: "CASCADE" }),
    },
    (table) => [
        primaryKey({columns: [table.movieId, table.genreId]})
    ],
);


