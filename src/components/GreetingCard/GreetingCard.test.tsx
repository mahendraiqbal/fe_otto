import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GreetingCard from "./GreetingCard";
import Swal from "sweetalert2";

jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe("GreetingCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockContext = {
      clearRect: jest.fn(),
      drawImage: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 50 }),
    };

    const mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockContext),
      toDataURL: jest.fn().mockReturnValue("data:image/png;base64,fake-image"),
      width: 500,
      height: 600,
    };

    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") {
        return mockCanvas as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    global.Image = class {
      onload: () => void = () => {};
      src: string = "";
    } as unknown as typeof Image;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all form inputs", () => {
    render(<GreetingCard />);

    expect(
      screen.getByRole("button", { name: /Download Image/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your message")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("validates empty inputs", async () => {
    render(<GreetingCard />);

    const downloadButton = screen.getByRole("button", {
      name: /Download Image/i,
    });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please upload an image",
        showConfirmButton: false,
        timer: 3000,
      });
    });
  });

  it("handles image upload", async () => {
    render(<GreetingCard />);

    const file = new File([""], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(input.files?.[0]).toBe(file);
    });
  });

  it("updates input values", () => {
    render(<GreetingCard />);

    const dearInput = screen.getByPlaceholderText("Enter name");
    const messageInput = screen.getByPlaceholderText("Enter your message");
    const fromInput = screen.getByPlaceholderText("Enter your name");

    fireEvent.change(dearInput, { target: { value: "John" } });
    fireEvent.change(messageInput, { target: { value: "Hello World" } });
    fireEvent.change(fromInput, { target: { value: "Jane" } });

    expect(dearInput).toHaveValue("John");
    expect(messageInput).toHaveValue("Hello World");
    expect(fromInput).toHaveValue("Jane");
  });
});
