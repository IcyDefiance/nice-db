import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/root";
import "./styles.scss";
import "./parser/parser";
import "typeface-roboto";

render(<Root />, document.getElementById("root"));
