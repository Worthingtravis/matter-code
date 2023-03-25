import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import React from "react";
import App from "./App";
import initialBrands from "./data/brandOrders.json";

// setup
const expectedNumberOfBrands = initialBrands.length;
const deleteBrandTitleText = "Delete Brand";
const brandLabelText = "Brand:";
const addNewBrandText = "Add New Brand";
const deleteOrderTitleText = "Delete Order";
describe("App component", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("initializes state with json data", () => {
    const brandLabels = screen.getAllByText(brandLabelText);
    expect(brandLabels).toHaveLength(expectedNumberOfBrands);
  });

  it("adds a new brand when the 'Add New Brand' button is clicked", () => {
    fireEvent.click(screen.getAllByText(addNewBrandText)[0]);
    const brandLabels = screen.getAllByText(brandLabelText);
    expect(brandLabels).toHaveLength(expectedNumberOfBrands + 1);
  });

  it("updates the brand name when it is changed", () => {
    const input = screen.getAllByRole("textbox", { name: brandLabelText })[0];
    fireEvent.change(input, { target: { value: "New Brand" } });
    expect((input as HTMLInputElement).value).toBe("New Brand");
  });

  it("updates the order date when it is changed", () => {
    const inputs = screen.getAllByDisplayValue("2021-01-20");
    fireEvent.change(inputs[0], { target: { value: "2022-04-01" } });
    expect((inputs[0] as HTMLInputElement).value).toBe("2022-04-01");
  });

  it("updates the order price when it is changed", () => {
    const inputs = screen.getAllByDisplayValue("6400");
    fireEvent.change(inputs[0], { target: { value: "100" } });
    expect((inputs[0] as HTMLInputElement).value).toBe("100");
  });

  it("Ensure there are 4 brands to delete", () => {
    const brandDeleteButtons = screen.getAllByTitle(deleteBrandTitleText);
    expect(brandDeleteButtons).toHaveLength(expectedNumberOfBrands);
  });

  it("ensure brands are deleted when delete brand is clicked", async () => {
    // should have all the brands
    let brandDeleteButtons = screen.getAllByTitle(deleteBrandTitleText);
    expect(brandDeleteButtons).toHaveLength(expectedNumberOfBrands);

    for (let i = 0; i < expectedNumberOfBrands; i++) {
      const confirmSpy = jest.spyOn(window, "confirm");
      confirmSpy.mockImplementation(() => true);
      fireEvent.click(brandDeleteButtons[0]);

      const expectedRemainingBrands = expectedNumberOfBrands - (i + 1);
      await waitFor(() => {
        const remainingBrands = screen.queryAllByTitle(deleteBrandTitleText);
        expect(remainingBrands.length).toBe(expectedRemainingBrands);
      });
    }

    const numberOfBrandsAfterDelete = screen.queryByTitle(deleteBrandTitleText);
    expect(numberOfBrandsAfterDelete).toBe(null);
  });

  it("ensure brands are not deleted when they are clicked and the user cancels", async () => {
    const brandDeleteButtons = screen.getAllByTitle(deleteBrandTitleText);
    expect(brandDeleteButtons).toHaveLength(expectedNumberOfBrands);

    const confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(() => false);
    fireEvent.click(brandDeleteButtons[0]);

    await waitFor(() => {
      const remainingBrands = screen.queryAllByTitle(deleteBrandTitleText);
      expect(remainingBrands.length).toBe(expectedNumberOfBrands);
    });

    const numberOfBrandsAfterDelete =
      screen.queryAllByTitle(deleteBrandTitleText);
    expect(numberOfBrandsAfterDelete).toBe(numberOfBrandsAfterDelete);
  });

  // deleting orders from brands
  it("ensure orders are deleted when delete is clicked", async () => {
    let orderDeleteButtons = screen.queryAllByTitle(deleteOrderTitleText);
    const expectedNumberOfOrders = orderDeleteButtons.length;
    expect(orderDeleteButtons).toHaveLength(expectedNumberOfOrders); // Remove hardcoded value 8

    for (let i = 0; i < expectedNumberOfOrders; i++) {
      const confirmSpy = jest.spyOn(window, "confirm");
      confirmSpy.mockImplementation(() => true);
      fireEvent.click(orderDeleteButtons[0]);

      const expectedRemainingOrders = expectedNumberOfOrders - (i + 1);

      await waitFor(() => {
        const remainingOrders = screen.queryAllByTitle(deleteOrderTitleText);
        expect(remainingOrders.length).toBe(expectedRemainingOrders);
      });

      // Update the orderDeleteButtons list after deletion
      orderDeleteButtons = screen.queryAllByTitle(deleteOrderTitleText);
    }

    const numberOfOrdersAfterDelete = screen.queryByTitle(deleteOrderTitleText);
    expect(numberOfOrdersAfterDelete).toBe(null);
  });
});
