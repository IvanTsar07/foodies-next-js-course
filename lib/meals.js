import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instractions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const filename = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${filename}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), error => {
    if (error) {
      throw new Error("Saving image failed");
    }
  });

  meal.image = `/images/${filename}`;

  db.prepare(
    `INSERT INTO meals 
      (creator, creator_email, title, summary, instructions, image, slug) 
      VALUES (
        @creator, 
        @creator_email, 
        @title, 
        @summary, 
        @instructions, 
        @image, 
        @slug
      )
    `
  ).run(meal);
}
