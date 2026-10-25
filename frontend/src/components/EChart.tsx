import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import type { EChartsCoreOption } from "echarts/core";

type Props = {
  option: EChartsCoreOption;
  height: number;
};

// עוטף את ECharts ברכיב React: יוצר את הדיאגרמה פעם אחת, מעדכן אותה כשה-option משתנה,
// משנה את הגודל עם הדף, ומנקה כשהרכיב יורד מהמסך
function EChart({ option, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chart = echarts.init(container);
    chartRef.current = chart;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
}

export default EChart;
