import React from "react";

export  interface Brand {
  name: string;
  orders: BrandOrder[];

  [key: string]: string | BrandOrder[];
}

export interface BrandOrder {
  date: string;
  price: number;

  [key: string]: string | number;
}

export interface ChangeEventWithPath
  extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    name: string;
    value: string | number;
  };
}
