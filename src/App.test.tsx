import {
  render,
  fireEvent,
  screen,

} from "@testing-library/react";
import React from "react";
import App from "./App";

const NumberOfBrands = 3;
const NumberOfProperties = 2;

describe("App component", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  // initialize state with json data
    it("initializes state with json data", () => {
        const { getByText } = render(<App />);
        const brandLabels = screen.getAllByText("Brand:");
        expect(brandLabels).toHaveLength(NumberOfBrands);
    });



  it("adds a new brand when the 'Add New Brand' button is clicked", () => {
    const { getByText } = render(<App />);
    fireEvent.click(screen.getAllByText("Add New Brand")[0]);
    const brandLabels = screen.getAllByText("Brand:");
    expect(brandLabels).toHaveLength(NumberOfBrands + 1);
  });

  it("adds a new order property to all orders when the 'Add Global Property to Orders' button is clicked", () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    const input = getByPlaceholderText("new order property");
    fireEvent.change(input, { target: { value: "newProp" } });
    fireEvent.click(getByText("Add Global Property to Orders"));

    const brandLabels = screen.getAllByText("newProp");
    expect(brandLabels).toHaveLength(NumberOfProperties + 1);
  });

  it("updates the brand name when it is changed", () => {
    const { getAllByRole } = render(<App />);
    const input = getAllByRole("textbox", { name: "Brand:" })[0];
    fireEvent.change(input, { target: { value: "New Brand" } });
    expect(input.value).toBe("New Brand");
  });

  it("updates the order date when it is changed", () => {
    const { getAllByLabelText } = render(<App />);
    const inputs = getAllByLabelText("date");
    fireEvent.change(inputs[0], { target: { value: "2022-04-01" } });
    expect(inputs[0].value).toBe("2022-04-01");
  });

  it("updates the order price when it is changed", () => {
    const { getAllByLabelText } = render(<App />);
    const inputs = getAllByLabelText("price");
    fireEvent.change(inputs[0], { target: { value: "100" } });
    expect(inputs[0].value).toBe("100");
  });
});

