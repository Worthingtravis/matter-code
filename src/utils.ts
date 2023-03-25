import { Brand } from "./Interfaces";
import _ from "lodash";
import { toast } from "react-toastify";
export const confirmAction = (action: () => void, byPass = false) => {
  if (byPass) return action();

  const confirmed = window.confirm("Are you sure?");
  if (confirmed) action();
};

export const sortBrands = (
  brands: Brand[],
  options: "asc" | "desc" = "asc"
) => {
  const newBrands = _.cloneDeep(brands);

  if (options === "asc") {
    newBrands.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options === "desc") {
    newBrands.sort((a, b) => b.name.localeCompare(a.name));
  }
  toast.success("Brands sorted alphabetically");
  return newBrands;
};

export const sortBrandsByNumberOfOrders = (
  brands: Brand[],
  options: "asc" | "desc" = "asc"
) => {
  // Use cloneDeep from lodash directly
  const newBrands = _.cloneDeep(brands);

  // Combine both conditions into a single sort function
  newBrands.sort((a, b) => {
    const diff = a.orders.length - b.orders.length;
    return options === "asc" ? diff : -diff;
  });

  // Use success toast from `helpers/toast`
  toast.success("Brands sorted by number of orders");

  return newBrands;
};

export const deepSearch = <T>(
  objects: T[],
  searchTerm: string,
  filterFn: (object: T, searchTerm: string) => boolean
): T[] => objects.filter((object) => filterFn(object, searchTerm));
