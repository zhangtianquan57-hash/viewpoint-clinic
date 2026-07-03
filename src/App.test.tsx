import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the viewpoint clinic workspace as the first screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "观点体检所" })).toBeInTheDocument();
    expect(screen.getByLabelText("输入观点")).toBeInTheDocument();
    expect(screen.getByText("等待体检")).toBeInTheDocument();
  });

  it("generates a report from a sample input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "使用示例：AI 与程序员" }));

    expect(screen.getByText("核心立场")).toBeInTheDocument();
    expect(screen.getByText("隐藏假设")).toBeInTheDocument();
    expect(screen.getByText("观点体检卡")).toBeInTheDocument();
  });

  it("shows a short-input state without inventing a report", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("输入观点"), "会涨");

    expect(screen.getByText("这句话太短，至少写满 12 个可见字符才能体检。")).toBeInTheDocument();
    expect(screen.queryByText("观点体检卡")).not.toBeInTheDocument();
  });
});
