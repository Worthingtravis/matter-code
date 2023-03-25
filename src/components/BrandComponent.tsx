import React from "react";
import { Brand } from "../Interfaces";
import { DeleteButton } from "./DeleteButton";
import { OrderData } from "./OrderData";

interface BrandComponentProps {
  brand: Brand;
  brandIndex: number;
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddOrder: (brandIndex: number) => void;
  handleDeleteOrder: (brandIndex: number, orderIndex: number) => void;
  handleDeleteBrand: (brandIndex: number) => void;
}

export const BrandComponent: React.FC<BrandComponentProps> = ({
  brand,
  brandIndex,
  handleChangeInput,
  handleAddOrder,
  handleDeleteOrder,
  handleDeleteBrand,
}) => {
  return (
    <div className={"card"}>
      <div className={"card-header"}>
        <div className={"input-group"}>
          <label htmlFor={`${brandIndex}`}>Brand:</label>
          <input
            id={`${brandIndex}`}
            type={"text"}
            defaultValue={brand.name}
            onClick={(e) => e.currentTarget.select()}
            className={"input input-brand-name"}
            name={`${brandIndex}.name`}
            onBlur={handleChangeInput}
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
      <div className={"list-orders"}>
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
                onClick={() => handleDeleteOrder(brandIndex, orderIndex)}
                title={"Delete Order"}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
