import React, { useEffect, useMemo, useState } from "react";

import "./styles.css";

import initialBrands from "./data/brandOrders.json";
import _ from "lodash";
import { Brand, ChangeEventWithPath } from "./Interfaces";
import { toast } from "react-toastify";
import { useConfirmBeforeUnload } from "./hooks/useConfirmBeforeUnload";
import { useBrandActions } from "./hooks/useBrandActions";
import { BrandComponent } from "./components/BrandComponent";
import { useBrandDeepSearch } from "./hooks/useBrandDeepSearch";
import { AddBrandButton } from "./components/AddBrandButton";
import { BrandSortButtons } from "./components/BrandSortButtons";

function BrandSearchComponent(props: {
  onChange: (e: any) => void;
  onClick: () => void;
}) {
  return (
    <div className={"btn-group"}>
      <label>Search: </label>
      <input className={"input"} type="text" onChange={props.onChange} />
      <button className={"btn "} onClick={props.onClick}>
        Clear
      </button>
    </div>
  );
}

export default function App() {
  // local state
  const [initialBrandData, setInitialBrandData] =
    useState<Brand[]>(initialBrands);

  // hooks
  const {
    brands,
    setBrands,
    handleAddOrder,
    handleDeleteOrder,
    handleAddBrand,
    handleDeleteBrand,
  } = useBrandActions(initialBrands);

  const { filteredBrands, handleDeepSearch, clearFilteredBrands } =
    useBrandDeepSearch(brands);

  const needsToBeSaved = useMemo(() => {
    return !_.isEqual(initialBrandData, brands);
  }, [brands]);

  useConfirmBeforeUnload(needsToBeSaved);

  useEffect(() => {
    // fetch data from API
    setBrands(initialBrands);
  }, []);

  const handleChangeInput = (event: ChangeEventWithPath) => {
    const { name, value, type } = event.target;

    if (type === "number") {
      if (isNaN(parseInt(value))) {
        return toast.error("Please enter a number", {
          toastId: "number-error",
        });
      }
    }
    // name is in the format of brandIndex.propertyName.orderIndex
    const [brandIndex, key, orderIndex] = name.split(".");

    const parsedBrandIndex = parseInt(brandIndex);
    const newBrands = _.cloneDeep(brands);

    if (orderIndex) {
      // Update order property
      const parsedOrderIndex = parseInt(orderIndex);
      newBrands[parsedBrandIndex].orders[parsedOrderIndex][key] = value;
    } else {
      // Update brand property
      newBrands[parsedBrandIndex][key] = value;
    }

    setBrands(newBrands);
  };

  return (
    <div className="App">
      <h2 className={"card-title"}>Brand & Orders</h2>

      <div className={"page-actions"}>
        <AddBrandButton text={"Add New Brand"} onClick={handleAddBrand} />
        <BrandSearchComponent
          onChange={(e) => handleDeepSearch(e.target.value)}
          onClick={clearFilteredBrands}
        />
        <BrandSortButtons brands={brands} setBrands={setBrands} />
      </div>

      <div className={"card-content"}>
        <div className={"list"}>
          {(filteredBrands || brands).map((brand, brandIndex) => (
            <BrandComponent
              key={brandIndex}
              brand={brand}
              brandIndex={brandIndex}
              handleChangeInput={handleChangeInput}
              handleAddOrder={handleAddOrder}
              handleDeleteOrder={handleDeleteOrder}
              handleDeleteBrand={handleDeleteBrand}
            />
          ))}
        </div>
        <div className={"card-footer"}>
          <button
            hidden={!needsToBeSaved}
            className={"btn info-bg"}
            onClick={() => {
              toast("Saved", { type: "success" });
              setInitialBrandData(brands);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
