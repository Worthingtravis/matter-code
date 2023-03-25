import React from "react";
import { BrandOrder, ChangeEventWithPath } from "../Interfaces";
import "./OrderData.css";

export function OrderData({
  brandIndex,
  orderIndex,
  order,
  onChange,
}: {
  brandIndex: number;
  orderIndex: number;
  order: BrandOrder;
  onChange: (event: ChangeEventWithPath) => void;
}) {
  const orderKeys = Object.keys(order);

  const getInputType = (property: string) => {
    if (property === "date") {
      return "date";
    }
    return "number";
  };

  const getFormattedValue = (property: string) => {
    try {
      if (property === "date") {
        return new Date(order.date).toISOString().slice(0, 10);
      }
      return order[property];
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  };

  return (
    <div className={"list-item"}>
      {orderKeys.map((orderKey) => (
        <div className={"input-wrapper"} key={orderKey}>
          {/*<label className={"label"}>{orderKey}</label>*/}
          <input
            type={getInputType(orderKey)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            value={getFormattedValue(orderKey)}
            name={`${brandIndex}.${orderKey}.${orderIndex}`}
            onChange={onChange}
            className={"input"}
          />
        </div>
      ))}
    </div>
  );
}
