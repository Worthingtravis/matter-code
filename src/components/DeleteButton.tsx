import React from "react";
import { confirmAction } from "../utils";

export function DeleteButton({
  onClick,
  title,
  byPassConfirmation = false,
}: {
  onClick: () => void;
  title: string;
  byPassConfirmation?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={() => confirmAction(onClick, byPassConfirmation)}
      className={"btn delete delete-brand"}
    >
      x
    </button>
  );
}
