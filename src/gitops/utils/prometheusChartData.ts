/* Chart datum for PatternFly Victory charts */
export type PrometheusChartDatum = { x: Date; y: number };

type PrometheusSampleTuple = [number, string];

type PrometheusQueryResult = {
  metric?: Record<string, string>;
  value?: PrometheusSampleTuple;
  values?: PrometheusSampleTuple[];
};

type PrometheusQueryResponse = {
  data?: {
    result?: PrometheusQueryResult[];
  };
};

const parseSample = ([timestamp, value]: PrometheusSampleTuple): PrometheusChartDatum => ({
  x: new Date(timestamp * 1000),
  y: parseFloat(value),
});

/**
 * Converts a Prometheus query_range matrix or instant vector into ChartLine data.
 * Uses `values` when present (range query); otherwise a single `value` sample (instant query).
 */
export const prometheusResultToTimeSeries = (
  response: PrometheusQueryResponse | undefined,
  seriesIndex = 0,
): PrometheusChartDatum[] => {
  const series = response?.data?.result?.[seriesIndex];
  if (!series) {
    return [];
  }

  if (series.values?.length) {
    return series.values.map(parseSample).filter((datum) => !Number.isNaN(datum.y));
  }

  if (series.value) {
    const datum = parseSample(series.value);
    return Number.isNaN(datum.y) ? [] : [datum];
  }

  return [];
};
