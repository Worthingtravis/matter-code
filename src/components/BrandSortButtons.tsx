import { Brand } from "../Interfaces";
import { sortBrands, sortBrandsByNumberOfOrders } from "../utils";
import React from "react";

export function BrandSortButtons({
  brands,
  setBrands,
}: {
  brands: Brand[];
  setBrands: any;
}) {
  const handleSortBrands = (options: "asc" | "desc") => {
    const sortedBrands = sortBrands(brands, options);
    setBrands(sortedBrands);
  };

  const handleSortByNumberOfOrders = (options: "asc" | "desc") => {
    const sortedBrands = sortBrandsByNumberOfOrders(brands, options);
    setBrands(sortedBrands);
  };

  return (
    <div className={"flex-group"}>
      Sort By
      <div className={"btn-group"}>
        Brand Name
        <button className={"btn "} onClick={() => handleSortBrands("asc")}>
          Asc
        </button>
        <button className={"btn "} onClick={() => handleSortBrands("desc")}>
          Desc
        </button>
      </div>
      <div className={"btn-group"}>
        Order Length
        <button
          className={"btn "}
          onClick={(event) => () => handleSortByNumberOfOrders("asc")}
        >
          Asc
        </button>
        <button
          className={"btn "}
          onClick={() => handleSortByNumberOfOrders("desc")}
        >
          Desc
        </button>
      </div>
    </div>
  );
}
