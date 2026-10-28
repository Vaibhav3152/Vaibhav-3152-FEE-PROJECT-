import { create } from "zustand";
import { fetchWithRetry, getFriendlyError } from "../utils/api.js";

export const API_URL = "https://dummyjson.com";
export const PRODUCTS_PER_PAGE = 8;

// ASYNC STATE in a store: every request has three possible states,
// loading, error, or data. The store keeps all three together.
// latestRequest is used to ignore OLD answers: if the user types fast,
// request 1 may finish after request 2, and we don't want that to win.
let latestRequest = 0;

export const useProductStore = create((set) => ({
  products: [],
  totalProducts: 0,
  categories: [],
  loading: false,
  error: "",

  fetchProducts: async ({ search = "", category = "", sortBy = "", order = "asc", page = 1 }) => {
    latestRequest += 1;
    const thisRequest = latestRequest;

    set({ loading: true, error: "" });

    const skip = (page - 1) * PRODUCTS_PER_PAGE;
    let url = API_URL + "/products?";

    // the API has three different addresses: search, category, or all
    if (search) {
      url = API_URL + "/products/search?q=" + encodeURIComponent(search) + "&";
    } else if (category) {
      url = API_URL + "/products/category/" + category + "?";
    }

    url += "limit=" + PRODUCTS_PER_PAGE + "&skip=" + skip;

    if (sortBy) {
      url += "&sortBy=" + sortBy + "&order=" + order;
    }

    try {
      const data = await fetchWithRetry(url);

      if (thisRequest !== latestRequest) {
        return;
      }

      set({ products: data.products, totalProducts: data.total, loading: false });
    } catch (error) {
      if (thisRequest !== latestRequest) {
        return;
      }

      set({ loading: false, error: getFriendlyError(error) });
    }
  },

  fetchCategories: async () => {
    try {
      const list = await fetchWithRetry(API_URL + "/products/category-list");
      set({ categories: list });
    } catch {
      // categories are just a nice extra, the shop still works without them
    }
  },
}));
