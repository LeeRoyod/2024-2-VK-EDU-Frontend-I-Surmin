import nonUniqueElements from './nonUniqueElements';


describe('nonUniqueElements', () => {
  test('returns non unique elements', () => {
    expect(nonUniqueElements([1, 2, 3, 1, 3])).toEqual([1, 3, 1, 3]);
    expect(nonUniqueElements([1, 2, 3, 4, 5])).toEqual([]);
    expect(nonUniqueElements([5, 5, 5, 5, 5])).toEqual([5, 5, 5, 5, 5]);
    expect(nonUniqueElements([10, 9, 10, 10, 9, 8])).toEqual([10, 9, 10, 10, 9]);
  });
  test('Возвращает false для неправильного типа данных', () => {
    expect(nonUniqueElements([1, "string", 3])).toBe(false);
    expect(nonUniqueElements("not an array")).toBe(false);
    expect(nonUniqueElements({})).toBe(false);
    expect(nonUniqueElements(null)).toBe(false);
    expect(nonUniqueElements(undefined)).toBe(false);
    expect(nonUniqueElements([null, 2, undefined])).toBe(false);
  });
});
