/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * IMPORTANT: If you have components in different directories (e.g., both ui/ and tambo/),
 * make sure all import paths are consistent. Run 'npx tambo migrate' to consolidate.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { moralisTools } from "../tools/moralis.tools";
import { onchainTools } from "../tools/onchain.tools";
import { appTools } from "../tools/app.tools";
import Table from "../components/Table";
import { Graph } from "../components/Graph";

/**
 * Components Array - A collection of Tambo components to register
 *
 * Components represent UI elements that can be generated or controlled by AI.
 * Register your custom components here to make them available to the AI.
 *
 * Example of adding a component:
 *
 * ```typescript
 * import { z } from "zod";
 * import { CustomChart } from "../components/ui/custom-chart";
 *
 * // Define and add your component
 * export const components: TamboComponent[] = [
 *   {
 *     name: "CustomChart",
 *     description: "Renders a custom chart with the provided data",
 *     component: CustomChart,
 *     propsSchema: z.object({
 *       data: z.array(z.number()),
 *       title: z.string().optional(),
 *     })
 *   }
 * ];
 * ```
 */

export const components: TamboComponent[] = [
  {
    name: "Table",
    description:
      "A versatile table component that can render data on table without having to know what kind of data, it receives a array of data matching the column definitions. Use this when you need to display data in a tabular format.",
    component: Table,
    propsSchema: z.object({
      data: z
        .array(
          z
            .string()
            .describe(
              "An object, which represents a row with keys matching column definitions."
            )
        )
        .describe(
          "Array of data objects to display in the table. Each object represents a row, with keys matching column definitions. Can be empty array for empty state."
        ),
      columns: z
        .array(
          z.object({
            key: z
              .string()
              .describe(
                "The property key from the data object that this column represents. Must match a key in your data type."
              ),
            header: z
              .string()
              .describe(
                "Display text for the column header. This is what users will see in the table header row."
              ),
          })
        )
        .describe(
          "Array of column definitions that specify how to display each data property. Defines headers and data mapping for each column."
        ),
      striped: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "Whether to apply alternating row colors (zebra striping). When true, odd rows get light gray background for better readability. Default: true."
        ),
      bordered: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "Whether to add borders around the table. When true, adds outer border and rounded corners for a more defined appearance. Default: true."
        ),
      hover: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "Whether to add hover effects to table rows. When true, rows change background color on mouse hover for better interaction feedback. Default: true."
        ),
    }),
  },
  {
    name: "graph",
    description:
      "A versatile chart component that can render bar, line, and pie charts with customizable styling and data visualization options. Use this when you need to display data in a graphical format.",
    component: Graph,
    propsSchema: z.object({
      data: z
        .object({
          type: z
            .enum(["bar", "line", "pie"])
            .describe("Type of chart to render"),
          labels: z
            .array(z.string())
            .describe("Labels for the x-axis or data points"),
          datasets: z
            .array(
              z.object({
                label: z.string().describe("Label for the dataset"),
                data: z.array(z.number()).describe("Array of numerical values"),
                color: z
                  .string()
                  .optional()
                  .describe("Optional custom color for the dataset"),
              })
            )
            .describe("Array of datasets to display"),
        })
        .describe("Data configuration for the chart"),
      title: z.string().optional().describe("Optional title for the chart"),
      variant: z
        .enum(["default", "solid", "bordered"])
        .optional()
        .describe("Visual style variant"),
      size: z
        .enum(["default", "sm", "lg"])
        .optional()
        .describe("Size variant of the chart"),
      showLegend: z
        .boolean()
        .optional()
        .describe("Whether to show the chart legend"),
      className: z
        .string()
        .optional()
        .describe("Optional additional CSS classes"),
    }),
  },
];

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */
export const tools: TamboTool[] = [
  ...moralisTools,
  ...onchainTools,
  ...appTools,
];
