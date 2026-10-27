import { useMemo } from "react";
import * as echarts from "echarts/core";
import { BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import EChart from "./EChart";
import type { PollResults } from "../api/pollsService";

echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type Question = PollResults["questions"][number];

type Props = {
  question: Question;
  myChoices: number[];
};

const COLORS = [
  "#6c4cf1",
  "#ff5d8f",
  "#ff9f1c",
  "#12b3a8",
  "#2f80ed",
  "#0a7d74",
];
const MINE_COLOR = "#d6336c";
const TEXT = "#2b2550";
const TEXT_SECONDARY = "#6b6785";
const ROW_HEIGHT = 44;

const textStyle = {
  fontFamily: "Assistant, system-ui, 'Segoe UI', Arial, sans-serif",
  color: TEXT_SECONDARY,
};

type Row = Question["options"][number] & { isMine: boolean };

function donutOption(question: Question, rows: Row[]) {
  return {
    textStyle,
    title: {
      text: String(question.totalChoices),
      subtext: "קולות",
      left: "center",
      top: "34%",
      textStyle: { fontSize: 28, fontWeight: "bold", color: TEXT },
      subtextStyle: { fontSize: 14, color: TEXT_SECONDARY },
    },
    tooltip: {
      trigger: "item",
      formatter: (p: { data: Row }) =>
        `${p.data.text}<br/><b>${p.data.count}</b> קולות (${p.data.percent}%)`,
    },
    legend: {
      bottom: 0,
      itemGap: 16,
      textStyle,
      formatter: (name: string) =>
        rows.find((r) => r.text === name)?.isMine
          ? `${name} (הבחירה שלי)`
          : name,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "72%"],
        center: ["50%", "42%"],
        selectedMode: "multiple",
        selectedOffset: 10,
        avoidLabelOverlap: true,
        label: { show: false },
        itemStyle: { borderRadius: 16, borderColor: "#fff", borderWidth: 4 },
        emphasis: { scaleSize: 6 },
        data: rows.map((r, i) => ({
          ...r,
          name: r.text,
          value: r.count,
          itemStyle: { color: COLORS[i] },

          selected: r.isMine,
        })),
      },
    ],
  };
}

function barsOption(rows: Row[]) {
  return {
    textStyle,
    grid: { top: 8, bottom: 8, left: 56, right: 140 },
    tooltip: {
      trigger: "item",
      formatter: (p: { data: Row }) =>
        `${p.data.text}<br/><b>${p.data.count}</b> קולות (${p.data.percent}%)`,
    },

    xAxis: {
      type: "value",
      inverse: true,
      show: false,
      max: (v: { max: number }) => Math.max(v.max * 1.15, 1),
    },
    yAxis: {
      type: "category",
      inverse: true,
      position: "right",
      data: rows.map((r) => r.text),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: TEXT,
        fontSize: 14,
        width: 120,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar",
        barWidth: 18,
        showBackground: true,
        backgroundStyle: { color: "#f3f0ff", borderRadius: 999 },
        label: {
          show: true,
          position: "left",
          color: TEXT,
          fontSize: 13,
          formatter: (p: { data: Row }) =>
            `${p.data.count} (${p.data.percent}%)`,
        },
        data: rows.map((r) => {
          const base = r.isMine ? MINE_COLOR : COLORS[0];
          return {
            ...r,
            value: r.count,
            itemStyle: {
              borderRadius: 999,
              color: {
                type: "linear",
                x: 1,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  { offset: 0, color: base },
                  { offset: 1, color: `${base}99` },
                ],
              },
            },
          };
        }),
      },
    ],
  };
}

function QuestionChart({ question, myChoices }: Props) {
  const rows: Row[] = useMemo(
    () =>
      question.options.map((o) => ({ ...o, isMine: myChoices.includes(o.id) })),
    [question, myChoices],
  );
  const hasMine = rows.some((r) => r.isMine);
  const isDonut = !question.allowMultiple;

  const option = useMemo(
    () => (isDonut ? donutOption(question, rows) : barsOption(rows)),
    [isDonut, question, rows],
  );

  const height = isDonut ? 320 : rows.length * ROW_HEIGHT + 16;

  return (
    <div>
      <h4>{question.text}</h4>

      <div
        className="chart-frame"
        role="img"
        aria-label={`דיאגרמת תוצאות לשאלה: ${question.text}`}
      >
        <EChart option={option} height={height} />
      </div>

      {hasMine && !isDonut && (
        <p style={{ color: TEXT_SECONDARY, fontSize: 13 }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 2,
              background: MINE_COLOR,
              marginInlineEnd: 6,
            }}
          />
          הבחירה שלי
        </p>
      )}

      <details>
        <summary>הצגה כטבלה</summary>
        <table>
          <thead>
            <tr>
              <th>תשובה</th>
              <th>קולות</th>
              <th>אחוז</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.text} {r.isMine && "(הבחירה שלי)"}
                </td>
                <td>{r.count}</td>
                <td>{r.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default QuestionChart;
