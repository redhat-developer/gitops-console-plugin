import { prometheusResultToTimeSeries } from './prometheusChartData';

describe('prometheusResultToTimeSeries', () => {
  it('maps query_range values to chart data', () => {
    const data = prometheusResultToTimeSeries({
      data: {
        result: [
          {
            metric: {},
            values: [
              [1_700_000_000, '2'],
              [1_700_000_060, '5'],
            ],
          },
        ],
      },
    });

    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({ x: new Date(1_700_000_000_000), y: 2 });
    expect(data[1]).toEqual({ x: new Date(1_700_000_060_000), y: 5 });
  });

  it('maps instant vector value to a single chart point', () => {
    const data = prometheusResultToTimeSeries({
      data: {
        result: [{ metric: {}, value: [1_700_000_000, '7'] }],
      },
    });

    expect(data).toEqual([{ x: new Date(1_700_000_000_000), y: 7 }]);
  });
});
