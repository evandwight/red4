import { extractLinks } from 'lib/userText';

describe('extractLinks', () => {
    it('handles link at the start', async () => {
        const rawText = '[asdf](1234)';
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual('asdf[1]');
        expect(links).toEqual(['1234']);
    })
    it('handles multiple links in a line', async () => {
        const rawText = ' [asdf](1234) [asdf2](2234)';
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual(' asdf[1] asdf2[2]');
        expect(links).toEqual(['1234', '2234']);
    })
    it('handles multiple lines', async () => {
        const rawText = `[asdf](1234) [asdf2](2234)
[line2](3234) sdfwr [line22](4234)
 [line3](5234)`;
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual(`asdf[1] asdf2[2]
line2[3] sdfwr line22[4]
 line3[5]`);
        expect(links).toEqual(['1234', '2234', '3234', '4234', '5234']);
    })
})