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
        const rawText = "[asdf](1234) [asdf2](2234)\n[line2](3234) sdfwr [line22](4234)\n[line3](5234)";
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual(`asdf[1] asdf2[2]\nline2[3] sdfwr line22[4]\nline3[5]`);
        expect(links).toEqual(['1234', '2234', '3234', '4234', '5234']);
    })
    it('handles escapes', async () => {
        const rawText = '[[asdf\\]]((1234\\))';
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual('[asdf][1]');
        expect(links).toEqual(['(1234)']);
    })
    it('handles escaped links', async () => {
        const rawText = '\\[asdf](1234)';
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual('[asdf](1234)');
        expect(links).toEqual([]);
    })
    it('handles brackets inside', async () => {
        const rawText = "---\n\n[^(source code)](https://amirror.link/source) ^| [^(run your own mirror bot? let's integrate)](https://amirror.link/lets-talk)";
        const {text, links} = extractLinks(rawText);
        expect(text).toEqual("---\n\n^(source code)[1] ^| ^(run your own mirror bot? let's integrate)[2]");
        expect(links).toEqual(['https://amirror.link/source', 'https://amirror.link/lets-talk']);
    })
})