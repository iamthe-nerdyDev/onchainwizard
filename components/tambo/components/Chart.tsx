"use client";

import { cn } from "@/lib/utils";
import { useTambo, useTamboMessageContext } from "@tambo-ai/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { z } from "zod";

const DataPointSchema = z
  .record(
    z.string().describe("Field name/column header for the data point"),
    z
      .union([
        z
          .string()
          .describe(
            "String value for categorical data, labels, or text fields"
          ),
        z
          .number()
          .describe(
            "Numeric value for quantitative data, measurements, or calculations"
          ),
        z.date().describe("Date/time value for temporal data and time series"),
      ])
      .describe(
        "The actual data value - can be text, number, or date depending on the field type"
      )
  )
  .describe(
    "A single data record/row containing key-value pairs representing one data point in the chart dataset. Each key represents a column/field name and each value contains the corresponding data for that field."
  );

const ChartTypeSchema = z
  .enum(["bar", "line", "ohlc", "pie"], {
    errorMap: () => ({
      message: "Chart type must be one of: bar, line, ohlc, or pie",
    }),
  })
  .describe(
    "The type of chart to render. Options: 'bar' for categorical comparisons and distributions, 'line' for trends and time series data, 'ohlc' for financial candlestick charts showing open/high/low/close values, 'pie' for proportional data and composition analysis."
  );

const OHLCDataSchema = z
  .object({
    date: z
      .union([
        z
          .string()
          .describe("Date in string format (e.g., '2024-01-01', 'Jan 2024')"),
        z.date().describe("JavaScript Date object"),
      ])
      .describe(
        "The date/time identifier for this OHLC data point, used for x-axis positioning"
      ),
    open: z
      .number()
      .describe(
        "Opening price/value at the start of the time period. Must be a numeric value representing the initial price when the period began."
      ),
    high: z
      .number()
      .describe(
        "Highest price/value reached during the time period. Must be a numeric value representing the peak value achieved."
      ),
    low: z
      .number()
      .describe(
        "Lowest price/value reached during the time period. Must be a numeric value representing the minimum value achieved."
      ),
    close: z
      .number()
      .describe(
        "Closing price/value at the end of the time period. Must be a numeric value representing the final price when the period ended."
      ),
  })
  .catchall(
    z
      .union([z.string(), z.number(), z.date()])
      .describe(
        "Additional optional fields that can be included alongside the required OHLC data"
      )
  )
  .describe(
    "Financial data structure for OHLC/candlestick charts. Contains the four essential price points (open, high, low, close) plus date, with optional additional fields for extended analysis."
  );

const ColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Color must be a valid hex color code"
  )
  .describe(
    "Hex color code for chart styling (e.g., '#FF5733', '#abc'). Used to customize the appearance of chart elements like bars, lines, pie slices, etc. Must be in valid hexadecimal format with # prefix."
  );

const ChartConfigSchema = z
  .object({
    type: ChartTypeSchema,
    data: z
      .array(DataPointSchema)
      .min(1, "Data array must contain at least one data point")
      .describe(
        "Array of data points to be visualized in the chart. Each element represents one record/row of data with key-value pairs. The structure should be consistent across all data points for proper chart rendering."
      ),
    xAxisKey: z
      .string()
      .optional()
      .describe(
        "Optional field name from the data to use as the x-axis (horizontal) values. If not provided, the component will auto-detect the first categorical field. Commonly used for dates, categories, or labels that define the horizontal positioning of data points."
      ),
    yAxisKeys: z
      .array(z.string())
      .optional()
      .describe(
        "Optional array of field names from the data to use as y-axis (vertical) values. If not provided, the component will auto-detect all numeric fields. Each field becomes a separate data series (e.g., multiple bars, lines, or pie segments). Used for quantitative data that needs to be measured or compared."
      ),
    title: z
      .string()
      .optional()
      .describe(
        "Optional title text to display above the chart. Provides context and description for the visualization. Should be concise but descriptive of what the chart represents."
      ),
    colors: z
      .array(ColorSchema)
      .optional()
      .describe(
        "Optional array of hex color codes to customize chart appearance. Colors are applied to different data series in order. If fewer colors than data series are provided, colors will cycle. If not provided, uses a default color palette with good contrast and accessibility."
      ),
  })
  .describe(
    "Configuration object that defines all chart properties including data, appearance, and behavior. This object controls every aspect of chart rendering from data source to visual styling."
  );

export const ChartPropsSchema = z
  .object({
    config: ChartConfigSchema,
    className: z
      .string()
      .optional()
      .describe(
        "Optional CSS class name(s) to apply to the chart container for custom styling. Allows integration with CSS frameworks, custom styles, or theme systems. Multiple classes should be space-separated."
      ),
  })
  .describe(
    "Props for the Chart component. Contains the chart configuration and optional styling classes. This is the main interface for creating charts with full type safety and validation."
  );

type DataPoint = z.infer<typeof DataPointSchema>;
type OHLCData = z.infer<typeof OHLCDataSchema>;
type ChartProps = z.infer<typeof ChartPropsSchema>;

const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
  "#8dd1e1",
];

const getNumericFields = <T extends DataPoint>(data: T[]): Array<keyof T> => {
  if (!data || data.length === 0) return [];

  const row = data[0];
  return Object.keys(row).filter(
    (key) => typeof row[key] === "number" && !isNaN(row[key] as number)
  ) as Array<keyof T>;
};

const getCategoryFields = <T extends DataPoint>(data: T[]): Array<keyof T> => {
  if (!data || data.length === 0) return [];

  const row = data[0];
  return Object.keys(row).filter(
    (key) => typeof row[key] === "string" || row[key] instanceof Date
  ) as Array<keyof T>;
};

const isOHLCData = (data: DataPoint[]): data is OHLCData[] => {
  if (!data || data.length === 0) return false;

  const sampleRow = data[0];
  const requiredFields = ["open", "high", "low", "close"];
  return requiredFields.every(
    (field) => field in sampleRow && typeof sampleRow[field] === "number"
  );
};

const OHLCChart: React.FC<{ data: OHLCData[]; colors: string[] }> = ({
  data,
  colors,
}) => {
  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    const { open, high, low, close } = payload;

    const isPositive = close >= open;
    const color = isPositive ? colors[1] || "#00ff00" : colors[0] || "#ff0000";

    const bodyHeight = Math.abs(close - open);
    const bodyY = Math.min(open, close);
    const wickX = x + width / 2;

    return (
      <g>
        {/* High-Low wick */}
        <line
          x1={wickX}
          y1={
            y +
            height -
            ((high - Math.min(...data.map((d) => d.low))) /
              (Math.max(...data.map((d) => d.high)) -
                Math.min(...data.map((d) => d.low)))) *
              height
          }
          x2={wickX}
          y2={
            y +
            height -
            ((low - Math.min(...data.map((d) => d.low))) /
              (Math.max(...data.map((d) => d.high)) -
                Math.min(...data.map((d) => d.low)))) *
              height
          }
          stroke={color}
          strokeWidth={1}
        />

        {/* Open-Close body */}
        <rect
          x={x + width * 0.2}
          y={
            y +
            height -
            ((bodyY + bodyHeight - Math.min(...data.map((d) => d.low))) /
              (Math.max(...data.map((d) => d.high)) -
                Math.min(...data.map((d) => d.low)))) *
              height
          }
          width={width * 0.6}
          height={
            (bodyHeight /
              (Math.max(...data.map((d) => d.high)) -
                Math.min(...data.map((d) => d.low)))) *
            height
          }
          fill={isPositive ? "none" : color}
          stroke={color}
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["dataMin", "dataMax"]} />
        <Tooltip
          formatter={(value: number, name: string) => [value.toFixed(2), name]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Bar dataKey="high" shape={<CandlestickBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Chart: React.FC<ChartProps> = ({ config, className = "" }) => {
  const { thread } = useTambo();
  const { messageId } = useTamboMessageContext();

  const message = thread?.messages[thread?.messages.length - 1];

  const isLatestMessage = message?.id === messageId;

  const generationStage = thread?.generationStage;
  const isGenerating =
    generationStage &&
    generationStage !== "COMPLETE" &&
    generationStage !== "ERROR";

  const {
    type,
    data,
    xAxisKey,
    yAxisKeys,
    title,
    colors = DEFAULT_COLORS,
  } = config;

  const numericFields = getNumericFields(data);
  const categoryFields = getCategoryFields(data);

  const autoXAxisKey =
    xAxisKey || categoryFields[0] || Object.keys(data[0] || {})[0];
  const autoYAxisKeys = yAxisKeys || numericFields;

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const containerStyle = {
    width: "100%",
    height: 400,
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={autoXAxisKey as string} />
              <YAxis />
              <Tooltip />
              <Legend />
              {autoYAxisKeys.map((key, index) => (
                <Bar
                  key={key as string}
                  dataKey={key as string}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={autoXAxisKey as string} />
              <YAxis />
              <Tooltip />
              <Legend />
              {autoYAxisKeys.map((key, index) => (
                <Line
                  key={key as string}
                  type="monotone"
                  dataKey={key as string}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "ohlc":
        if (isOHLCData(data)) {
          return <OHLCChart data={data} colors={colors} />;
        } else {
          return (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p className="text-red-500">
                OHLC chart requires data with open, high, low, close fields
              </p>
            </div>
          );
        }

      case "pie":
        // For pie charts, we'll use the first numeric field
        const pieDataKey = autoYAxisKeys[0];
        const pieData = data.map((item, index) => ({
          name: String(item[autoXAxisKey]),
          value: Number(item[pieDataKey]),
          index,
        }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <p className="text-red-500">Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          {title}
        </h2>
      )}

      <div style={containerStyle}>{renderChart()}</div>
    </div>
  );
};

export default Chart;
