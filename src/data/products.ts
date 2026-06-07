import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "sourdough-loaf",
    name: "Classic Sourdough Loaf",
    description:
      "Our signature sourdough with a crispy crust and open crumb. Made with a 15-year-old starter and slow-fermented for 24 hours.",
    price: 12.0,
    image: "/images/sourdough.jpg",
    category: "loaves",
    available: true,
  },
  {
    id: "whole-wheat",
    name: "Whole Wheat Loaf",
    description:
      "Hearty and nutritious, milled from locally sourced whole wheat. Perfect for sandwiches and toast.",
    price: 10.0,
    image: "/images/whole-wheat.jpg",
    category: "loaves",
    available: true,
  },
  {
    id: "cinnamon-raisin",
    name: "Cinnamon Raisin Bread",
    description:
      "Swirled with cinnamon and plump California raisins. Incredible toasted with butter.",
    price: 11.0,
    image: "/images/cinnamon-raisin.jpg",
    category: "loaves",
    available: true,
  },
  {
    id: "rye",
    name: "Dark Rye Loaf",
    description:
      "Dense and complex with caraway seeds. A nod to old-world European baking traditions.",
    price: 11.0,
    image: "/images/rye.jpg",
    category: "loaves",
    available: true,
  },
  {
    id: "challah",
    name: "Challah Braid",
    description:
      "Rich, pillowy braided loaf with eggs and honey. Beautiful presentation, even better flavor.",
    price: 14.0,
    image: "/images/challah.jpg",
    category: "specialty",
    available: true,
  },
  {
    id: "brioche",
    name: "Brioche Loaf",
    description:
      "Buttery, tender crumb with a golden crust. French-style brioche baked fresh each morning.",
    price: 13.0,
    image: "/images/brioche.jpg",
    category: "specialty",
    available: true,
  },
  {
    id: "focaccia",
    name: "Rosemary Focaccia",
    description:
      "Dimpled, olive-oil-drenched flatbread topped with fresh rosemary and sea salt.",
    price: 9.0,
    image: "/images/focaccia.jpg",
    category: "specialty",
    available: true,
  },
  {
    id: "baguette",
    name: "French Baguette",
    description:
      "Classic Parisian-style with shatteringly crispy crust and airy interior. Best eaten same day.",
    price: 5.0,
    image: "/images/baguette.jpg",
    category: "rolls",
    available: true,
  },
  {
    id: "dinner-rolls",
    name: "Dinner Rolls (6-pack)",
    description:
      "Soft, pillowy pull-apart rolls with a touch of honey. Perfect for any dinner table.",
    price: 8.0,
    image: "/images/dinner-rolls.jpg",
    category: "rolls",
    available: true,
  },
  {
    id: "pretzel-rolls",
    name: "Pretzel Rolls (4-pack)",
    description:
      "Chewy pretzel-style rolls with coarse salt. Great on their own or as burger buns.",
    price: 9.0,
    image: "/images/pretzel-rolls.jpg",
    category: "rolls",
    available: true,
  },
];

export const categories = [
  { id: "all", label: "All Breads" },
  { id: "loaves", label: "Loaves" },
  { id: "rolls", label: "Rolls & Baguettes" },
  { id: "specialty", label: "Specialty" },
];
