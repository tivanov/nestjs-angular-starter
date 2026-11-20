import { PrettyJsonPipe } from './pretty-json.pipe';

describe('PrettyJsonPipe', () => {
  let pipe: PrettyJsonPipe;

  const invalidJson = `{
   <span class="key">"error":</span> <span class="string">"Invalid JSON"</span>
}`;

  beforeEach(() => {
    pipe = new PrettyJsonPipe();
  });

  it('highlights keys, strings, numbers, booleans, and null', () => {
    const input = { name: 'Ada', count: 2, active: true, note: null };
    const expected = `{
   <span class="key">"name":</span> <span class="string">"Ada"</span>,
   <span class="key">"count":</span> <span class="number">2</span>,
   <span class="key">"active":</span> <span class="boolean">true</span>,
   <span class="key">"note":</span> <span class="null">null</span>
}`;

    expect(pipe.transform(input)).toBe(expected);
  });

  it('pretty-prints a JSON string the same way as the parsed value', () => {
    const input = { name: 'Ada', count: 2, active: true, note: null };

    expect(pipe.transform(JSON.stringify(input))).toBe(pipe.transform(input));
  });

  it('highlights array values', () => {
    const expected = `[
   <span class="number">1</span>,
   <span class="string">"two"</span>,
   <span class="boolean">false</span>,
   <span class="null">null</span>
]`;

    expect(pipe.transform([1, 'two', false, null])).toBe(expected);
  });

  it('highlights nested objects', () => {
    const expected = `{
   <span class="key">"outer":</span> {
      <span class="key">"inner":</span> <span class="boolean">true</span>
   }
}`;

    expect(pipe.transform({ outer: { inner: true } })).toBe(expected);
  });

  it('escapes html characters before highlighting', () => {
    const expected = `{
   <span class="key">"html":</span> <span class="string">"a &lt; b &amp; c &gt; d"</span>
}`;

    expect(pipe.transform({ html: 'a < b & c > d' })).toBe(expected);
  });

  it('highlights decimals and scientific notation', () => {
    const expected = `{
   <span class="key">"n":</span> <span class="number">-1.5</span>,
   <span class="key">"sci":</span> <span class="number">1e+21</span>
}`;

    expect(pipe.transform({ n: -1.5, sci: 1e21 })).toBe(expected);
  });

  it('highlights primitive json values', () => {
    expect(pipe.transform(null)).toBe('<span class="null">null</span>');
    expect(pipe.transform(42)).toBe('<span class="number">42</span>');
    expect(pipe.transform(true)).toBe('<span class="boolean">true</span>');
    expect(pipe.transform('"Ada"')).toBe('<span class="string">"Ada"</span>');
  });

  it('does not add line numbers by default', () => {
    expect(pipe.transform({ a: 1 })).not.toContain('number-line');
  });

  it('prefixes each line when line numbers are requested', () => {
    const expected = `<span class="number-line pl-3 select-none" >1 </span>{
<span class="number-line pl-3 select-none" >2 </span>   <span class="key">"a":</span> <span class="number">1</span>
<span class="number-line pl-3 select-none" >3 </span>}`;

    expect(pipe.transform({ a: 1 }, true, 2)).toBe(expected);
  });

  it('returns highlighted invalid JSON when the value cannot be parsed', () => {
    expect(pipe.transform('{')).toBe(invalidJson);
    expect(pipe.transform('')).toBe(invalidJson);
    expect(pipe.transform(undefined)).toBe(invalidJson);
  });

  it('returns highlighted invalid JSON for circular values', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(pipe.transform(circular)).toBe(invalidJson);
  });

  it('colors a string without parsing or reindenting it', () => {
    expect(pipe.applyColors('{"a":1}')).toBe(
      '{<span class="key">"a":</span><span class="number">1</span>}',
    );
  });
});
