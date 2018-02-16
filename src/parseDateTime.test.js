import parseDateTime from './parseDateTime';

describe('parseDateTime', () => {
  it('parses dates properly', () => {
    expect(parseDateTime('2/13 21:58:49.757', 2018)).toEqual(new Date(2018, 1, 13, 21, 58, 49, 757));
    expect(parseDateTime('12/13 21:58:49.757', 2018)).toEqual(new Date(2018, 11, 13, 21, 58, 49, 757));
    expect(parseDateTime('1/13 21:58:49.757', 2018)).toEqual(new Date(2018, 0, 13, 21, 58, 49, 757));
    expect(parseDateTime('1/13 21:58:49.000', 2018)).toEqual(new Date(2018, 0, 13, 21, 58, 49, 0));
    expect(parseDateTime('1/1 21:58:49.000', 2018)).toEqual(new Date(2018, 0, 1, 21, 58, 49, 0));
    expect(parseDateTime('1/1 21:58:49.000', 2019)).toEqual(new Date(2019, 0, 1, 21, 58, 49, 0));
  });
});
