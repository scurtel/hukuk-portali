import { getAllPosts, staticAuthors, staticCategories } from "@/lib/posts";

export function staticParamsForPostType(type: "haber" | "rehber" | "analiz") {
  return getAllPosts()
    .filter((post) => post.type === type)
    .map((post) => ({ slug: post.slug }));
}

export function staticParamsForCategories() {
  return staticCategories.map((category) => ({ slug: category.slug }));
}

export function staticParamsForAuthors() {
  return staticAuthors.map((author) => ({ slug: author.slug }));
}
