"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isTextValid(text) {
  return text && text.trim() !== "";
}

export async function shareMeal(_prevState, formData) {
  const meal = {
    creator: formData.get("name"),
    creator_email: formData.get("email"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (
    isTextValid(meal.title) ||
    isTextValid(meal.summary) ||
    isTextValid(meal.instructions) ||
    isTextValid(meal.image) ||
    isTextValid(meal.creator) ||
    isTextValid(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid data. Please check your input and try again.",
    };
  }

  await saveMeal(meal);

  revalidatePath("/meals");

  redirect("/meals");
}
