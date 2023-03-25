import React from "react";
import { BrandOrder, ChangeEventWithPath } from "../Interfaces";
import "./OrderData.css";
import { NotificationContext } from "../NotificationProvider";

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
  // dynamically generate the name and id attributes for the input fields
  // so that we can use the same onChange handler for all input fields
  const names = Object.keys(order);
  const { handleNotify, clearNotification } =
    React.useContext(NotificationContext);

  const getInputType = (name: string) => {
    if (name === "date") {
      return "date";
    }
    return "number";
  };

  const getInputValue = (name: string) => {
    try {
      if (name === "date") {
        return new Date(order.date).toISOString().slice(0, 10);
      }
      return order.price;
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  };

  return (
    <li className={"list-item"}>
      {names.map((name) => (
        <div className={"input-wrapper"} key={name}>
          <label
            className={"label"}
            htmlFor={`${brandIndex}.${name}.${orderIndex}`}
          >
            {name}
          </label>
          <input
            type={getInputType(name)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            id={`${brandIndex}.${name}.${orderIndex}`}
            value={getInputValue(name)}
            name={`${brandIndex}.${name}.${orderIndex}`}
            onClick={(e) => {
              e.currentTarget.select();
              handleNotify({
                text: `You are editing ${name} for order ${
                  orderIndex + 1
                } of brand ${brandIndex + 1}`,
                type: "info",
                duration: 3000,
              });
            }}
            onBlur={(e) => {
              clearNotification();
            }}
            onChange={onChange}
            className={"input"}
          />
        </div>
      ))}
    </li>
  );
}
