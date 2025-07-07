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
import Chart, { ChartPropsSchema } from "../components/Chart";
import Render from "../components/Render";

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
  // {
  //   name: "Table",
  //   description: "Renders a custom table with the provided data",
  //   component: Table,
  //   propsSchema: z.object({}),
  // },
  // {
  //   name: "Chart",
  //   description: "Renders a custom chart with the provided data",
  //   component: Chart,
  //   propsSchema: ChartPropsSchema,
  // },
  // {
  //   name: "Render",
  //   description: "Renders a custom div to visualize text information better",
  //   component: Render,
  //   propsSchema: z.object({}),
  // },
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
