import correctSentence from './correctSentence';

describe('correctSentence', () => {
  test('returns correct sentence', () => {
    expect(correctSentence("greetings, friends")).toBe("Greetings, friends.");
    expect(correctSentence("Greetings, friends")).toBe("Greetings, friends.");
    expect(correctSentence("Greetings, friends.")).toBe("Greetings, friends.");
  });
  test('Возвращает false для неправильного типа данных', () => {
    expect(correctSentence(123)).toBe(false);
    expect(correctSentence(null)).toBe(false);
    expect(correctSentence(undefined)).toBe(false);
    expect(correctSentence({})).toBe(false);
    expect(correctSentence([])).toBe(false);
    expect(correctSentence(true)).toBe(false);
  });
});
