CREATE TABLE "genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "movie_genres" (
	"movie_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "movie_genres_movie_id_genre_id_pk" PRIMARY KEY("movie_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"adult" boolean DEFAULT true NOT NULL,
	"belongs_to_collection" text,
	"backdrop_path" text,
	"budget" integer,
	"homepage" text,
	"imdb_id" text NOT NULL,
	"original_language" text NOT NULL,
	"original_title" text NOT NULL,
	"overview" text NOT NULL,
	"popularity" integer NOT NULL,
	"poster_path" text NOT NULL,
	"release_date" timestamp NOT NULL,
	"revenue" integer,
	"runtime" integer NOT NULL,
	"status" text NOT NULL,
	"tagline" text,
	"title" text NOT NULL,
	"video" boolean DEFAULT true NOT NULL,
	"vote_average" integer NOT NULL,
	"vote_count" integer NOT NULL,
	CONSTRAINT "movies_imdb_id_unique" UNIQUE("imdb_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscriber_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_subscriber_id_target_id_unique" UNIQUE("subscriber_id","target_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"birth_date" timestamp NOT NULL,
	"language_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscriber_id_users_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;