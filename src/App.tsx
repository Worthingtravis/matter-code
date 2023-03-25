import React, { useEffect, useState } from "react";

import "./styles.css";

import initialBrands from "./data/brandOrders.json";
import _ from "lodash";
import { OrderData } from "./components/OrderData";
import { Brand, ChangeEventWithPath } from "./Interfaces";
import { NotificationContext } from "./NotificationProvider";

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
  const [brands, setBrands] = useState<Brand[]>([]);

  const { handleNotify } = React.useContext(NotificationContext);

  useEffect(() => {
    // fetch data from API
    setBrands(initialBrands);
    handleNotify({
      text: "Loaded data",
      type: "info",
    });
  }, []);

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

    handleNotify({ text: "Added new order", type: "success" });

    setBrands(newBrands);
  };
  const handleDeleteOrder = (brandIndex: number, orderIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    // Remove order
    newBrands[brandIndex].orders.splice(orderIndex, 1);

    handleNotify({ text: `Deleted order ${orderIndex} from brand ${brands[brandIndex].name}`, type: "error" });
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

    handleNotify({ text: "Added new brand", type: "success" });
    setBrands(newBrands);
  };

  const handleDeleteBrand = (brandIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    // Remove brand
    newBrands.splice(brandIndex, 1);
    // Update state
    setBrands(newBrands);
  };

  return (
    <div className="App">
      <h2 className={"card-title"}>Brand & Orders</h2>

      <div className={"page-actions"}>
        <AddBrandButton text={"Add New Brand"} onClick={handleAddBrand} />
      </div>

      <div className={"card-content"}>
        <div className={"list"}>
          {brands.map((brand, brandIndex) => (
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

                <ul className={"list-orders"}>
                  <div className={"input-wrapper"}>
                    <h5 className={"card-orders-title"}>Orders</h5>
                    <li className={"list-item"}>
                      <div className={"btn-group"}>
                        <button
                          title={"Add Order"}
                          onClick={() => handleAddOrder(brandIndex)}
                          className={"btn add add-order"}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  </div>

                  {brand.orders.length === 0 && (
                    <p className={"no-orders"}>No orders</p>
                  )}
                  {brand.orders.map((order, orderIndex) => (
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
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
