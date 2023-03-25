import React from "react";

interface AddBrandButtonProps {
  onClick: () => void;
  text?: string;
}

export const AddBrandButton: React.FC<AddBrandButtonProps> = ({
  onClick,
  text = "Add New Brand",
}) => {
  return (
    <button onClick={onClick} className={"btn add add-brand"}>
      {text}
    </button>
  );
};
