import { useState } from "react";
import { Brand } from "../Interfaces";
import { deepSearch } from "../utils";

export const useBrandDeepSearch = (brands: Brand[]) => {
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>();

  const handleDeepSearch = (searchTerm: string) => {
    const searchResults = deepSearch(brands, searchTerm, brandPredicate);
    setFilteredBrands(searchResults);
  };

  const clearFilteredBrands = () => {
    setFilteredBrands(undefined);
  };

  return {
    filteredBrands,
    handleDeepSearch,
    clearFilteredBrands,
  };
};

const brandPredicate = (brand: Brand, searchTerm: string) => {
  if (brand.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return true;
  }

  const foundOrder = brand.orders.find((order) => {
    return (
      order.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.price.toString().includes(searchTerm)
    );
  });

  return !!foundOrder;
};
