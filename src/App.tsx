import React, { useEffect, useState } from "react";

import "./styles.css";

import initialBrands from "./data/brandOrders.json";
import _ from "lodash";
import { OrderData } from "./components/OrderData";
import { Brand, ChangeEventWithPath } from "./Interfaces";
import { toast } from "react-toastify";

const confirmAction = (action: () => void, unsafeMode = false) => {
  if (unsafeMode) {
    action();
    return;
  }
  const confirmed = window.confirm("Are you sure?");
  if (confirmed) {
    action();
  }
};

function DeleteButton({
  onClick,
  title,
  unsafeMode = false,
}: {
  onClick: () => void;
  title: string;
  unsafeMode?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={() => confirmAction(onClick, unsafeMode)}
      className={"btn delete delete-brand"}
    >
      x
    </button>
  );
}

function AddBrandButton({
  onClick,
  text = "Add New Brand",
}: {
  // onclick may pass a parameter
  onClick: () => void;
  text?: string;
}): JSX.Element {
  return (
    <button onClick={onClick} className={"btn add add-brand"}>
      {text}
    </button>
  );
}

export default function App() {
  const [initialBrandData, setInitialBrandData] =
    useState<Brand[]>(initialBrands);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>();

  useEffect(() => {
    // fetch data from API
    setBrands(initialBrands);
  }, []);

  const sortBrands = (options: "asc" | "desc" = "asc") => {
    const newBrands = _.cloneDeep(brands);

    if (options === "asc") {
      newBrands.sort((a, b) => a.name.localeCompare(b.name));
    } else if (options === "desc") {
      newBrands.sort((a, b) => b.name.localeCompare(a.name));
    }
    toast.success("Brands sorted alphabetically");
    setBrands(newBrands);
  };

  const sortByNumberOfOrders = (options: "asc" | "desc" = "asc") => {
    const newBrands = _.cloneDeep(brands);

    if (options === "asc") {
      // sort by how many orders are in the brand
      newBrands.sort((a, b) => a.orders.length - b.orders.length);
    } else if (options === "desc") {
      newBrands.sort((a, b) => b.orders.length - a.orders.length);
    }

    toast.success("Brands sorted by number of orders");
    setBrands(newBrands);
  };

  const deepSearch = (searchTerm: string) => {
    const newBrands = _.cloneDeep(brands);
    const searchResults = newBrands.filter((brand) => {
      // search in brand name
      if (brand.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      // search in orders
      const foundOrder = brand.orders.find((order) => {
        // replace any not number or letter with empty string
        return (
          order.date
            .toLowerCase()

            .includes(searchTerm.toLowerCase()) ||
          order.price.toString().includes(searchTerm)
        );
      });
      return !!foundOrder;
    });
    setFilteredBrands(searchResults);
  };

  const handleChangeInput = (event: ChangeEventWithPath) => {
    const { name, value } = event.target;
    // name is in the format of brandIndex.propertyName.orderIndex
    const [brandIndex, key, orderIndex] = name.split(".");

    const newBrands = _.cloneDeep(brands);
    const parsedBrandIndex = parseInt(brandIndex);

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

  const handleAddOrder = (brandIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    // Add new order
    newBrands[brandIndex].orders.push({
      // Set default date to today
      // slice is used to remove the time which is not supported by input type date
      date: new Date().toISOString().slice(0, 10),
      // Set default price to 0
      price: 0,
    });

    toast(`New order was added to ${newBrands[brandIndex].name}`, {
      type: "success",
    });
    setBrands(newBrands);
  };
  const handleDeleteOrder = (brandIndex: number, orderIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    // Remove order
    newBrands[brandIndex].orders.splice(orderIndex, 1);

    toast(`Order ${orderIndex} in ${newBrands[brandIndex].name} was deleted`, {
      type: "error",
    });

    setBrands(newBrands);
  };

  const handleAddBrand = (): void => {
    // cloneDeep is used to avoid mutating the original array
    const newBrands = _.cloneDeep(brands);
    // Add new brand to start of array
    newBrands.unshift({
      name: "",
      orders: [],
    });

    toast(`New brand was added`, { type: "success" });
    setBrands(newBrands);
  };

  const handleDeleteBrand = (brandIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    newBrands.splice(brandIndex, 1);

    toast(`Brand "${brands[brandIndex].name}" was deleted`, { type: "error" });
    setBrands(newBrands);
  };

  const needsToBeSaved = () => !_.isEqual(initialBrandData, brands);

  return (
    <div className="App">
      <h2 className={"card-title"}>Brand & Orders</h2>

      <div className={"page-actions"}>
        <AddBrandButton text={"Add New Brand"} onClick={handleAddBrand} />
        <div>
          <label>Search: </label>
          <input type="text" onChange={(e) => deepSearch(e.target.value)} />
          <button onClick={() => setFilteredBrands(undefined)}>Clear</button>
        </div>
        <div className={"flex-group"}>
          Sort By
          <div className={"btn-group"}>
            Brand Name
            <button className={"btn "} onClick={() => sortBrands("asc")}>
              Asc
            </button>
            <button className={"btn "} onClick={() => sortBrands("desc")}>
              Desc
            </button>
          </div>
          <div className={"btn-group"}>
            Order Length
            <button
              className={"btn "}
              onClick={() => sortByNumberOfOrders("asc")}
            >
              Asc
            </button>
            <button
              className={"btn "}
              onClick={() => sortByNumberOfOrders("desc")}
            >
              Desc
            </button>
          </div>
        </div>
      </div>

      <div className={"card-content"}>
        <div className={"list"}>
          {(filteredBrands || brands).map((brand, brandIndex) => (
            <div key={brandIndex} className={"list-item"}>
              <div className={"card"}>
                <div className={"card-header"}>
                  <div className={"input-group"}>
                    <label htmlFor={`${brandIndex}`}>Brand:</label>
                    <input
                      id={`${brandIndex}`}
                      type={"text"}
                      value={brand.name}
                      onClick={(e) => e.currentTarget.select()}
                      className={"input input-brand-name"}
                      name={`${brandIndex}.name`}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <DeleteButton
                    onClick={() => handleDeleteBrand(brandIndex)}
                    title={"Delete Brand"}
                  />
                </div>
                <div className={"input-wrapper"}>
                  <h5 className={"card-orders-title"}>Orders</h5>
                  <div className={"flex-group"}>
                    <button
                      hidden={brand.orders.length === 0}
                      title={"Add Order"}
                      onClick={() => handleAddOrder(brandIndex)}
                      className={"btn add add-order"}
                    >
                      +
                    </button>
                  </div>
                </div>
                <ul className={"list-orders"}>
                  {brand.orders.length === 0 && (
                    <button
                      title={"Add Order"}
                      onClick={() => handleAddOrder(brandIndex)}
                      className={"info-bg btn"}
                    >
                      No Orders, Click to Add
                    </button>
                  )}


                  {brand.orders.map((order, orderIndex) => (
                    <React.Fragment key={orderIndex}>
                      <div className={"input-wrapper"} key={orderIndex}>
                        <OrderData
                          brandIndex={brandIndex}
                          orderIndex={orderIndex}
                          order={order}
                          onChange={handleChangeInput}
                        />
                        <DeleteButton
                          onClick={() => handleDeleteOrder(brandIndex, 0)}
                          title={"Delete Order"}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className={"card-footer"}>
          <button
            hidden={!needsToBeSaved()}
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
