import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the viewpoint clinic workspace as the first screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "观点体检所" })).toBeInTheDocument();
    expect(screen.getByLabelText("输入观点")).toBeInTheDocument();
    expect(screen.getByText("等待体检")).toBeInTheDocument();
  });
});
